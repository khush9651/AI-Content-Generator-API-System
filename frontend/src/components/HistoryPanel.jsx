import { useEffect, useState } from 'react';
import { contentApi } from '../services/api';

const HistoryPanel = ({ onClose, onSelect }) => {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const res = await contentApi.getHistory();
      setHistory(res.data || []);
    } catch (err) {
      console.error('Failed to load history:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    try {
      await contentApi.deleteHistoryItem(id);
      setHistory((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.error('Failed to delete history item:', err);
    }
  };

  const formatDate = (isoStr) => {
    return new Date(isoStr).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="history-overlay" onClick={onClose}>
      <div className="history-panel" onClick={(e) => e.stopPropagation()}>
        <div className="history-panel-header">
          <h3 className="history-panel-title">📚 History</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="history-list">
          {isLoading ? (
            <div className="history-loading">Loading your creations...</div>
          ) : history.length === 0 ? (
            <div className="history-empty">
              No content generated yet.<br/>
              Create your first piece!
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item._id}
                className="history-item"
                onClick={() => {
                  onSelect(item);
                  onClose();
                }}
              >
                <div>
                  <div className="history-topic">{item.topic}</div>
                  <div className="history-meta">
                    <span className="history-tone-badge">{item.tone}</span>
                    <span>{formatDate(item.generated_at)}</span>
                  </div>
                </div>
                <button
                  className="history-delete-btn"
                  onClick={(e) => handleDelete(e, item._id)}
                  title="Delete"
                >
                  🗑️
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryPanel;
