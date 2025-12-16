# ⚡ Flash Card App API

**Project Overview:** This is a robust, secure, and performance-optimized backend API designed to power a modern flash card application. It provides structured endpoints for complete user management, secure authentication, and CRUD operations for decks and cards, with built-in features for data export and administrative controls.

## 🛠️ Technology Stack

This project is built using modern JavaScript and follows best practices for a scalable and secure backend application.

* **Runtime:** Node.js
* **Framework:** Express.js
* **Language:** TypeScript (Implied by imports and modern JS features)
* **Configuration:** Uses `dotenv` for managing environment variables and a centralized `config.ts`/`env-config.js` file for structured access to configuration values.
* **Security (Core):**
    * `helmet`: Used to secure the Express app by setting various HTTP headers.
    * `express-rate-limit`: Implemented to limit repeated requests to public and sensitive APIs.
* **Authentication:** Utilizes JWT via `cookie-parser` for managing user sessions and secure, token-based access control.
* **Deployment:** Environment variables include specific keys for image hosting (likely **Cloudinary**).

## ⚙️ Setup and Installation

### Prerequisites

* Node.js (v18 or higher recommended)
* npm or yarn

### Local Setup

1.  **Clone the repository:**
    ```bash
    git clone [Your-Repo-URL]
    cd flash-card-app-api
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```
3.  **Configure Environment Variables:**
    The application configuration is managed using a `.env` file, loaded via `dotenv`. You must create this file in the root directory and populate it with the required keys as defined in the application's configuration structure.

    #### 🔑 Required `.env` Variables

    | Key | Type | Description |
    | :--- | :--- | :--- |
    | `PORT` | `number` | The port the server will run on (e.g., `3000`). |
    | `DATABASE_URL` | `string` | Connection string for the database (e.g., MongoDB URI). |
    | `JWT_SECRET` | `string` | A strong, secret key for signing JSON Web Tokens. |
    | `NODE_ENV` | `string` | Environment mode (`development` or `production`). |
    | `CLOUDINARY_CLOUD_NAME` | `string` | Cloudinary cloud name for image storage. |
    | `CLOUDINARY_API_KEY` | `string` | Cloudinary API key. |
    | `CLOUDINARY_API_SECRET` | `string` | Cloudinary API secret. |
    | `FRONTEND_URL` | `string` | The URL of the frontend application (for CORS, etc.). |

    ```env
    # Example .env file
    PORT=3000
    DATABASE_URL=mongodb://localhost:27017/flashcards
    JWT_SECRET=YOUR_SUPER_SECURE_SECRET_KEY
    NODE_ENV=development
    
    # Cloudinary Configuration
    CLOUDINARY_CLOUD_NAME=your_cloud_name
    CLOUDINARY_API_KEY=123456789012345
    CLOUDINARY_API_SECRET=super_secret_cloudinary_key
    
    FRONTEND_URL=http://localhost:5173
    ```

4.  **Start the server:**
    ```bash
    # Assuming you have a start script like 'npm run dev' or 'npm start'
    npm start
    ```
    The server will run on the port specified in your environment config.

## 🛡️ Security & Error Handling

### Rate Limiting

The API uses `express-rate-limit` to restrict traffic.

* **Limit:** 100 requests.
* **Window:** 10 minutes (600,000 milliseconds).

### Global Error Handling

* **404 Handler:** Requests to non-existent routes are captured by the `NotFoundMiddleware`.
* **Centralized Error Handling:** All operational errors are processed by the `globalErrorHandler`, ensuring consistent and clean error responses across the entire application.

## 🚀 API Endpoints

The API is versioned under `/api/v1/`.

### 1. General & Health Check

| Method | Endpoint | Description | Status |
| :----- | :------- | :---------- | :----- |
| `GET` | `/` | Basic health check. Returns status `200` with `{"message": "Hello world"}`. | Public |

### 2. Authentication (`/api/v1/auth`)

| Method | Endpoint | Description | Middleware |
| :----- | :------- | :---------- | :--------- |
| `POST` | `/login` | Authenticates a user and issues a token/cookie. | None |
| `POST` | `/signup` | Registers a new user account. | None |
| `POST` | `/logout` | Clears the user's session cookie/token. | `verifyToken` |

### 3. Profile (`/api/v1/profile`)

All profile routes require user authentication (`verifyToken`).

| Method | Endpoint | Description | Middleware |
| :----- | :------- | :---------- | :--------- |
| `GET` | `/` | Retrieve the current user's profile data. | `verifyToken` |
| `PUT` | `/` | Update the current user's data (e.g., name, email). | `verifyToken` |
| `DELETE` | `/` | Permanently delete the current user's account. | `verifyToken` |
| `PUT` | `/change-password` | Update the current user's password. | `verifyToken` |
| `POST` | `/upload-image` | Upload a new profile image using the file field **"image"**. | `verifyToken`, `upload.single("image")` |
| `DELETE` | `/delete-image` | Remove the current profile image. | `verifyToken` |

### 4. Users (Admin & Public Access) (`/api/v1/users`)

| Method | Endpoint | Description | Middleware |
| :----- | :------- | :---------- | :--------- |
| `GET` | `/` | **Admin Only:** Retrieve a list of all users. | `verifyToken`, `isAdmin` |
| `GET` | `/:id` | Retrieve a specific user's public profile (requires login). | `verifyToken` |
| `DELETE` | `/:id` | **Admin Only:** Delete a specific user account. | `verifyToken`, `isAdmin` |
| `POST` | `/:id/role` | **Admin Only:** Toggle a specific user's role (e.g., Admin status). | `verifyToken`, `isAdmin` |
| `GET` | `/:id/deck` | Retrieve a specific user's **public** decks. | `verifyToken` |
| `GET` | `/:id/deck/:deckId` | Retrieve a specific deck from a specific user. | `verifyToken` |
| `GET` | `/:id/deck/stats` | Get statistics for a specific user's decks. | `verifyToken` |

### 5. Deck Management (`/api/v1/deck`)

All deck routes require user authentication (`verifyToken`).

| Method | Endpoint | Description | Middleware |
| :----- | :------- | :---------- | :--------- |
| `GET` | `/` | Retrieve all decks belonging to the current user. | `verifyToken` |
| `POST` | `/` | Create a new flash card deck. | `verifyToken` |
| `GET` | `/stats` | Get statistics across all of the current user's decks. | `verifyToken` |
| `GET` | `/:deckId` | Retrieve a specific deck. | `verifyToken` |
| `PUT` | `/:deckId` | Update the details (name, description, etc.) of a specific deck. | `verifyToken` |
| `DELETE` | `/:deckId` | Delete a specific deck. | `verifyToken` |
| `PUT` | `/:deckId/visibility` | Toggle the public visibility status of a deck. | `verifyToken` |
| `GET` | `/:deckId/export/json` | Download the deck data as a JSON file. | `verifyToken` |
| `GET` | `/:deckId/export/excel` | Download the deck data as an Excel file. | `verifyToken` |

### 6. Card Management (`/api/v1/deck/:deckId/cards`)

This is a nested route structure, handling flashcards within a specific deck.

| Method | Endpoint | Description | Middleware |
| :----- | :------- | :---------- | :--------- |
| `GET` | `/:deckId/cards` | Retrieve all cards for the specified deck. | `verifyToken` |
| `POST` | `/:deckId/cards` | Create a new card in the specified deck. | `verifyToken` |
| `PUT` | `/:deckId/cards/:cardId` | Update a specific card. | `verifyToken` |
| `DELETE` | `/:deckId/cards/:cardId` | Delete a specific card. | `verifyToken` |

## 📚 API Documentation (Swagger)

The full, interactive API documentation is generated using Swagger UI.

* **Live Docs:** [https://flash-card-app-api-production-d571.up.railway.app/api-docs/](https://flash-card-app-api-production-d571.up.railway.app/api-docs/)
* **Local Docs:** Once the server is running, access the documentation at `http://localhost:[PORT]/api-docs`.

---
