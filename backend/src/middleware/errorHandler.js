/**
 * Global error handler middleware
 * Handles Groq API errors, config errors, and generic server errors.
 */
const errorHandler = (err, req, res, next) => {
  // Always log full error server-side
  console.error(`[ERROR] ${new Date().toISOString()} ${req.method} ${req.path}`);
  console.error(`        Message : ${err.message}`);
  if (err.stack) console.error(`        Stack   : ${err.stack.split('\n')[1]?.trim()}`);

  // ── Missing / placeholder API key ──────────────────────────────────────────
  if (err.isConfigError) {
    return res.status(503).json({
      success: false,
      message: 'The AI service is not configured. Please add a valid GROQ_API_KEY to backend/.env and restart the server.',
      hint: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }

  // ── Groq / HTTP errors (carry a numeric .status) ─────────────────────────
  if (err.status) {
    const statusMessages = {
      400: err.message || 'Invalid request.',
      401: 'Your Groq API key is invalid or revoked. Update GROQ_API_KEY in backend/.env.',
      403: 'Access denied by the Groq service. Check your API key permissions.',
      429: 'Groq rate limit exceeded. Please wait a moment and try again.',
      500: 'The Groq service returned an internal error. Please try again.',
      503: 'The Groq service is temporarily unavailable. Please try again shortly.',
    };

    const message = statusMessages[err.status] || err.message || 'An error occurred with the AI service.';
    return res.status(err.status).json({ success: false, message });
  }

  // ── Mongoose validation errors ─────────────────────────────────────────────
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ success: false, message: messages.join(', ') });
  }

  // ── Generic / unknown errors ───────────────────────────────────────────────
  const httpStatus = err.httpStatus || 500;
  const message = httpStatus < 500
    ? err.message
    : 'Something went wrong on our end. Please try again.';

  return res.status(httpStatus).json({ success: false, message });
};

module.exports = errorHandler;
