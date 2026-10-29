const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Simple in-memory storage for this practical. Posts reset when the server restarts.
let posts = [
  { id: 1, title: 'Welcome to BlogSphere', author: 'Admin', content: 'Share your thoughts, stories, and ideas with the world.', createdAt: new Date().toISOString() }
];
let nextId = 2;

app.get('/api/posts', (req, res) => res.json(posts));

app.post('/api/posts', (req, res) => {
  const { title, author, content } = req.body || {};
  if (![title, author, content].every(value => typeof value === 'string' && value.trim())) {
    return res.status(400).json({ error: 'Title, author name, and content are required.' });
  }
  const post = { id: nextId++, title: title.trim(), author: author.trim(), content: content.trim(), createdAt: new Date().toISOString() };
  posts.unshift(post);
  res.status(201).json(post);
});

app.delete('/api/posts/:id', (req, res) => {
  const id = Number(req.params.id);
  const oldLength = posts.length;
  posts = posts.filter(post => post.id !== id);
  if (posts.length === oldLength) return res.status(404).json({ error: 'Post not found.' });
  res.json({ message: 'Post deleted successfully.' });
});

app.listen(PORT, () => console.log(`BlogSphere running at http://localhost:${PORT}`));
