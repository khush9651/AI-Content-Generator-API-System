import { useState } from 'react';
import ReactMarkdown from 'react-markdown';

const ContentCard = ({ title, subtitle, icon, type, content }) => {
  const [copied, setCopied] = useState(false);

  const getPlainText = () =>
    Array.isArray(content)
      ? content.map((line, i) => `${i + 1}. ${line}`).join('\n')
      : typeof content === 'string' ? content : '';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getPlainText());
    } catch {
      const ta = document.createElement('textarea');
      ta.value = getPlainText();
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([getPlainText()], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type}-content.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const renderContent = () => {
    if (type === 'blog') {
      return <div className="blog-content"><ReactMarkdown>{content}</ReactMarkdown></div>;
    }
    if (type === 'linkedin') {
      return (
        <div className="linkedin-content">
          {String(content).split('\n').map((line, i, arr) => (
            <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
          ))}
        </div>
      );
    }
    if (type === 'summary' && Array.isArray(content)) {
      return (
        <ul className="summary-list">
          {content.map((item, i) => (
            <li key={i} className="summary-item">
              <div className="summary-num">{i + 1}</div>
              <span className="summary-text">{item.replace(/^[-•*]\s*/, '')}</span>
            </li>
          ))}
        </ul>
      );
    }
    return <p style={{ color: 'var(--text2)' }}>{String(content)}</p>;
  };

  return (
    <div className="content-card">
      <div className="card-header">
        <div className="card-title-info">
          <div className={`card-icon ${type}`}>{icon}</div>
          <div>
            <div className="card-title">{title}</div>
            <div className="card-subtitle">{subtitle}</div>
          </div>
        </div>
        <div className="card-actions">
          <button
            id={`copy-${type}-btn`}
            className={`card-btn ${copied ? 'copied' : ''}`}
            onClick={handleCopy}
            title="Copy to clipboard"
          >
            {copied ? '✓ Copied!' : '📋 Copy'}
          </button>
          <button
            id={`download-${type}-btn`}
            className="card-btn"
            onClick={handleDownload}
            title="Download as text file"
          >
            ⬇️ Save
          </button>
        </div>
      </div>
      <div className="card-divider" />
      <div className="card-body">{renderContent()}</div>
    </div>
  );
};

export default ContentCard;
