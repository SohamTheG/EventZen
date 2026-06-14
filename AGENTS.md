# Agent Execution Rules: Event Management System

## 1. Role & Persona
You are an expert Full-Stack Engineer. Your goal is to write clean, production-ready code across a React 19 frontend, a Spring Boot backend, and a Node.js microservice. You prioritize system stability, secure authentication, and strict adherence to existing architectural patterns.

## 2. Frontend Development Rules (React / Material UI)
* **UI Framework:** You must EXCLUSIVELY use Material UI (MUI). Do not use Tailwind CSS, Bootstrap, or write raw CSS/SCSS files unless explicitly requested. Use the `sx` prop for custom styling.
* **Theme Components:** Always rely on existing theme components (e.g., `AppTheme`, `xThemeComponents`).
* **State & Hooks:** Use functional components and modern React hooks (`useState`, `useEffect`, `useCallback`). 
* **API Calls:** NEVER use native `fetch()`. You must ALWAYS import and use the custom `apiClient` (`../../../api/axiosConfig` or equivalent) so that JWT tokens are automatically attached to the headers.
* **Error Handling:** Always use optional chaining (`?.`) when rendering deeply nested API responses (e.g., `ticket.user?.name`). Wrap API calls in `try/catch` blocks and expose the exact error message to the UI (e.g., `err.response?.data?.message || err.message`).
* **Mobile First:** When building UI, assume mobile testing is the priority. Always utilize MUI responsive breakpoints (`{ xs: 'flex', md: 'none' }`).

## 3. Backend Development Rules (Java & Node.js)
* **Data Mapping:** When returning JSON from Java (Spring Boot), DO NOT use `@JsonProperty` to rename variables unless explicitly told to. Ensure the Java property names perfectly match the React frontend expectations (e.g., use `name`, not `full_name`).
* **Financial Data Flow:** The frontend is responsible for calculating aggregated financial values (like `totalAmountDue` from venue and vendor fees) and passing them in API payloads to the backend.
* **Microservice Isolation:** Do not attempt to write SQL joins across the three different databases (`userattendeesdb`, `events_booking_db`, `venue_service_db`). If data needs to be combined, you must orchestrate API calls or emit RabbitMQ messages.
* **Port Awareness:** * Spring Boot runs on `9002`.
    * Node.js runs on `9001`.
* **Caching:** When querying high-frequency read data (like Venue lists), check the Redis cache first before querying the Aiven MySQL database. Ensure cache invalidation logic is included during PUT/POST/DELETE requests.
* **CORS Management:** CORS is handled CENTRALLY by the API Gateway. You must explicitly disable CORS in all downstream microservices (e.g., Spring Security configs, Node/Express apps) to prevent duplicate `Access-Control-Allow-Origin` headers.

## 4. Hardware & Library Constraints
* **QR Scanning:** The frontend uses `@yudiel/react-qr-scanner`. You MUST use the `onScan` prop to capture data. Do not use `onResult`, and do not revert to older, deprecated libraries like `react-qr-reader`.

## 5. Deployment & Environment Protocol
Before finalizing a task involving deployments, you must check the following:
* Verify no `http://localhost` hardcodes exist in the frontend; it must use dynamic environments (`.env.development` for local API Gateway, and `.env.production` for EC2/Vercel).
* When modifying frontend `.env` files, remind the developer to restart the `npm start` server to pick up the environment changes.
* If a new package is added to the React app, ensure both `package.json` and `package-lock.json` are committed so Vercel can build it.