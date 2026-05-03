const STEPS = [
  { label: 'Crafting your blog article...', icon: '📝' },
  { label: 'Writing LinkedIn post...', icon: '💼' },
  { label: 'Summarising key insights...', icon: '✨' },
];

const LoadingSpinner = ({ currentStep = 1 }) => (
  <div className="loading-container">
    <div className="spinner-wrap">
      <div className="spinner-ring" />
      <div className="spinner-ring-inner" />
      <div className="spinner-glow" />
    </div>
    <p className="loading-text">Creating your content — hang tight</p>
    <div className="loading-steps">
      {STEPS.map((step, i) => (
        <div
          key={i}
          className={`loading-step ${currentStep > i ? 'active' : ''}`}
        >
          <div className="step-dot" />
          <span>{step.icon} {step.label}</span>
        </div>
      ))}
    </div>
  </div>
);

export default LoadingSpinner;
