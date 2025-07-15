// server.js
import fs from 'fs';
import https from 'https';
import express from 'express';
import helmet from 'helmet';

const app = express();
const PORT = 4433;

// Middleware
app.use(helmet());
app.use(express.json());

// In-memory users list
let users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' }
];

// Routes
app.get('/api/users', (req, res) => {
  res.json(users);
});

app.get('/api/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
});

app.post('/api/users', (req, res) => {
  const nextId = users.length ? Math.max(...users.map(u => u.id)) + 1 : 1;
  const newUser = { id: nextId, ...req.body };
  users.push(newUser);
  res.status(201).json(newUser);
});

app.put('/api/users/:id', (req, res) => {
  const idx = users.findIndex(u => u.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ message: 'User not found' });
  users[idx] = { ...users[idx], ...req.body };
  res.json(users[idx]);
});

// HTTPS Server Setup
const sslOptions = {
  key: fs.readFileSync('./cert/key.pem'),
  cert: fs.readFileSync('./cert/cert.pem')
};

https.createServer(sslOptions, app).listen(PORT, () => {
  console.log(`✅ HTTPS server running at https://localhost:${PORT}`);
});
