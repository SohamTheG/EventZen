
### Phase 1: The Bedrock (Do This Immediately) status: done
<!-- 
1. **Verify & Enforce JWT Auth:** * *Why first?* Everything else relies on identity. You cannot manage attendees, assign host permissions, or book tickets if you don't have a rock-solid, decoded JWT telling the microservices exactly who the user is and what their role is (`ADMIN`, `HOST`, `CUSTOMER`). We need to ensure the API Gateway is properly validating tokens before we build complex logic.
2. **The "Baseline" Deployment & Persistent Storage:**
* *Why second?* You nailed it—deploying at the last minute is a nightmare. We need to set up a free-tier cloud environment (using services like Render, Railway, or Supabase/Aiven for free MySQL/Redis hosting). This gives us persistent data that doesn't wipe when Docker restarts, and creates a live environment to test new features. -->



### Phase 2: Core Domain Logic (Data & Constraints)

Before people can buy tickets, the backend needs to know how much things cost and if the venue is even available.
<!-- 
// TODO 3. **Date Conflict Management:**
* *The feature:* A venue cannot be booked by two different events on the same day.
* *The fix:* Update the `bookings` schema and logic in the `events-booking-service` to query existing dates before approving a new booking. --> status : done


// TODO 4. **Costs & Financials:** status : done
* *The feature:* Adding `cost_per_ticket`, venue booking fees, and vendor costs.
* *The fix:* Schema updates across `venue_service_db` and `events_booking_db`.



### Phase 3: The Transaction Engine

Now that dates and money exist, we can let users actually do things.

// TODO 5. **Capacity & Ticket Booking:** status : done
* *The feature:* Tracking how many tickets are sold vs. the venue's `capacity`.
* *The fix:* Complex logic. When a user buys a ticket, we must ensure `tickets_sold < venue.capacity`. This might require another RabbitMQ event to keep services synced!


// TODO 6. **QR Code Generation:** Status : done also added ticket scanner on admin side
* *The feature:* Generating a unique QR code for the ticket.
* *The fix:* This is an easy add-on to the Ticket Booking flow. Once a ticket is booked in MySQL, a Node.js or Java library generates a QR code string/image and saves it to the `attendees` table.



### Phase 4: The UI/UX Overhaul & Core Capabilities

With the backend fully powered up, we expose it beautifully to the frontend and add basic searching.

// TODO 7. **User Dashboard Redesign:**
* *The feature:* Changing the landing page to show current events and venues rather than empty stats.
* *The fix:* High-impact UI updates on the frontend to display dynamic lists/grids using existing backend endpoints.


// TODO 8. **Interactive Event Calendar:**
* *The feature:* A Google Calendar-style UI component allowing users to see all events at a glance.
* *The fix:* Use `@mui/x-date-pickers` in the frontend, styled to resemble Google Calendar, fetching dates from the backend.


// TODO 9. **Host Attendee Management:**
* *The feature:* Allowing an Event Host to manipulate their specific event's attendees.
* *The fix:* Role-Based Access Control (RBAC) tied directly to the JWT. Add new endpoints to the Event Service (Port 9002) for hosts.


### Phase 5: The "Boss Level"

// TODO 10. **Simple Text-Based Search:**
* *The feature:* Global search functionality for events and venues.
* *The fix:* A simple word search implemented on the frontend with a global search bar, filtering through the fetched events and venues. We will skip complex ML/Elasticsearch infrastructure to maintain an easy deployment path.



---