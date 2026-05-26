~~~
# Task Management System 🚀

A modern and efficient **Task Management System** built with **React, Express.js, SQLite, and JWT Authentication**. This project allows users to create, manage, update, and track tasks with secure authentication and real-time progress monitoring.

---

## 📌 Project Overview

The **Task Management System** is designed to help users organize and manage their daily tasks efficiently. It provides a clean and user-friendly interface with powerful backend support, ensuring secure task management and seamless user experience.

---

## ✨ Features

### 🔹 Week 1 – Backend & API Development
- Built a complete **REST API** using **Express.js**
- Implemented **CRUD operations**:
  - `GET /api/tasks`
  - `POST /api/tasks`
  - `PUT /api/tasks`
  - `DELETE /api/tasks`
- Used **better-sqlite3** for database management
- Designed database schemas for:
  - **Users**
  - **Tasks**
- Added robust **input validation** using **express-validator**
- Ensured secure and validated API payload handling

---

### 🔹 Week 2 – Frontend Development
- Developed a responsive **React Single Page Application (SPA)**
- Integrated **React Router** for seamless navigation
- Created an interactive **Dashboard Page**
- Built a reusable **TaskForm Modal** for:
  - Creating tasks
  - Editing tasks
- Configured **Axios Interceptors** for:
  - Automatic JWT token attachment
  - Clean API request handling

---

### 🔹 Week 3 – Advanced Features
- Implemented **JWT Authentication System**
- Added secure endpoints:
  - `/api/auth/register`
  - `/api/auth/login`
- Used **bcryptjs** for secure password hashing
- Added **debounced instant search filters**
- Implemented **task filtering by status**
- Added a **real-time progress bar** to track completed tasks percentage
- Created **basic testing setup** using `api.test.ts`

---

## 🛠️ Tech Stack

### Frontend
- React.js
- React Router
- Axios
- CSS / Tailwind (if used)

### Backend
- Express.js
- Node.js
- TypeScript

### Database
- SQLite (`better-sqlite3`)

### Authentication & Security
- JWT (JSON Web Token)
- bcryptjs
- express-validator

### Testing
- Unit Testing (`api.test.ts`)

---
## 📂 Project Structure


src/
│
├── components/
│ ├── TaskList.jsx
│ ├── TaskForm.jsx
│ ├── TaskCard.jsx
│ ├── TaskDetails.jsx
│
├── pages/
│ ├── DashboardPage.jsx
│
├── services/
│ ├── api.js
│
├── App.jsx
├── main.jsx


---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone <your-repository-link>
cd task-management-system
2️⃣ Install Dependencies
npm install
3️⃣ Start Backend Server
npm run server
4️⃣ Start Frontend
npm run dev
🔐 Authentication Flow
User Registration using /api/auth/register
User Login using /api/auth/login
JWT token generated after successful login
Token automatically attached to requests using Axios Interceptors
Protected task management operations
📈 Key Highlights

✔ Secure JWT Authentication
✔ Full CRUD Task Operations
✔ Input Validation & Security
✔ Search & Status Filters
✔ Real-Time Task Progress Tracking
✔ Modular & Scalable Architecture
✔ Clean UI/UX Design

🚀 Future Improvements
Task deadlines & reminders
Drag-and-drop task management
Dark mode support
Cloud database integration
Role-based access control
👨‍💻 Author

Nasir Bhatti
Software Engineering Student | Web Developer | Tech Enthusiast
