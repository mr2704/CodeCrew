# CodeCrew

CodeCrew is a Bumble-style platform for students to discover hackathon teammates, project collaborators, and coding partners.

## Project Status

Backend authentication and user discovery APIs are implemented and working.

## Tech Stack

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT Authentication
- bcryptjs

## Implemented Features

- User Registration API
- User Login API
- JWT Authentication
- Protected Routes
- User Profile API
- User Discovery API

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Log in an existing user |
| GET | `/api/auth/profile` | Get authenticated user profile |
| GET | `/api/users` | Discover users |

## Recommended Project Folder Structure

```text
CodeCrew/
|-- backend/
|   |-- package.json
|   |-- .env.example
|   |-- src/
|   |   |-- server.js
|   |   |-- config/
|   |   |   `-- db.js
|   |   |-- controllers/
|   |   |   |-- authController.js
|   |   |   `-- userController.js
|   |   |-- middleware/
|   |   |   `-- authMiddleware.js
|   |   |-- models/
|   |   |   `-- User.js
|   |   |-- routes/
|   |   |   |-- authRoutes.js
|   |   |   `-- userRoutes.js
|   |   `-- utils/
|   |       `-- generateToken.js
|   `-- testConnection.js
|-- codecrew/
|   |-- package.json
|   |-- src/
|   |   |-- components/
|   |   |-- pages/
|   |   |-- routes/
|   |   |-- services/
|   |   |-- context/
|   |   `-- utils/
|   `-- public/
|-- .gitignore
`-- README.md
```

## Environment Variables

Create a `.env` file inside `backend/` for local development. Example:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret
```

Do not commit `.env` to GitHub.

## Future Features

- Profile Update API
- Swipe System
- Match System
- Real-Time Chat
- Notifications
- React Frontend

## GitHub Readiness Checklist

- `.env` is ignored.
- `node_modules` is ignored.
- Build artifacts (`dist`, `build`) are ignored.
- Editor settings (`.vscode`) are ignored.

## Local Setup

1. Clone the repository.
2. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```
3. Create `backend/.env`.
4. Run backend server:
   ```bash
   npm run dev
   ```

## License

This project is currently unlicensed. Add a `LICENSE` file before open-source release.
