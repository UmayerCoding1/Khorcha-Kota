# Khorcha Kota Server

This is the backend server for the **Khorcha Kota** project, built using Node.js, Express, and MongoDB. It provides authentication and user management features.

## Features

- User registration and login with JWT-based authentication.
- Secure password hashing using `bcryptjs`.
- Token-based authentication stored in HTTP-only cookies.
- Middleware for verifying users.
- MongoDB integration using Mongoose.
- Environment-based configuration using `.env`.

## Folder Structure

```
server/
├── .env                     # Environment variables
├── index.js                 # Entry point of the server
├── package.json             # Project dependencies and scripts
├── config/
│   └── db.js                # MongoDB connection configuration
├── controllers/
│   └── auth.controller.js   # Authentication-related controllers
├── middleware/
│   └── verifyUser.middleware.js # Middleware for verifying users
├── models/
│   └── user.model.js        # Mongoose schema for User
├── routers/
│   └── auth.route.js        # Routes for authentication
├── utils/
│   └── AsyncHandler.js      # Utility for handling async errors
```

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd server
   npm install
   ```

2. Create a `.env` file in the root directory and add the following variables:
   ```
   PORT=5000
   MONGODB_URI=<your-mongodb-uri>
   JWT_SECRET=<your-jwt-secret>
   JWT_EXPIRES=30d
   ```

3. Start the server:
   ```bash
   npm start
   ```#   K h o r c h a - K o t a  
 