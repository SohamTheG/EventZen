
# Architecture Context: Event Management System (EventZen)

## 1. System Overview
EventZen is a full-stack, microservice-based Event Management System. It handles JWT-based user authentication, venue/vendor management, event bookings, financial tracking, capacity management, and digital attendee ticketing with native QR-based admission.

## 2. Frontend Architecture
* **Framework:** React 19
* **UI Library:** Material UI (MUI) with custom theme components (`AppTheme`, `xThemeComponents`).
* **Layout:** Mobile-responsive utilizing conditional MUI `Drawer` components (slide-in temporary drawer for mobile, permanent side menu for desktop).
* **Routing:** separate file for routing in between pages. once sign in as customer or admin, the components are rendered based on items clicked on sidemenu.
* **State & Networking:** Custom `apiClient` (Axios) with HTTP interceptors automatically attaching `Bearer` JWT tokens from `localStorage`. Optional chaining is enforced for error handling to prevent UI crashes.
* **Integrations:** `@yudiel/react-qr-scanner` for native, browser-based mobile QR scanning.
* **Hosting:** Deployed on Vercel (`event-zen-two`).

## 3. Backend Architecture (Microservices)
The backend enforces a microservice architecture behind an API Gateway, with services running in Docker containers on a single AWS EC2 instance (`13.235.77.80`).

* **API Gateway:** Sits between the React frontend and the microservices, handling route resolution, centralized CORS configuration, and initial JWT token validation (allowing `OPTIONS` preflight requests through without tokens) before forwarding requests to the internal ports.
* **User & Event Service (Java / Spring Boot - Port 9002):** Handles authentication, attendee management, role-based access control (RBAC: `ADMIN`, `HOST`, `CUSTOMER`), and secure ticket viewing (`/api/attendees/ticket/view/{uuid}`).
* **Venue & Vendor Service (Node.js - Port 9001):** Handles CRUD operations for venues, vendors, and the junction mappings between them.

## 4. Cloud Infrastructure & Integrations
* **Database Hosting (Aiven):** Cloud-hosted MySQL instances. The system strictly enforces database-per-service isolation across three databases:
  * `userattendeesdb`
  * `events_booking_db`
  * `venue_service_db`
* **Caching (Upstash):** Serverless Redis used as a "Surgical Cache" to optimize high-frequency data reads.
* **Message Broker (CloudAMQP):** RabbitMQ cluster used for asynchronous cross-service communication (e.g., syncing ticket sales with venue capacity, syncing bookings).
* **CI/CD Pipeline:** GitHub Actions automatically builds and deploys backend Docker containers to AWS EC2. Vercel handles automated frontend deployments from the `main` branch.

## 5. Database Schemas & Relationships
Data is physically isolated by service but logically related via IDs.

### A. User & Attendee Service (`userattendeesdb`)
* `users` table: `id`, `email`, `password`, `name`, `role`.
* `attendees` table: `id`, `user_id`, `event_id`, `status`.
* **Constraint:** `user_id` in `attendees` references `users(id)`.

### B. Events & Booking Service (`events_booking_db`)
* `events` table: `id`, `name`, `description`, `host_id`, `is_public`, `ticket_price`.
* `bookings` table: `id`, `event_date`, `status` (ENUM), `venue_id`, `event_id`, `total_amount_due`.
* **Constraint:** `event_id` in `bookings` is UNIQUE and references `events(id)`.

### C. Venue Service (`venue_service_db`)
* `venues` table: `id`, `name`, `location`, `capacity`, `price_per_day`, `is_available`.
* `vendors` table: `id`, `name`, `type`, `service_fee`.
* `venuevendors` table: Junction table linking `VenueId` and `VendorId` with cascade deletes.

### D. Logical Cross-Service Mappings (Agent Warning)
Do not attempt SQL JOINs across these logical links. They must be resolved via API calls or RabbitMQ events:
* `attendees.event_id` maps to `events_booking_db.events(id)`.
* `bookings.venue_id` maps to `venue_service_db.venues(id)`.
* `events.host_id` maps to `userattendeesdb.users(id)`.

## 6. Active Business Logic & Constraints
When implementing new features, the following domain rules must be enforced:
* **Date Conflict Management:** A venue cannot be booked by two different events on the same day. The `events_booking_db` must query existing dates before approving a `PENDING` booking.
* **Capacity Enforcement:** `tickets_sold` must never exceed `venue.capacity`. Purchasing a ticket requires verifying capacity across microservices via RabbitMQ or synchronous API Gateway calls.
* **Financial Tracking:** Schema extensions actively track costs (`price_per_day`, `ticket_price`, `service_fee`). The UI aggregates these fields to compute `total_amount_due` dynamically during the booking process.
* **Security (The Bouncer Model):** Digital tickets are never exposed via public URLs. Venue staff must use the protected `AdminTicketScanner` to securely fetch data using their own Admin JWT.

## 7. Environment Configuration (`.env`)
The system relies on strict environment variable configuration across environments.
* Frontend requires environment-specific files (`.env.development` pointing to `http://localhost:8080` for local dev, and `.env.production` pointing to the cloud API Gateway). Note that modifying these files requires restarting the `npm start` dev server.
* Backend `.env` requires credentials for Aiven MySQL, Upstash Redis, CloudAMQP, and JWT Secret Keys.

## 8. Roadmap & Pending Features (Do Not Implement Yet)
* **Interactive Event Calendar:** Frontend UI integration pulling secured dates into `react-big-calendar`.
* **making ui mobile friendly:** Frontend UI should look good for mobile devices as well as websites.
* **Host Attendee Management:** Frontend dashboard allowing Event Hosts to manage their specific attendees based on RBAC.
* **ML-Based Search:** Future integration of Elasticsearch or vector search for events/venues once data volume increases.

```