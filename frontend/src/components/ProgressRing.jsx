import './progress-ring.css'

export default function ProgressRing({
  value = 0,
  maxValue = 100,
  label,
  size = 120,
  className = '',
}) {
  const safeMax = maxValue > 0 ? maxValue : 1
  const percent = Math.min(100, Math.max(0, (value / safeMax) * 100))
  const radius = 46
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percent / 100) * circumference

  return (
    <div
      className={`progress-ring ${className}`.trim()}
      style={{ width: size, height: size }}
      role="img"
      aria-label={label || `${Math.round(percent)}%`}
    >
      <svg viewBox="0 0 120 120" className="progress-ring__svg">
        <circle
          className="progress-ring__track"
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          strokeWidth="10"
        />
        <circle
          className="progress-ring__fill"
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <div className="progress-ring__label">
        {label !== undefined ? label : `${Math.round(percent)}%`}
      </div>
    </div>
  )
}

export { ProgressRing }