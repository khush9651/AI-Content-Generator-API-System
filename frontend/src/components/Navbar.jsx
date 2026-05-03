const Navbar = ({ onHistoryOpen }) => (
  <nav className="navbar">
    <a href="/" className="navbar-brand" aria-label="ContentAI Home">
      <div className="navbar-logo">✨</div>
      <span className="navbar-title">ContentAI</span>
    </a>
    <div className="navbar-actions">
      <button id="open-history-btn" className="nav-history-btn" onClick={onHistoryOpen} aria-label="Open history">
        📚 History
      </button>
    </div>
  </nav>
);

export default Navbar;
