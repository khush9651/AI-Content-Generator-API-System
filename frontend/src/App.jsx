import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import HistoryPanel from './components/HistoryPanel';
import './index.css';

const App = () => {
  const [showHistory, setShowHistory] = useState(false);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState(null);

  const handleHistorySelect = (item) => {
    setSelectedHistoryItem(item);
  };

  return (
    <div className="app-wrapper">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#F1F4E8',
            color: '#2C3D38',
            border: '1px solid rgba(124,154,146,0.28)',
            borderRadius: '12px',
            fontSize: '0.9rem',
            boxShadow: '0 4px 24px rgba(44,61,56,0.10)',
          },
        }}
      />

      <Navbar onHistoryOpen={() => setShowHistory(true)} />

      <Home
        onHistorySelect={handleHistorySelect}
        pendingResult={selectedHistoryItem}
      />

      {showHistory && (
        <HistoryPanel
          onClose={() => setShowHistory(false)}
          onSelect={handleHistorySelect}
        />
      )}
    </div>
  );
};

export default App;
