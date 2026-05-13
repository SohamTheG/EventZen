# 🧠 EventZen (Event-Management-sys) - AI Assistant Context File

## 🎯 Project Overview
EventZen is a cloud-native, polyglot microservice platform for enterprise event management. It handles users, venues, vendors, event scheduling, and attendee tracking.

## 🏗️ Architecture Stack
- **Frontend:** React.js (`manager-sys`)
- **Backend Languages:** Java (Spring Boot), Node.js (Express)
- **Message Broker:** RabbitMQ (Asynchronous Event-Driven Architecture)
- **API Gateway:** Spring Cloud Gateway (MVC/Synchronous pattern)
- **Database:** MySQL (Database-per-service pattern)
- **Caching:** Redis (Planned/Surgical implementation)
- **Infrastructure:** Docker & Docker Compose

## 📦 Microservices Dictionary

### 1. `api-gateway` (Port: 8080)
- **Tech:** Java, Spring Boot (Spring WebMVC, NOT WebFlux).
- **Role:** Central entry point, routes traffic, and handles **API Aggregation** (e.g., `AdminDashboardController` uses `RestClient` and `CompletableFuture` to fetch data from multiple services simultaneously to prevent Chatty UI).

### 2. `user-auth-service` (Port: 9000)
- **Tech:** Java, Spring Boot.
- **Role:** Handles JWT Authentication, User Profiles, and Attendees.
- **Database:** `userattendeesdb`

### 3. `venue-vendor-service` (Port: 9001)
- **Tech:** Node.js, Express, Sequelize ORM.
- **Role:** Manages Venues, Vendors, and associations.
- **RabbitMQ Consumer:** Listens to `venue-booking-queue` to asynchronously mark venues as unavailable when booked.
- **Database:** `venue_service_db`

### 4. `events-booking-service` (Port: 9002)
- **Tech:** Java, Spring Boot, Spring Data JPA.
- **Role:** Manages Events and Bookings.
- **RabbitMQ Producer:** Sends `Booking` payloads to `venue-booking-queue`.
- **Database:** `events_booking_db`

## 🗄️ Database Schemas (MySQL)

### `userattendeesdb`
- `users`: id, email, password, name, role
- `attendees`: id, user_id (FK), event_id, status

### `events_booking_db`
- `events`: id, description, host_id, is_public (bit), name
- `bookings`: id, event_date, status (ENUM: PENDING, APPROVED, REJECTED, CANCELLED), venue_id, event_id (FK)

### `venue_service_db` (Managed by Sequelize)
- `vendors`: id, name, type, createdAt, updatedAt
- `venues`: id, name, location, capacity, price_per_day, **is_available (BOOLEAN, default: true)**, createdAt, updatedAt
- `venuevendors`: VenueId, VendorId (Many-to-Many junction)

## 🚦 Architectural Rules & Patterns (CRITICAL INSTRUCTIONS FOR AI)

1. **The "Fire and Forget" Rule (RabbitMQ):** - Never use synchronous HTTP calls between microservices to update state. If Service A needs Service B to change its database, Service A must publish a message to RabbitMQ.
   - Example: `events-booking-service` publishes to `venue-booking-queue`. `venue-vendor-service` consumes it and updates `is_available` to `false`.

2. **The "Personal Shopper" Rule (API Gateway):**
   - Do not allow the React frontend to make multiple API calls to render a single dashboard (Chatty UI). 
   - Write Aggregator endpoints in `api-gateway` using `CompletableFuture` to fetch and stitch JSONs together.

3. **The "Surgical Cache" Rule (Redis):**
   - Do not cache everything. Only cache **High Read, Low Write** endpoints.
   - Example: `GET /api/venues` should be cached. `GET /api/bookings` should NOT be cached (requires real-time accuracy).

4. **Polyglot Awareness:**
   - Always check which directory you are in before suggesting code. If you are in `venue-vendor-service`, write Node.js/Sequelize. If in `events-booking-service`, write Java/Spring Boot.

5. **Current Project State:**
   - Docker containerization is complete.
   - Base RabbitMQ implementation is complete (Venue booking triggers unavailability).
   - Gateway Aggregator for Admin Dashboard is complete.
   - Implemented Redis caching in `venue-vendor-service` for the `/api/venues` endpoint.
6. **Future possible feature implementations**
   - features to implement using all the technologies possible
   - consider the best possible order of implementation for the below
   - capacity - ticket booking for attendees
   - Cost per ticket, cost for booking venues, vendor costs
   - managing days for events - like conflict of venues on same day
   - add a calender similar to google calender to see all the events date wise
   - deployment of app - not sure to do this immediately or after everything is done. also considering doing all of  it for free. bcoz i dont want to do it last minute and also i need persistent storage unline current one that keeps resetting.
   - ML based search bars for searching events , venues and attendees users
   - generate unique qr codes for booked tickets like u get on movie tickets type stuff 
   - i am not sure if the jwt auth i have implemented or not. if possible implement it before i do everything on the   list
   - attendee management. on both admin side and if the user is hosting an event then he should also be able to manipulate the event
   - change user dashboard to main page with current events and venues directly as they dont need their own   statistics