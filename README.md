# AI-Content-Generator-API-System
AI-powered API for generating structured content including articles, LinkedIn posts, and concise summaries using advanced language models.
=======
# ContentAI — AI Content Generator

A full-stack AI content generation system built with **Node.js/Express** + **React (Vite)**. Generates blog articles, LinkedIn posts, and key summaries from any topic using OpenAI.

## 🚀 Quick Start

### 1. Backend Setup

```bash
cd backend
cp .env.example .env
# Edit .env and add your OPENAI_API_KEY
npm install
npm run dev
```

Server starts at: `http://localhost:5000`

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

App opens at: `http://localhost:5173`

---

## 📁 Project Structure

```
├── backend/
│   ├── server.js               # Express entry point
│   └── src/
│       ├── routes/             # API routes
│       ├── controllers/        # Request handlers
│       ├── services/           # OpenAI + business logic
│       ├── middleware/         # Error handling, rate limiting
│       ├── models/             # MongoDB schemas
│       └── utils/              # Validation helpers
│
└── frontend/
    └── src/
        ├── components/         # UI components
        ├── pages/              # Page components
        ├── hooks/              # Custom React hooks
        └── services/           # API client
```

---

## 🔌 API

### POST `/api/content/generate`

```json
// Request
{ "topic": "The future of AI", "tone": "professional" }

// Response
{
  "success": true,
  "data": {
    "topic": "The future of AI",
    "tone": "professional",
    "blog": "...",
    "linkedin_post": "...",
    "summary": ["...", "...", "...", "...", "..."],
    "generated_at": "..."
  }
}
```

**Tones:** `professional` | `casual` | `technical`

### GET `/api/content/history`
Returns past generations (requires MongoDB).

---

## ⚙️ Environment Variables

### Backend (`.env`)
```
OPENAI_API_KEY=sk-...
PORT=5000
MONGO_URI=mongodb://localhost:27017/ai-content-generator  # Optional
```

### Frontend (`.env`)
```
VITE_API_URL=http://localhost:5000
```

---

## 🛡️ Features
- Rate limiting (15 req / 15 min on generate endpoint)
- Input validation & sanitization
- Graceful MongoDB fallback (works without DB)
- Tone selection: Professional / Casual / Technical
- Copy to clipboard & download as .txt
- History dashboard (with MongoDB)
- Loading progress steps UI
- Responsive dark glassmorphism design
>>>>>>> 99f9b47 (Initial commit)
