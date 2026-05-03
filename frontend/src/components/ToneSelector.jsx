const TONES = [
  { value: 'professional', label: '💼 Professional', desc: 'Formal & authoritative' },
  { value: 'casual',       label: '😊 Casual',       desc: 'Friendly & conversational' },
  { value: 'technical',   label: '⚙️ Technical',    desc: 'Precise & detailed' },
];

const ToneSelector = ({ value, onChange }) => (
  <div style={{ marginTop: '1.1rem' }}>
    <span className="tone-label">Content Tone</span>
    <div className="tone-selector">
      {TONES.map((tone) => (
        <button
          key={tone.value}
          id={`tone-${tone.value}`}
          type="button"
          className={`tone-btn ${value === tone.value ? 'active' : ''}`}
          onClick={() => onChange(tone.value)}
          title={tone.desc}
        >
          {tone.label}
        </button>
      ))}
    </div>
  </div>
);

export default ToneSelector;
