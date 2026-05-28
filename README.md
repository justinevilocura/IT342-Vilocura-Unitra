# Unitra - SME Resource Sharing Platform

Unitra is a comprehensive platform designed to facilitate resource sharing among Small and Medium Enterprises (SMEs). It connects businesses, enabling them to share equipment, spaces, services, and other resources to reduce costs and foster collaboration.

## 🚀 Features

- **User Registration & Authentication:** Secure JWT-based login and signup with automated email verification for new users.
- **SME Profiles & Status Management:** Maintain business profiles, track verification status, and manage platform reputation.
- **Resource Marketplace:** Browse, list, and search for available resources shared by other SMEs.
- **Booking System:** Seamlessly request, approve, and manage resource bookings and schedules.
- **Cross-Platform Access:** Accessible via a modern web interface and a dedicated mobile application.

## 🛠️ Technology Stack

Unitra's architecture is composed of three main components:

### Backend (Spring Boot)
- **Framework:** Java 17, Spring Boot 3.5.x
- **Database:** PostgreSQL (via Spring Data JPA)
- **Security:** Spring Security, JWT (JSON Web Tokens)
- **Email:** Spring Boot Starter Mail for automated verifications

### Web Application (Frontend)
- **Framework:** React 19, Vite
- **Routing:** React Router DOM
- **UI Components:** Lucide React for iconography
- **Testing:** Vitest, React Testing Library

### Mobile Application
- **Platform:** Android (Gradle/Kotlin based)

## 📂 Project Structure

```
IT342-Vilocura-Unitra/
├── backend/
│   └── unitra/         # Spring Boot backend application
├── web/                # React (Vite) frontend application
└── mobile/
    └── Unitra/         # Android mobile application
```

## ⚙️ Getting Started

### Prerequisites
- [Java 17+](https://adoptium.net/)
- [Node.js 18+](https://nodejs.org/)
- [PostgreSQL](https://www.postgresql.org/)
- [Android Studio](https://developer.android.com/studio) (for mobile development)

### Running the Backend
1. Navigate to the backend directory:
   ```bash
   cd backend/unitra
   ```
2. Configure your database and email settings in `src/main/resources/application.properties`.
3. Start the Spring Boot application:
   ```bash
   ./mvnw spring-boot:run
   ```

### Running the Web Frontend
1. Navigate to the web directory:
   ```bash
   cd web
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

### Running the Mobile App
1. Open the `mobile/Unitra` folder in Android Studio.
2. Sync the Gradle files.
3. Run the application on an emulator or physical device.
