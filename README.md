<<<<<<< HEAD
# StackUnderflow-HCL-Hackathon-25-26
=======
# Complete Hotel Booking System

An enterprise-grade, modern Web Application for browsing, searching, and booking luxury hotel accommodations. Built with a robust Spring Boot backend and an aesthetically stunning React frontend.

## Tech Stack
- **Database**: MySQL Connect
- **Backend API**: Java 17, Spring Boot 3.2, Spring Security + JWT, Spring Data JPA, Hibernate, OpenAPI (Swagger)
- **Frontend UI**: React 18, Vite, React Router DOM, Axios, Lucide React (Icons), Custom Glassmorphism CSS

## Folder Structure
```text
Hotel_project/
├── database/         # MySQL Initialization Scripts (Schema + Seed Data)
├── backend/          # Spring Boot Application (Port 8080)
└── frontend/         # Vite React Application (Port 5173)
```

---

## 🚀 Setup & Run Instructions

### 1. Database Initialization
1. Ensure you have a local MySQL Server running.
2. Execute the `database/init.sql` script into your MySQL server to automatically create the schema, tables, relationships, and populate dummy data (roles, hotels, amenities, and an admin user).

### 2. Backend Setup
1. Open the `backend/src/main/resources/application.yml` file.
2. Verify / Modify your MySQL credentials:
    ```yaml
    username: root
    password: password # <-- Change to your local MySQL password
    ```
3. Open a terminal context in the `backend/` directory.
4. Run the application:
    ```bash
    mvn spring-boot:run
    ```
5. The API will start on `http://localhost:8080`.
6. Swagger UI is generated and available at `http://localhost:8080/swagger-ui.html`.

### 3. Frontend Setup
1. Open a terminal context in the `frontend/` directory.
2. Install dependencies (already initialized if scaffolded, but safe to run):
    ```bash
    npm install
    ```
3. Run the development server:
    ```bash
    npm run dev
    ```
4. The web application will launch at `http://localhost:5173`. Open in your browser!

---

## 🔑 Authentication
The `init.sql` script creates a default Admin user:
- **Email:** `admin@hotel.com`
- **Password:** `admin123`

You can also use the UI to Register a new standard user or log in immediately to make reservations.

## 📄 API Endpoints Summary
- `POST /api/auth/register` - Create user
- `POST /api/auth/login` - Authenticate & receive JWT
- `GET /api/hotels` - List all hotels
- `GET /api/hotels?location=Query` - Search hotels
- `GET /api/hotels/{id}` - Hotel details
- `GET /api/hotels/{id}/rooms/available` - Get available rooms for hotel
- `POST /api/bookings` - Create reservation (Requires JWT Auth)
- `GET /api/bookings/my-bookings` - Fetch user bookings (Requires JWT Auth)
>>>>>>> ea62209 (Initial commit - Add all project files)
