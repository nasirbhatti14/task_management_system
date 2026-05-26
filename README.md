# 📋 Task Manager App

A full-stack task management application built with **Node.js**, **Express**, **SQLite**, and **React** — featuring JWT authentication, real-time filtering, and a clean responsive UI.

---

## 🚀 Features

- **JWT Authentication** — Secure register/login flow with bcrypt password hashing
- **Full CRUD API** — Create, read, update, and delete tasks via RESTful endpoints
- **SQLite Database** — Lightweight persistent storage with `better-sqlite3`
- **Input Validation** — Server-side validation using `express-validator`
- **React SPA** — Single-page application with React Router
- **Axios Interceptors** — Auto-attaches auth tokens to every API request
- **Search & Filter** — Debounced live search + status dropdown filter
- **Progress Bar** — Real-time display of task completion percentage
- **Unit Tests** — Basic API test coverage with `api.test.ts`

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Backend | Node.js, Express.js, TypeScript |
| Database | SQLite (`better-sqlite3`) |
| Auth | JWT, bcryptjs |
| Validation | express-validator |
| Frontend | React, React Router |
| HTTP Client | Axios |
| Testing | TypeScript (api.test.ts) |

---

## 📁 Project Structure

```
├── server.ts               # Express server & API routes
├── database/
│   └── schema.ts           # Users & Tasks DB schema
├── middleware/
│   └── auth.ts             # JWT middleware
├── client/
│   ├── src/
│   │   ├── pages/
│   │   │   └── DashboardPage.tsx
│   │   ├── components/
│   │   │   └── TaskForm.tsx
│   │   └── api/
│   │       └── axiosClient.ts
│   └── public/
└── tests/
    └── api.test.ts
```

---

## ⚙️ Getting Started

### Prerequisites

- Node.js v18+
- npm or yarn

### Installation

```bash
# Clone the repo
git clone https://github.com/your-username/task-manager-app.git
cd task-manager-app

# Install dependencies
npm install

# Start the backend server
npm run dev

# In a separate terminal, start the React frontend
cd client
npm install
npm start
```

The API runs on `http://localhost:5000` and the React app on `http://localhost:3000`.

---

## 🔌 API Endpoints

### Auth

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and receive JWT token |

### Tasks *(protected — requires Authorization header)*

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/tasks` | Get all tasks |
| POST | `/api/tasks` | Create a new task |
| PUT | `/api/tasks/:id` | Update a task |
| DELETE | `/api/tasks/:id` | Delete a task |

---

## 🔐 Authentication

All task routes are protected. Include the JWT token in the request header:

```http
Authorization: Bearer <your_token>
```

The Axios client handles this automatically via an interceptor.

---

## 🧪 Running Tests

```bash
npm test
```

Tests are located in `tests/api.test.ts` and cover core API configurations.

---

## 📸 Screenshots

> <img width="1920" height="807" alt="auth" src="https://github.com/user-attachments/assets/49e95c6e-c3ea-4be3-8f5a-fda5c039a13b" />


---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
