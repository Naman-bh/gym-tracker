# Gym Tracker

A full-stack gym management application where **trainers** create fitness programs and **members** enroll, track body metrics, and follow diet plans.

## Features

### Members
- Browse and enroll in training programs
- Track body metrics (weight, body fat, waist measurements)
- View personalized diet plans
- Dashboard with progress analytics

### Trainers
- Create and manage fitness programs (exercises, difficulty, duration)
- View enrolled members and analytics
- Manage trainer profile

### General
- JWT-based authentication with role-based access control
- Responsive UI with Tailwind CSS and Framer Motion animations
- RESTful API with full CRUD operations

## Tech Stack

| Layer    | Technology                                      |
|----------|------------------------------------------------|
| Frontend | React 19, React Router 7, Tailwind CSS, Axios  |
| Backend  | Express 5, Mongoose, JWT, bcrypt               |
| Database | MongoDB                                         |
| Deploy   | Vercel (frontend), Render (backend)             |

## Project Structure

```
├── backend/
│   ├── config/          # Database connection
│   ├── controllers/     # Route handlers
│   ├── middleware/       # Auth middleware
│   ├── models/          # Mongoose schemas (User, Program, Enrollment, BodyMetric, ProgressLog)
│   ├── routes/          # API route definitions
│   └── server.js        # Express app entry point
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/  # Navbar, Sidebar, ProtectedRoute
│       ├── context/     # AuthContext
│       ├── pages/       # Auth, Member, Trainer, Public pages
│       └── utils/       # Axios API instance
```

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account (or local MongoDB)

### Setup

1. **Clone the repo**
   ```bash
   git clone https://github.com/Naman-bh/gym-tracker.git
   cd gym-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   cd frontend && npm install
   ```

3. **Configure environment variables**

   Create a `.env` file in the root directory:
   ```
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```

   Create a `.env` file in the `frontend/` directory:
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```

4. **Run the app**
   ```bash
   # Backend (from root)
   npx nodemon backend/server.js

   # Frontend (from frontend/)
   npm start
   ```

## API Endpoints

| Method | Endpoint              | Description              | Auth     |
|--------|-----------------------|--------------------------|----------|
| POST   | `/api/auth/register`  | Register a new user      | No       |
| POST   | `/api/auth/login`     | Login and get JWT token  | No       |
| GET    | `/api/program`        | List all programs        | Yes      |
| POST   | `/api/program`        | Create a program         | Trainer  |
| POST   | `/api/enrollment`     | Enroll in a program      | Member   |
| GET    | `/api/body-metrics`   | Get body metrics         | Member   |
| POST   | `/api/body-metrics`   | Log body metrics         | Member   |
| GET    | `/api/analytics`      | Get analytics data       | Yes      |

## Deployment

### Frontend (Vercel)
1. Import repo on [vercel.com](https://vercel.com)
2. Set **Root Directory** to `frontend`
3. Add env variable: `REACT_APP_API_URL` = your backend URL + `/api`

### Backend (Render)
1. Create a new Web Service on [render.com](https://render.com)
2. Set **Root Directory** to `backend`
3. **Build Command:** `npm install --prefix ../ && npm install`
4. **Start Command:** `node server.js`
5. Add env variables: `MONGO_URI`, `JWT_SECRET`, `PORT`

## License

MIT
