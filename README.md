#FundooNote App
# User and Note Management API

This is a backend application built with Node.js, Express, MongoDB, and TypeScript that provides the following functionalities:
- User Registration
- User Login (JWT Authentication)
- Password Reset (Forget and Reset Password)
- Note Creation
- Note Updation
- Note Deletion
- Get All Notes
- Get Note by ID

## Features

### User Management:
- **User Registration:** Allows users to register with their name, email, username, and password.
- **User Login:** JWT-based authentication for user login. Users can log in using either their username or email.
- **Forget Password:** Users can request a password reset email to recover their account.
- **Reset Password:** Users can reset their password by providing a valid reset token sent to their email.

### Note Management:
- **Create Note:** Users can create new notes.
- **Update Note:** Users can update an existing note.
- **Delete Note:** Users can delete a note.
- **Get All Notes:** Fetches all notes associated with the logged-in user.
- **Get Note by ID:** Fetches a specific note by its ID.


## Technologies Used

- **Node.js**: JavaScript runtime for building server-side applications.
- **Express**: Framework for building web applications and RESTful APIs.
- **TypeScript**: Typed superset of JavaScript that enhances code quality and maintainability.
- **MongoDB**: NoSQL database used to store employee data.
- **Mongoose**: ODM library for MongoDB to manage database operations with schemas.
- **JWT** (JSON Web Tokens):bcrypt authentication.
- **Winston**: Logging library for structured logging.
- **Morgan**: HTTP request logger middleware, configured to work with Winston for efficient logging.
- **Helmet**: Middleware for securing HTTP headers.
- **CORS**: Middleware to enable cross-origin resource sharing, allowing secure access to the API from different origins.
- **esLint**:Linting tool for adding coding rules.
- **Redis**:Caching server.
- **RabbitMQ**:Message Broker.
