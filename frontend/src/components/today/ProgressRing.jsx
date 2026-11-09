function ProgressRing({ completed = 0, total = 0, size = 120 }) {
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="progress-ring" style={{ width: size, height: size }}>
      <svg viewBox="0 0 120 120">
        <circle
          cx="60"
          cy="60"
          r={radius}
          className="progress-ring-background"
        />

        <circle
          cx="60"
          cy="60"
          r={radius}
          className="progress-ring-value"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>

      <div className="progress-ring-inner">
        <strong>
          {completed}/{total}
        </strong>
        <span>{percent}%</span>
      </div>
    </div>
  );
}

export default ProgressRing;
