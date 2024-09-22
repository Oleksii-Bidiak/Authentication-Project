## Authentication Project

This project implements user registration and authentication using **Node.js** for the backend and **React** for the frontend. It utilizes **JWT tokens** for secure access and refresh token management.

### Key Features

- **JWT-based authentication**: Access tokens are stored in cookies on the client side, while refresh tokens are securely stored in a MongoDB database on the server.
- **Seamless token renewal**: Automatic refresh and renewal of tokens to ensure continuous sessions without requiring re-login.
- **Email activation**: User account activation via email using **Nodemailer**.
- **MongoDB**: Separate collections for users and refresh tokens.

### Technologies

- Node.js
- React
- MongoDB
- JWT
- Nodemailer
