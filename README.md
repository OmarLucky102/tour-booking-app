# Tour Booking API

![Node.js](https://img.shields.io/badge/Node.js-v14+-green.svg)
![Express](https://img.shields.io/badge/Express-v4.21-lightgrey.svg)
![MongoDB](https://img.shields.io/badge/MongoDB-v6.18-blue.svg)
![License](https://img.shields.io/badge/License-ISC-blue.svg)

> A robust, RESTful API built with Node.js, Express, and MongoDB for managing tour bookings.

Tour Booking App provides comprehensive backend services for tour management, user authentication, reviews, and booking operations. Designed with security, performance, and best practices in mind, this project serves as a strong foundation for a complete tour booking platform.

## 🚀 Key Features

- **Tours & Reviews**: Complete CRUD operations for tours and reviews, geolocation data (GeoJSON), and complex aggregation queries for advanced statistics.
- **Authentication & Authorization**: JWT-based stateless authentication, secure password hashing, password reset flow (via email), and Role-Based Access Control (RBAC) with hierarchical permissions (User, Guide, Lead-Guide, Admin).
- **Security First**: Comprehensive protection against NoSQL injection, XSS attacks, parameter pollution, brute-force attacks via rate limiting, and secure HTTP headers.
- **Robust Architecture**: Centralized asynchronous error handling, advanced filtering/sorting/pagination utilities, and structured JSON API responses.

## 🛠️ Technology Stack

- **Core Runtime**: Node.js, Express.js
- **Database**: MongoDB, Mongoose ODM
- **Frontend Engine**: Pug templates (Server-Side Rendering) bundled with Parcel
- **Security**: jsonwebtoken, bcryptjs, helmet, express-rate-limit, express-mongo-sanitize, xss-clean, hpp
- **Development Tools**: ESLint, Prettier, Postman

## � Project Structure

<details>
<summary>Click to expand project tree</summary>

```text
.
├── .eslintrc.json
├── .gitignore
├── .prettierrc
├── .vscode
│   ├── launch.json
│   └── settings.json
├── README.md
├── app.js
├── config.env
├── controllers
│   ├── authController.js
│   ├── errorController.js
│   ├── handlerFactory.js
│   ├── reviewController.js
│   ├── tourController.js
│   ├── userController.js
│   └── viewsController.js
├── dev-data
│   ├── data
│   │   ├── import-dev-data.js
│   │   ├── reviews.json
│   │   ├── tour5.js
│   │   ├── tours-simple.json
│   │   ├── tours.json
│   │   └── users.json
│   ├── img
│   │   └── [sample images...]
│   └── templates
│       ├── accountTemplate.pug
│       ├── emailTemplate.pug
│       ├── errorTemplate.pug
│       ├── loginTemplate.pug
│       ├── tourCardTemplate.pug
│       └── tourTemplate.pug
├── models
│   ├── reviewModel.js
│   ├── tourModel.js
│   └── userModel.js
├── package-lock.json
├── package.json
├── public
│   ├── css
│   │   └── style.css
│   ├── img
│   │   ├── favicon.png
│   │   ├── icons.svg
│   │   ├── logo-green-round.png
│   │   ├── logo-green-small.png
│   │   ├── logo-green.png
│   │   ├── logo-white.png
│   │   ├── pin.png
│   │   ├── tours
│   │   │   └── [tour images...]
│   │   └── users
│   │       └── [user profile images...]
│   ├── js
│   │   ├── alerts.js
│   │   ├── index.js
│   │   ├── login.js
│   │   ├── mapbox.js
│   │   ├── signup.js
│   │   └── updateSettings.js
│   ├── overview.html
│   └── tour.html
├── routers
│   ├── reviewRoutes.js
│   ├── tourRoutes.js
│   ├── userRoutes.js
│   └── viewRoutes.js
├── server.js
├── utils
│   ├── apiFeatures.js
│   ├── appError.js
│   ├── catchAsync.js
│   └── email.js
└── views
    ├── _footer.pug
    ├── _header.pug
    ├── _reviewCard.pug
    ├── account.pug
    ├── base.pug
    ├── error.pug
    ├── login.pug
    ├── overview.pug
    ├── signup.pug
    └── tour.pug

```

</details>

## �📖 API Documentation

Comprehensive and interactive API documentation is published on Postman. This documentation includes detailed information about all available endpoints, required parameters, and response examples without cluttering the repository.

👉 **[View Complete API Documentation on Postman](https://documenter.getpostman.com/view/46789817/2sBXVifpK4)**

## 💻 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (Local instance or MongoDB Atlas cluster)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/OmarLucky102/tour-booking-app.git
   cd tour-booking-app
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `config.env` file in the root directory with your credentials:

   ```env
   NODE_ENV=development
   PORT=8000

   # Database Access
   DATABASE=mongodb+srv://<username>:<PASSWORD>@cluster.mongodb.net/tour-booking-app
   DATABASE_LOCAL=mongodb://localhost:27017/tour-booking-app
   DATABASE_PASSWORD=your_database_password

   # JWT Configuration
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRES_IN=90d
   JWT_COOKIE_EXPIRES_IN=90

   # Email Configuration (e.g., Mailtrap for dev)
   EMAIL_HOST=sandbox.smtp.mailtrap.io
   EMAIL_PORT=2525
   EMAIL_USERNAME=your_mailtrap_username
   EMAIL_PASSWORD=your_mailtrap_password
   ```

4. **Start the application:**

   ```bash
   # Development mode
   npm start

   # Production mode
   npm run start:prod
   ```

## 🗺️ Roadmap & Future Enhancements

This project is actively being developed. Planned major features include:

- [ ] **Admin Dashboard:** A robust server-side rendered web interface (using Pug & Parcel) exclusively for administrators to manage tours, user accounts, and reviews efficiently.
- [ ] **Advanced Access Control:** Fully refined role-based access to the dashboard and internal configuration.
- [ ] **Payment Methods Integration:** Secure integration with Stripe to handle real payment processing for tour bookings safely.
- [ ] Booking system finalization with automated invoice emails.

## 📄 License & Author

- **Author:** Omar AbdElaty
- **Version:** 1.0.0
- **License:** ISC
