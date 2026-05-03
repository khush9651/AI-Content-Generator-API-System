require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const contentRoutes = require('./src/routes/content.routes');
const errorHandler = require('./src/middleware/errorHandler');
const { getUsageStats } = require('./src/services/groq.service');

const app  = express();
app.get("/", (req, res) => {
  res.send("Backend root working ✅");
});

app.get("/health", (req, res) => {
  res.send("Health OK ✅");
});
const PORT = process.env.PORT || 5000;

// ─── Startup: validate critical env vars ──────────────────────────────────────
const GROQ_KEY = process.env.GROQ_API_KEY;
if (!GROQ_KEY || GROQ_KEY.startsWith('your_')) {
  console.warn('⚠️  WARNING: GROQ_API_KEY is missing or still a placeholder in .env');
  console.warn('   Get a free key at https://console.groq.com and restart.');
} else {
  console.log('✅ GROQ_API_KEY loaded successfully');
}

const GROQ_MODEL = process.env.GROQ_MODEL || 'llama-3.1-8b-instant';
console.log(`🤖 AI Model: ${GROQ_MODEL}`);

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:3000',
      process.env.FRONTEND_URL
    ];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));
app.use(express.json({ limit: '10kb' }));

// ─── Routes ──────────────────────────────────────────────────────────────────
app.use('/api/content', contentRoutes);

// ─── Health endpoint ──────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── Status endpoint (includes Groq key + usage stats) ───────────────────────
app.get('/api/status', (req, res) => {
  const key   = process.env.GROQ_API_KEY;
  const keyOk = !!(key && !key.startsWith('your_') && key.length > 10);
  res.json({
    status:              'ok',
    ai_provider:         'groq',
    model:               GROQ_MODEL,
    groq_key_configured: keyOk,
    mongo_connected:     mongoose.connection.readyState === 1,
    environment:         process.env.NODE_ENV || 'development',
    api_usage:           getUsageStats(),
    timestamp:           new Date().toISOString(),
  });
});

// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use(errorHandler);

// ─── MongoDB (Optional) + Start ───────────────────────────────────────────────
const startServer = async () => {
  if (process.env.MONGO_URI) {
    try {
      await mongoose.connect(process.env.MONGO_URI);
      console.log('✅ MongoDB connected');
    } catch (err) {
      console.warn('⚠️  MongoDB connection failed — running without database:', err.message);
    }
  } else {
    console.log('ℹ️  No MONGO_URI set — history feature disabled');
  }

  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📋 Environment: ${process.env.NODE_ENV || 'development'}`);
  });
};

startServer();
