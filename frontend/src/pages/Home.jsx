import { useState, useRef } from 'react';
import useContentGenerator from '../hooks/useContentGenerator';
import ContentCard from '../components/ContentCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ToneSelector from '../components/ToneSelector';

const API_KEY_HINT = 'Add your real GROQ_API_KEY to backend/.env and restart the backend server. Get a free key at https://console.groq.com';

const Home = ({ onHistorySelect, pendingResult }) => {
  const [topic, setTopic] = useState(pendingResult?.topic || '');
  const [tone, setTone]   = useState(pendingResult?.tone || 'professional');
  const { isLoading, error, result, loadingStep, generate } = useContentGenerator();
  const [dismissed, setDismissed] = useState(false);
  const inputRef = useRef(null);

  const displayResult = pendingResult || result;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!topic.trim() || isLoading) return;
    setDismissed(false);
    await generate(topic.trim(), tone);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) handleSubmit(e);
  };

  const isConfigError = error && (
    error.toLowerCase().includes('not configured') ||
    error.toLowerCase().includes('api key') ||
    error.toLowerCase().includes('invalid') ||
    error.toLowerCase().includes('placeholder')
  );

  return (
    <main className="main-content">
      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-badge">
          <div className="badge-dot" />
          Powered by Llama 3.1 &middot; Groq
        </div>
        <h1 className="hero-title">
          Turn Any Topic Into <br />
          <span className="gradient-text">Compelling Content</span>
        </h1>
        <p className="hero-subtitle">
          Generate professional blog articles, LinkedIn posts, and key summaries in seconds — all from a single topic.
        </p>
      </section>

      {/* ── Stats Bar ── */}
      <div className="stats-bar">
        <div className="stat-chip">📝 Blog <span>700–1K words</span></div>
        <div className="stat-chip">💼 LinkedIn <span>&lt;200 words</span></div>
        <div className="stat-chip">✨ Summary <span>5 key points</span></div>
        <div className="stat-chip">⚡ Ready in <span>~10s</span></div>
      </div>

      {/* ── Input Section ── */}
      <section className="input-section">
        <form onSubmit={handleSubmit}>
          <div className="input-row">
            <div className="topic-input-wrapper">
              <input
                id="topic-input"
                ref={inputRef}
                type="text"
                className="topic-input"
                placeholder="e.g. The future of AI in healthcare..."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
                maxLength={500}
                autoFocus
              />
            </div>
            <button
              id="generate-btn"
              type="submit"
              className="generate-btn"
              disabled={isLoading || !topic.trim()}
            >
              {isLoading ? (
                <>
                  <div className="spinner-ring" style={{ width: 18, height: 18, borderWidth: 2 }} />
                  Generating...
                </>
              ) : (
                <>✨ Generate Content</>
              )}
            </button>
          </div>
          <ToneSelector value={tone} onChange={setTone} />
        </form>
      </section>

      {/* ── Error State ── */}
      {error && !dismissed && (
        <div className="error-banner">
          <div className="error-icon">⚠️</div>
          <div className="error-content">
            <div className="error-title">Generation Failed</div>
            <div className="error-message">{error}</div>
            {isConfigError && (
              <div className="error-hint">
                💡 <strong>Fix:</strong> {API_KEY_HINT}
              </div>
            )}
          </div>
          <button className="error-dismiss" onClick={() => setDismissed(true)} title="Dismiss">✕</button>
        </div>
      )}

      {/* ── Loading State ── */}
      {isLoading && <LoadingSpinner currentStep={loadingStep} />}

      {/* ── Empty State ── */}
      {!isLoading && !displayResult && !error && (
        <div className="empty-state">
          <div className="empty-icon">🚀</div>
          <div className="empty-title">Ready to create</div>
          <p className="empty-text">
            Enter a topic above and click "Generate Content" to create your blog, LinkedIn post, and summary.
          </p>
        </div>
      )}

      {/* ── Results ── */}
      {!isLoading && displayResult && (
        <section className="results-section">
          <div className="results-header">
            <div>
              <div className="success-banner">✅ Content generated successfully</div>
              <h2 className="results-title">Your Generated Content</h2>
            </div>
            <div className="topic-chip">🏷️ {displayResult.topic}</div>
          </div>
          <div className="results-grid">
            <ContentCard
              title="Blog Article"
              subtitle="700–1000 words · Markdown formatted"
              icon="📝"
              type="blog"
              content={displayResult.blog}
            />
            <ContentCard
              title="LinkedIn Post"
              subtitle="Under 200 words · Hook + CTA"
              icon="💼"
              type="linkedin"
              content={displayResult.linkedin_post}
            />
            <ContentCard
              title="Key Summary"
              subtitle="5 essential takeaways"
              icon="✨"
              type="summary"
              content={displayResult.summary}
            />
          </div>
        </section>
      )}
    </main>
  );
};

export default Home;
