# Natours API Documentation

## Table of Contents

1. [Project Overview](#project-overview)
2. [Project Structure](#project-structure)
3. [Technology Stack](#technology-stack)
4. [Getting Started](#getting-started)
5. [Environment Variables](#environment-variables)
6. [Database Models](#database-models)
7. [API Endpoints](#api-endpoints)
8. [Authentication & Authorization](#authentication--authorization)
9. [Error Handling](#error-handling)
10. [Security Features](#security-features)
11. [Utility Classes](#utility-classes)
12. [Development Guidelines](#development-guidelines)

---

## Project Overview

**Natours** is a robust RESTful API built with Node.js, Express, and MongoDB for managing tour bookings. The application provides comprehensive features for tour management, user authentication, reviews, and booking operations.

**Author:** Omar AbdElaty  
**Version:** 1.0.0  
**License:** ISC

### Key Features

- Complete CRUD operations for tours, users, and reviews
- JWT-based authentication and authorization
- Role-based access control (user, guide, lead-guide, admin)
- Password reset functionality via email
- Advanced filtering, sorting, and pagination
- Data validation and sanitization
- Rate limiting and security headers
- MongoDB aggregation pipelines for statistics

---

## Project Structure
<details>
<summary>📁 Click to expand project tree</summary>

```
natours/
├── .eslintrc.json
├── .gitignore
├── .prettierrc
├── README.md
├── app.js
├── server.js
├── package.json
├── package-lock.json
│
├── controllers/
│   ├── authController.js
│   ├── errorController.js
│   ├── reviewController.js
│   ├── tourController.js
│   └── userController.js
│
├── models/
│   ├── reviewModel.js
│   ├── tourModel.js
│   └── userModel.js
│
├── routes/
│   ├── reviewRoutes.js
│   ├── tourRoutes.js
│   └── userRoutes.js
│
├── utils/
│   ├── apiFeatures.js
│   ├── appError.js
│   ├── catchAsync.js
│   └── email.js
│
├── public/
│   ├── css/
│   │   └── style.css
│   │
│   └── img/
│       ├── favicon.png
│       ├── icons.svg
│       ├── logo-green-round.png
│       ├── logo-green-small.png
│       ├── logo-green.png
│       ├── logo-white.png
│       └── pin.png
│
└── dev-data/
    ├── data/
    │   ├── import-dev-data.js
    │   ├── reviews.json
    │   ├── tours.json
    │   └── users.json
    │
    └── templates/
        ├── baseTemplate.pug
        ├── emailTemplate.pug
        └── errorTemplate.pug
```

</details>

### Directory Breakdown

- **`controllers/`** - Business logic and request handlers
- **`models/`** - MongoDB/Mongoose schemas and models
- **`routers/`** - API route definitions
- **`utils/`** - Helper functions and utility classes
- **`dev-data/`** - Sample data and import scripts
- **`public/`** - Static files (CSS, images, HTML templates)
- **`config.env`** - Environment variables configuration

---

## Technology Stack

### Core Dependencies

- **Node.js** - JavaScript runtime
- **Express.js** (v4.21.2) - Web application framework
- **MongoDB** (v6.18.0) - Database
- **Mongoose** (v8.16.5) - ODM for MongoDB

### Authentication & Security

- **jsonwebtoken** (v9.0.2) - JWT token generation and verification
- **bcryptjs** (v3.0.2) - Password hashing
- **helmet** (v8.1.0) - Security HTTP headers
- **express-rate-limit** (v8.2.1) - Rate limiting middleware
- **express-mongo-sanitize** (v2.2.0) - NoSQL injection prevention
- **xss-clean** (v0.1.4) - XSS attack prevention
- **hpp** (v0.2.3) - HTTP Parameter Pollution protection

### Utilities

- **nodemailer** (v7.0.10) - Email sending
- **validator** (v13.15.15) - String validation
- **slugify** (v1.6.6) - URL slug generation
- **morgan** (v1.10.1) - HTTP request logger
- **dotenv** (v17.2.0) - Environment variable management

### Development Tools

- **nodemon** (v3.1.10) - Auto-restart server
- **eslint** (v8.57.1) - Code linting
- **prettier** (v3.6.2) - Code formatting
- **ndb** (v0.2.4) - Debugging tool

---

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas cluster)
- npm or yarn package manager

### Installation

```bash
# Clone the repository
git clone https://github.com/OmarLucky102/tour-booking-app.git
cd tour-booking-app

# Install dependencies
npm install

# Configure environment variables
# Copy the example below and create a config.env file in the root directory
# Add your own values for DATABASE_PASSWORD, JWT_SECRET, and EMAIL credentials

# Start development server
npm start

# Start production server
npm run start:prod

# Debug mode
npm run debug
```

### Available Scripts

- `npm start` - Start development server with nodemon
- `npm run start:prod` - Start production server
- `npm run debug` - Start server in debug mode with ndb

---

## Environment Variables

Create a `config.env` file in the root directory with the following variables:

```env
# Application
NODE_ENV=development
PORT=8000

# Database
DATABASE=mongodb+srv://<username>:<PASSWORD>@cluster0.xxxxx.mongodb.net/natours?retryWrites=true&w=majority&appName=Cluster0
DATABASE_LOCAL=mongodb://localhost:27017/natours
DATABASE_PASSWORD=your_database_password

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here_make_it_very_long_and_secure
JWT_EXPIRES_IN=90d
JWT_COOKIE_EXPIRES_IN=90

# Email Configuration (Mailtrap for development)
EMAIL_USERNAME=your_mailtrap_username
EMAIL_PASSWORD=your_mailtrap_password
EMAIL_HOST=sandbox.smtp.mailtrap.io
EMAIL_PORT=2525
```

### Environment Variable Descriptions

| Variable                | Description                | Example                  |
| ----------------------- | -------------------------- | ------------------------ |
| `NODE_ENV`              | Application environment    | development/production   |
| `PORT`                  | Server port number         | 8000                     |
| `DATABASE`              | MongoDB connection string  | mongodb+srv://...        |
| `DATABASE_PASSWORD`     | MongoDB password           | your_password            |
| `JWT_SECRET`            | Secret key for JWT signing | random_secure_string     |
| `JWT_EXPIRES_IN`        | JWT expiration time        | 90d                      |
| `JWT_COOKIE_EXPIRES_IN` | Cookie expiration (days)   | 90                       |
| `EMAIL_HOST`            | SMTP host                  | sandbox.smtp.mailtrap.io |
| `EMAIL_PORT`            | SMTP port                  | 2525                     |
| `EMAIL_USERNAME`        | Email username             | your_username            |
| `EMAIL_PASSWORD`        | Email password             | your_password            |

---

## Database Models

### Tour Model (`models/tourModel.js`)

Represents tour packages with detailed information.

#### Schema Fields

| Field             | Type       | Required | Description                                |
| ----------------- | ---------- | -------- | ------------------------------------------ |
| `name`            | String     | Yes      | Tour name (10-40 characters, letters only) |
| `slug`            | String     | No       | URL-friendly version of name               |
| `duration`        | Number     | Yes      | Tour duration in days                      |
| `maxGroupSize`    | Number     | Yes      | Maximum group size                         |
| `difficulty`      | String     | Yes      | Difficulty level (easy/medium/difficult)   |
| `ratingsAverage`  | Number     | No       | Average rating (1-5), default: 4.5         |
| `ratingsQuantity` | Number     | No       | Number of ratings, default: 0              |
| `price`           | Number     | Yes      | Tour price                                 |
| `priceDiscount`   | Number     | No       | Discount price (must be < price)           |
| `summary`         | String     | Yes      | Short tour summary                         |
| `description`     | String     | No       | Detailed tour description                  |
| `imageCover`      | String     | Yes      | Cover image filename                       |
| `images`          | [String]   | No       | Array of image filenames                   |
| `createdAt`       | Date       | No       | Creation timestamp                         |
| `startDates`      | [Date]     | No       | Available tour dates                       |
| `secretTour`      | Boolean    | No       | Hidden tour flag, default: false           |
| `startLocation`   | Object     | No       | Starting point (GeoJSON)                   |
| `locations`       | [Object]   | No       | Tour locations (GeoJSON)                   |
| `guides`          | [ObjectId] | No       | References to User model                   |

#### Virtual Properties

- `durationWeek` - Tour duration in weeks (calculated field)

#### Middleware Hooks

- **Pre-save:** Creates URL slug from tour name
- **Pre-find:** Populates guide information
- **Pre-find:** Filters out secret tours
- **Pre-aggregate:** Excludes secret tours from aggregations

#### Example Tour Document

```json
{
  "name": "The Forest Hiker",
  "duration": 5,
  "maxGroupSize": 25,
  "difficulty": "easy",
  "ratingsAverage": 4.7,
  "ratingsQuantity": 37,
  "price": 397,
  "summary": "Breathtaking hike through the forest",
  "imageCover": "tour-1-cover.jpg",
  "guides": ["5c8a21d02f8fb814b56fa189"]
}
```

---

### User Model (`models/userModel.js`)

Manages user accounts and authentication.

#### Schema Fields

| Field                  | Type    | Required | Description                                            |
| ---------------------- | ------- | -------- | ------------------------------------------------------ |
| `name`                 | String  | Yes      | User's full name (1-60 characters)                     |
| `email`                | String  | Yes      | Unique email address                                   |
| `photo`                | String  | No       | Profile photo filename                                 |
| `role`                 | String  | No       | User role (user/guide/lead-guide/admin), default: user |
| `password`             | String  | Yes      | Hashed password (min 8 characters)                     |
| `passwordConfirm`      | String  | Yes\*    | Password confirmation (\*only on creation)             |
| `passwordChangedAt`    | Date    | No       | Timestamp of last password change                      |
| `passwordResetToken`   | String  | No       | Hashed password reset token                            |
| `passwordResetExpires` | Date    | No       | Reset token expiration                                 |
| `active`               | Boolean | No       | Account status, default: true                          |

#### Instance Methods

**`correctPassword(candidatePassword, userPassword)`**

- Compares plain password with hashed password
- Returns: Boolean

**`changedPasswordAfter(JWTTimestamp)`**

- Checks if password was changed after JWT was issued
- Returns: Boolean

**`createPasswordResetToken()`**

- Generates password reset token
- Returns: Plain reset token (hashed version stored in DB)

#### Middleware Hooks

- **Pre-save:** Hashes password before saving
- **Pre-save:** Updates `passwordChangedAt` on password change
- **Pre-find:** Filters out inactive users

#### Password Security

- Passwords are hashed with bcrypt (cost factor: 13)
- `passwordConfirm` is not persisted to database
- Reset tokens are hashed before storage (SHA-256)

---

### Review Model (`models/reviewModel.js`)

Stores user reviews for tours.

#### Schema Fields

| Field       | Type     | Required | Description               |
| ----------- | -------- | -------- | ------------------------- |
| `review`    | String   | Yes      | Review text content       |
| `rating`    | Number   | No       | Rating (1-5), default: 3  |
| `createdAt` | Date     | No       | Review creation timestamp |
| `tour`      | ObjectId | Yes      | Reference to Tour         |
| `user`      | ObjectId | Yes      | Reference to User         |

#### Example Review Document

```json
{
  "review": "Amazing experience! Highly recommended.",
  "rating": 5,
  "tour": "5c88fa8cf4afda39709c2955",
  "user": "5c8a1d5b0190b214360dc057"
}
```

---

## API Endpoints

### Base URL

```
http://localhost:8000/api/v1
```

---

### Tours

#### Get All Tours

```http
GET /tours
```

**Query Parameters:**

- `page` - Page number (default: 1)
- `limit` - Results per page (default: 100)
- `sort` - Sort by field(s) (comma-separated)
- `fields` - Select specific fields (comma-separated)
- Filter by any field using: `field[operator]=value`
  - Operators: `gte`, `gt`, `lte`, `lt`
  - Example: `price[lte]=1000&difficulty=easy`

**Response:**

```json
{
  "status": "success",
  "result": 9,
  "data": {
    "tours": [...]
  }
}
```

---

#### Get Single Tour

```http
GET /tours/:id
```

**Response:**

```json
{
  "status": "success",
  "data": {
    "tour": {
      "id": "5c88fa8cf4afda39709c2955",
      "name": "The Sea Explorer",
      "duration": 7,
      "price": 497
    }
  }
}
```

---

#### Create New Tour

```http
POST /tours
```

**Authentication Required:** Yes

**Request Body:**

```json
{
  "name": "New Tour Name",
  "duration": 5,
  "maxGroupSize": 25,
  "difficulty": "easy",
  "price": 397,
  "summary": "Tour summary",
  "imageCover": "tour-cover.jpg"
}
```

**Response:** 201 Created

---

#### Update Tour

```http
PATCH /tours/:id
```

**Authentication Required:** Yes

**Request Body:** (partial update)

```json
{
  "price": 450,
  "duration": 6
}
```

**Response:** 200 OK

---

#### Delete Tour

```http
DELETE /tours/:id
```

**Authentication Required:** Yes  
**Authorization:** Admin, Lead-guide only

**Response:** 204 No Content

---

#### Get Top 5 Cheap Tours

```http
GET /tours/top-5-cheap
```

Pre-configured query for best value tours sorted by rating and price.

---

#### Get Tour Statistics

```http
GET /tours/tour-status
```

Returns aggregated statistics grouped by difficulty level.

**Response:**

```json
{
  "status": "success",
  "data": {
    "stats": [
      {
        "_id": "EASY",
        "numTours": 3,
        "numRatings": 145,
        "avgRating": 4.8,
        "avgPrice": 397,
        "minPrice": 297,
        "maxPrice": 497
      }
    ]
  }
}
```

---

#### Get Monthly Plan

```http
GET /tours/monthly-plan/:year
```

Returns tour starts grouped by month for specified year.

**Example:** `/tours/monthly-plan/2024`

---

### Users

#### Sign Up

```http
POST /users/signup
```

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "passwordConfirm": "password123"
}
```

**Response:**

```json
{
  "status": "success",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "user": {
      "id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    }
  }
}
```

---

#### Login

```http
POST /users/login
```

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:** JWT token + user data

---

#### Forgot Password

```http
POST /users/forgotPassword
```

**Request Body:**

```json
{
  "email": "john@example.com"
}
```

Sends password reset email with token.

---

#### Reset Password

```http
PATCH /users/resetPassword/:token
```

**Request Body:**

```json
{
  "password": "newPassword123",
  "passwordConfirm": "newPassword123"
}
```

---

#### Update Current User Password

```http
PATCH /users/updateMyPassword
```

**Authentication Required:** Yes

**Request Body:**

```json
{
  "passwordCurrent": "currentPassword",
  "password": "newPassword123",
  "passwordConfirm": "newPassword123"
}
```

---

#### Update Current User Data

```http
PATCH /users/updateMe
```

**Authentication Required:** Yes

**Request Body:** (only name and email allowed)

```json
{
  "name": "John Updated",
  "email": "johnupdated@example.com"
}
```

---

#### Delete Current User

```http
DELETE /users/deleteMe
```

**Authentication Required:** Yes

Deactivates user account (soft delete).

---

#### Get All Users

```http
GET /users
```

**Authentication Required:** Yes

---

#### Get/Update/Delete User (Admin)

```http
GET    /users/:id
PATCH  /users/:id
DELETE /users/:id
```

**Note:** Not yet implemented (placeholders)

---

### Reviews

#### Get All Reviews

```http
GET /reviews
```

**Response:**

```json
{
  "status": "success",
  "result": 23,
  "data": {
    "reviews": [...]
  }
}
```

---

#### Create Review

```http
POST /reviews
```

**Authentication Required:** Yes  
**Authorization:** User role only

**Request Body:**

```json
{
  "review": "Great tour experience!",
  "rating": 5,
  "tour": "5c88fa8cf4afda39709c2955",
  "user": "5c8a1d5b0190b214360dc057"
}
```

---

## Authentication & Authorization

### JWT-Based Authentication

The application uses JSON Web Tokens (JWT) for stateless authentication.

#### Token Generation

- Tokens are signed with `JWT_SECRET` from environment variables
- Default expiration: 90 days
- Tokens are sent in response body and HTTP-only cookies

#### Token Structure

```javascript
{
  id: "user_id",
  iat: 1234567890,  // issued at
  exp: 1234567890   // expires at
}
```

#### Protected Routes

Add `authController.protect` middleware to any route requiring authentication:

```javascript
router.get('/protected-route', authController.protect, handler);
```

#### Authorization Flow

1. Client sends JWT in `Authorization` header: `Bearer <token>`
2. Server verifies token signature and expiration
3. Server checks if user still exists
4. Server verifies password hasn't changed after token issuance
5. User object attached to `req.user`

---

### Role-Based Access Control

Four user roles with hierarchical permissions:

| Role           | Permissions                                    |
| -------------- | ---------------------------------------------- |
| **user**       | View tours, create reviews, update own profile |
| **guide**      | All user permissions + manage assigned tours   |
| **lead-guide** | All guide permissions + delete tours           |
| **admin**      | Full system access                             |

#### Implementing Role Restrictions

```javascript
router.delete(
  '/tours/:id',
  authController.protect,
  authController.restrictTo('admin', 'lead-guide'),
  tourController.deleteTour,
);
```

---

### Password Reset Flow

1. **Request Reset** - User provides email → System generates token
2. **Send Email** - Reset URL with token sent via email
3. **Reset Password** - User submits new password with token
4. **Validation** - System validates token and updates password

#### Security Features

- Reset tokens expire after 10 minutes
- Tokens are hashed before database storage (SHA-256)
- Plain token sent via email, hashed version stored
- Password change updates `passwordChangedAt` timestamp

---

## Error Handling

### Global Error Handler

All errors are caught by the global error handler in `errorController.js`.

#### Error Types

**Operational Errors** (Expected)

- Invalid user input
- Failed database operations
- Authentication failures

**Programming Errors** (Unexpected)

- Bugs in code
- Unknown errors

#### Error Response Format

**Development Mode:**

```json
{
  "status": "fail",
  "error": {
    /* Full error object */
  },
  "message": "Error message",
  "stack": "Stack trace"
}
```

**Production Mode:**

```json
{
  "status": "fail",
  "message": "User-friendly error message"
}
```

---

### Custom Error Class (`utils/appError.js`)

Extends native Error class with additional properties:

```javascript
class AppError extends Error {
  constructor(message, statusCode) {
    this.statusCode = statusCode;
    this.status = 'fail' or 'error';
    this.isOperational = true;
  }
}
```

**Usage:**

```javascript
return next(new AppError('Tour not found', 404));
```

---

### Error Handling Patterns

#### Database Errors

- **CastError** - Invalid MongoDB ObjectId
- **Duplicate Key** - Unique constraint violation
- **ValidationError** - Schema validation failure

#### JWT Errors

- **JsonWebTokenError** - Invalid token
- **TokenExpiredError** - Expired token

#### Async Error Wrapper (`utils/catchAsync.js`)

Eliminates try-catch blocks in async functions:

```javascript
exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);
  if (!tour) {
    return next(new AppError('No tour found', 404));
  }
  res.status(200).json({ status: 'success', data: { tour } });
});
```

---

### Process-Level Error Handlers

```javascript
// Uncaught Exception
process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! Shutting down...');
  process.exit(1);
});

// Unhandled Rejection
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! Shutting down...');
  server.close(() => process.exit(1));
});
```

---

## Security Features

### Implemented Security Measures

#### 1. HTTP Security Headers (`helmet`)

Sets various HTTP headers to protect against common vulnerabilities:

- XSS protection
- Prevents clickjacking
- HSTS enforcement
- Content security policy

```javascript
app.use(helmet());
```

---

#### 2. Rate Limiting

Prevents brute-force attacks by limiting requests per IP:

```javascript
const limiter = rateLimit({
  max: 300, // 300 requests
  windowMs: 60 * 60 * 1000, // per hour
  message: 'Too many requests from this IP',
});
app.use('/api', limiter);
```

---

#### 3. Body Parser Limitation

Limits request body size to prevent DOS attacks:

```javascript
app.use(express.json({ limit: '10kb' }));
```

---

#### 4. NoSQL Injection Prevention

Sanitizes user input to prevent MongoDB operator injection:

```javascript
app.use(mongoSanitize());
```

**Example Attack Prevented:**

```json
{
  "email": { "$gt": "" },
  "password": "anything"
}
```

---

#### 5. XSS Protection

Cleans user input from malicious HTML/JavaScript:

```javascript
app.use(xss());
```

---

#### 6. Parameter Pollution Prevention

Prevents duplicate query parameters:

```javascript
app.use(
  hpp({
    whitelist: ['duration', 'price', 'difficulty'],
  }),
);
```

---

#### 7. Password Security

- Passwords hashed with bcrypt (cost: 13)
- Password confirmation not stored in database
- JWT tokens stored in HTTP-only cookies
- Password change invalidates old tokens

---

#### 8. Data Validation

- Mongoose schema validation
- Custom validators using `validator` library
- Email format validation
- Password strength requirements

---

## Utility Classes

### API Features (`utils/apiFeatures.js`)

Chainable class for building complex database queries.

#### Methods

**`filter()`** - Advanced filtering

```javascript
// GET /tours?duration[gte]=5&difficulty=easy
// Converts to: { duration: { $gte: 5 }, difficulty: 'easy' }
```

**`sort()`** - Sorting results

```javascript
// GET /tours?sort=-price,ratingsAverage
// Converts to: .sort('-price ratingsAverage')
```

**`limitFields()`** - Field projection

```javascript
// GET /tours?fields=name,price,duration
// Converts to: .select('name price duration')
```

**`Pagination()`** - Page-based pagination

```javascript
// GET /tours?page=2&limit=10
// Converts to: .skip(10).limit(10)
```

#### Usage Example

```javascript
const features = new APIFeature(Tour.find(), req.query)
  .filter()
  .sort()
  .limitFields()
  .Pagination();

const tours = await features.query;
```

---

### Email Utility (`utils/email.js`)

Sends emails using Nodemailer with configured SMTP transport.

```javascript
await sendEmail({
  email: user.email,
  subject: 'Password Reset Token',
  message: 'Your reset link...',
});
```

**Configuration:**

- Uses Mailtrap for development
- Configure production email service via environment variables

---

## Development Guidelines

### Code Style

#### ESLint Configuration

- Based on Airbnb style guide
- Integrated with Prettier for formatting
- Custom rules in `.eslintrc.json`

#### Key Style Rules

- Single quotes for strings
- No console statements in production
- Consistent return statements
- No unused variables (except req, res, next, val)

---

### Git Workflow

#### Ignored Files (`.gitignore`)

- `node_modules/`
- `config.env`
- Environment-specific files

---

### Testing Data

Sample data available in `dev-data/data/`:

- `tours.json` - Tour documents
- `users.json` - User documents
- `reviews.json` - Review documents

#### Import Development Data

```javascript
node dev-data/data/import-dev-data.js --import
```

#### Delete All Data

```javascript
node dev-data/data/import-dev-data.js --delete
```

---

### Debugging

#### Using NDB

```bash
npm run debug
```

Launches Chrome DevTools for Node.js debugging.

#### Logging

Morgan HTTP request logger active in development mode:

```javascript
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
```

---

### Best Practices

1. **Always use catchAsync** for async route handlers
2. **Never commit** `config.env` or sensitive data
3. **Validate all user input** at schema level
4. **Use meaningful error messages** for better debugging
5. **Keep controllers thin** - Move complex logic to models
6. **Follow REST conventions** for API endpoints
7. **Document all API changes** in this file
8. **Test in both development and production modes**

---

### Database Aggregation Examples

#### Tour Statistics by Difficulty

```javascript
await Tour.aggregate([
  { $match: { ratingsAverage: { $gte: 4.5 } } },
  {
    $group: {
      _id: '$difficulty',
      numTours: { $sum: 1 },
      avgRating: { $avg: '$ratingsAverage' },
      avgPrice: { $avg: '$price' },
    },
  },
]);
```

#### Monthly Tour Plan

```javascript
await Tour.aggregate([
  { $unwind: '$startDates' },
  {
    $match: {
      startDates: {
        $gte: new Date(`${year}-01-01`),
        $lte: new Date(`${year}-12-31`),
      },
    },
  },
  {
    $group: {
      _id: { $month: '$startDates' },
      numTourStarts: { $sum: 1 },
      tours: { $push: '$name' },
    },
  },
]);
```

---

## Troubleshooting

### Common Issues

**Database Connection Failed**

- Check MongoDB connection string in `config.env`
- Verify database password is correct
- Ensure IP is whitelisted in MongoDB Atlas

**JWT Token Invalid**

- Verify `JWT_SECRET` is set
- Check token hasn't expired
- Ensure token format: `Bearer <token>`

**Email Not Sending**

- Verify Mailtrap/SMTP credentials
- Check email service is running
- Review `EMAIL_*` environment variables

**Rate Limit Exceeded**

- Wait for rate limit window to reset (1 hour)
- Increase `max` value in `app.js` if needed

---

## Future Enhancements

- Implement booking system
- Add payment integration (Stripe)
- Create admin dashboard
- Add image upload functionality
- Implement real-time notifications
- Add tour location maps
- Create user favorites/wishlist
- Implement social authentication
- Add tour availability calendar
- Create mobile application

---

## Support & Contributing

For questions, issues, or contributions:

- Create an issue in the repository
- Follow the existing code style
- Add tests for new features
- Update documentation as needed

---

**Last Updated:** December 2024  
**Maintained By:** Omar AbdElaty
