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
   - **NEXT IMMEDIATE STEP:** Implement Redis caching in `venue-vendor-service` for the `/api/venues` endpoint.