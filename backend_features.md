# Backend Architecture and Feature Requirements

This document outlines the required features, API endpoints, and database models needed to support the Fuel Dashboard application.

## 1. Database Models (e.g., MongoDB / PostgreSQL)

### FuelLog (Fill-up Entries)
- `id` / `_id`: UUID or ObjectId
- `userId`: Reference to the user
- `fromOdo`: Number (Odometer reading before fill)
- `toOdo`: Number (Odometer reading after fill)
- `diff`: Number (Distance traveled)
- `avg`: Number (Automated or manual efficiency calculation)
- `rupees`: Number (Total cost)
- `litre`: Number (Fuel volume)
- `date`: Date / Timestamp
- `isPartial`: Boolean (Indicates if it was a partial fill)

### DailyTrip (Recurring Commutes)
- `id` / `_id`: UUID
- `userId`: Reference to the user
- `date`: Date
- `distance`: Number (Distance covered)
- `mode`: String (e.g., Car, Bike)
- `notes`: String

### OneTimeTrip
- `id` / `_id`: UUID
- `userId`: Reference to the user
- `date`: Date
- `startLocation`: String
- `endLocation`: String
- `distance`: Number
- `costEstimate`: Number

## 2. API Endpoints

### Authentication (Optional but Recommended)
- `POST /api/auth/register` - Create a new user
- `POST /api/auth/login` - Authenticate and return JWT

### Fuel Logs
- `GET /api/logs` - Retrieve all fuel logs for the user
- `POST /api/logs/new` - Add a new regular fuel entry (or partial entry)
- `PUT /api/logs/:id` - Update an existing fuel log
- `DELETE /api/logs/:id` - Delete a fuel log

### Trips
- `POST /api/trips/daily` - Log a daily commute
- `POST /api/trips/onetime` - Log a specific one-time trip
- `GET /api/trips` - Retrieve trip histories

### Analytics & Stats
- `GET /api/stats/dashboard` - Returns aggregated metrics:
  - Total Distance
  - Total Cost
  - Overall Efficiency
  - Monthly Spend grouped by month
  - Next Refuel Prediction (Date & Odo)
  - Distance to next milestones

## 3. Recommended Tech Stack
- **Framework**: Node.js + Express / NestJS OR Python FastAPI
- **Database**: MongoDB (Mongoose) or PostgreSQL (Prisma)
- **Validation**: Zod or Joi
- **Authentication**: JWT (JSON Web Tokens)
