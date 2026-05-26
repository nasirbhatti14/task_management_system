import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";

const app = express();
const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-key-123456";

app.use(express.json());

// --- Database Setup ---
const db = new Database(':memory:'); // Using in-memory DB for hassle-free execution

// Create tables
db.exec(`
  CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  );

  CREATE TABLE tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'Pending',
    due_date TEXT,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );
`);

// --- Middleware ---
const authenticateJWT = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

const handleValidationErrors = (req: any, res: any, next: any) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// --- API Endpoints ---

// Auth Routes
app.post("/api/auth/register",
  [
    body('username').notEmpty().withMessage('Username is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
  ],
  handleValidationErrors,
  (req: any, res: any) => {
    const { username, password } = req.body;
    try {
      const hashedPassword = bcrypt.hashSync(password, 10);
      const stmt = db.prepare("INSERT INTO users (username, password) VALUES (?, ?)");
      const info = stmt.run(username, hashedPassword);
      res.status(201).json({ id: info.lastInsertRowid, username });
    } catch (error: any) {
      if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        return res.status(400).json({ error: "Username already exists" });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

app.post("/api/auth/login",
  [
    body('username').notEmpty(),
    body('password').notEmpty()
  ],
  handleValidationErrors,
  (req: any, res: any) => {
    const { username, password } = req.body;
    const stmt = db.prepare("SELECT * FROM users WHERE username = ?");
    const user = stmt.get(username) as any;

    if (user && bcrypt.compareSync(password, user.password)) {
      const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '24h' });
      res.json({ token, user: { id: user.id, username: user.username } });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  }
);

// Task Routes
app.post("/api/tasks",
  authenticateJWT,
  [
    body('title').notEmpty().withMessage('Title is required')
  ],
  handleValidationErrors,
  (req: any, res: any) => {
    const { title, description, status, due_date } = req.body;
    const stmt = db.prepare("INSERT INTO tasks (user_id, title, description, status, due_date) VALUES (?, ?, ?, ?, ?)");
    const info = stmt.run(req.user.id, title, description, status || 'Pending', due_date);
    
    const newTask = db.prepare("SELECT * FROM tasks WHERE id = ?").get(info.lastInsertRowid);
    res.status(201).json(newTask);
  }
);

app.get("/api/tasks", authenticateJWT, (req: any, res: any) => {
  const { search, status } = req.query;
  let query = "SELECT * FROM tasks WHERE user_id = ?";
  let params: any[] = [req.user.id];

  if (status && status !== 'All') {
    query += " AND status = ?";
    params.push(status);
  }
  if (search) {
    query += " AND (title LIKE ? OR description LIKE ?)";
    params.push(`%${search}%`, `%${search}%`);
  }

  query += " ORDER BY due_date ASC";

  const stmt = db.prepare(query);
  const tasks = stmt.all(...params);
  res.json(tasks);
});

app.get("/api/tasks/:id", authenticateJWT, (req: any, res: any) => {
  const stmt = db.prepare("SELECT * FROM tasks WHERE id = ? AND user_id = ?");
  const task = stmt.get(req.params.id, req.user.id);
  if (task) {
    res.json(task);
  } else {
    res.status(404).json({ error: "Task not found" });
  }
});

app.put("/api/tasks/:id",
  authenticateJWT,
  [
    body('title').notEmpty().withMessage('Title is required')
  ],
  handleValidationErrors,
  (req: any, res: any) => {
    const { title, description, status, due_date } = req.body;
    
    // Check if task exists and belongs to user
    const checkStmt = db.prepare("SELECT * FROM tasks WHERE id = ? AND user_id = ?");
    const existing = checkStmt.get(req.params.id, req.user.id);
    
    if (!existing) {
      return res.status(404).json({ error: "Task not found" });
    }

    const stmt = db.prepare("UPDATE tasks SET title = ?, description = ?, status = ?, due_date = ? WHERE id = ? AND user_id = ?");
    stmt.run(title, description, status, due_date, req.params.id, req.user.id);
    
    const updatedTask = db.prepare("SELECT * FROM tasks WHERE id = ?").get(req.params.id);
    res.json(updatedTask);
  }
);

app.delete("/api/tasks/:id", authenticateJWT, (req: any, res: any) => {
  const stmt = db.prepare("DELETE FROM tasks WHERE id = ? AND user_id = ?");
  const result = stmt.run(req.params.id, req.user.id);
  
  if (result.changes > 0) {
    res.json({ message: "Task deleted successfully" });
  } else {
    res.status(404).json({ error: "Task not found" });
  }
});


async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
