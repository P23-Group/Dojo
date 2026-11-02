const baseProps = {
  xmlns: 'http://www.w3.org/2000/svg',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  focusable: false,
}

export function MailIcon({ className }) {
  return (
    <svg {...baseProps} className={className}>
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  )
}

export function LockIcon({ className }) {
  return (
    <svg {...baseProps} className={className}>
      <rect x="4.5" y="10.5" width="15" height="10" rx="2.5" />
      <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
    </svg>
  )
}

export function UserIcon({ className }) {
  return (
    <svg {...baseProps} className={className}>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 19.5a7 7 0 0 1 14 0" />
    </svg>
  )
}

export function EyeIcon({ className }) {
  return (
    <svg {...baseProps} className={className}>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

export function EyeOffIcon({ className }) {
  return (
    <svg {...baseProps} className={className}>
      <path d="M4 4l16 16" />
      <path d="M10.6 6.1A9.8 9.8 0 0 1 12 6c6 0 9.5 6 9.5 6a17 17 0 0 1-2.9 3.6M6.6 7.2A16.6 16.6 0 0 0 2.5 12S6 18 12 18a9.4 9.4 0 0 0 3.6-.7" />
      <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
    </svg>
  )
}

export function ArrowRightIcon({ className }) {
  return (
    <svg {...baseProps} className={className} strokeWidth={2}>
      <path d="M4 12h15" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  )
}

export function CheckIcon({ className }) {
  return (
    <svg {...baseProps} className={className} strokeWidth={2.6}>
      <path d="m5 12.5 4.5 4.5L19 7" />
    </svg>
  )
}

export function GoogleIcon({ className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={className}
      aria-hidden={true}
      focusable="false"
    >
      <path
        fill="#4285F4"
        d="M21.6 12.23c0-.71-.06-1.4-.18-2.05H12v3.88h5.38a4.6 4.6 0 0 1-2 3.02v2.5h3.24c1.9-1.75 2.98-4.32 2.98-7.35Z"
      />
      <path
        fill="#34A853"
        d="M12 22c2.7 0 4.96-.9 6.62-2.42l-3.24-2.5c-.9.6-2.05.96-3.38.96-2.6 0-4.8-1.76-5.59-4.12H3.06v2.58A10 10 0 0 0 12 22Z"
      />
      <path
        fill="#FBBC05"
        d="M6.41 13.92a6 6 0 0 1 0-3.83V7.5H3.06a10 10 0 0 0 0 9l3.35-2.58Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.98c1.47 0 2.79.5 3.83 1.5l2.86-2.86A10 10 0 0 0 3.06 7.5l3.35 2.59C7.2 7.74 9.4 5.98 12 5.98Z"
      />
    </svg>
  )
}
