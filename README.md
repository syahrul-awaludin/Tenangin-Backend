# Tenangin Backend 🌿

Backend services and RESTful APIs for the **Tenangin** app, a mental health and mindfulness companion.

## 🚀 Tech Stack

- **Framework**: Node.js & Express.js
- **Language**: JavaScript
- **Database**: MySQL (hosted on VPS)
- **ORM**: Prisma
- **Authentication**: JWT (JSON Web Tokens) with Access & Refresh Token strategy
- **Validation**: Joi
- **Documentation**: Swagger UI & Swagger JSDoc
- **Process Manager**: PM2

## 📦 Features

- **User Authentication**: Register, Login, Token Refresh, and Logout.
- **Community Forum**: 
  - Create, read, update, and delete posts.
  - Like/Unlike functionality.
  - Nested comments system (parent-child replies).
- **Notifications System**: 
  - Real-time event tracking for likes and comments.
  - Mark notifications as read or mark all as read.

## 🛠 Prerequisites

Make sure you have installed the following on your machine:
- Node.js (v18+)
- MySQL (v8+)
- Prisma CLI (`npm install -g prisma`)

## ⚙️ Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/syahrul-awaludin/Tenangin-Backend.git
   cd Tenangin-Backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory based on `.env.example`:
   ```env
   PORT=4005
   DATABASE_URL="mysql://USER:PASSWORD@HOST:3306/tenangin_db"
   JWT_SECRET="your_jwt_secret"
   JWT_REFRESH_SECRET="your_refresh_secret"
   ```

4. **Database Migration**
   Apply migrations to your MySQL database using Prisma:
   ```bash
   npx prisma migrate dev --name init
   ```

5. **Start the Development Server**
   ```bash
   npm run dev
   ```
   The server will start at `http://localhost:4005`.

## 📚 API Documentation

Once the server is running, you can access the complete and interactive Swagger API Documentation at:

👉 `http://localhost:4005/api/docs`

## 🏗 Architecture & Scripts

### Scripts
- `npm run dev`: Starts the server in watch mode using `nodemon`.
- `npm start`: Starts the server in production mode.
- `npm run lint`: Runs ESLint for code formatting.

### Directory Structure
```
src/
├── controllers/    # Request handlers & logic implementation
├── docs/           # Swagger configuration and schemas
├── middlewares/    # Custom Express middlewares (Auth, Error Handler, etc.)
├── models/         # Prisma DB schema & configs
├── routes/         # Express route definitions
├── services/       # Database & business logic encapsulation
├── validators/     # Joi validation schemas
└── index.js        # Entry point of the Express app
```

## 🔒 Security & Performance
- **CORS** enabled for frontend integration.
- **Helmet** for HTTP header security.
- **Morgan** for HTTP request logging.
- **Error Handling**: Centralized error interceptor ensuring consistent API responses.

## 📄 License
This project is licensed under the MIT License.
