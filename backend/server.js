const express = require('express');
const cors = require('cors');
const booksRouter = require('./routes/books');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
}));

app.use(express.json({ limit: '1mb' }));

// Routes
app.use('/api/books', booksRouter);

// Root route (helps testers)
app.get('/', (req, res) => {
  res.json({
    message: 'API running successfully',
    endpoints: {
      allBooks: '/api/books',
      health: '/api/health'
    }
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});