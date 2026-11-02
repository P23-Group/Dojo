import './Button.css';

  // <Button>Зберегти</Button>
  // <Button variant="secondary" onClick={...}>Скасувати</Button>
  // <Button variant="tertiary" disabled>Пропустити</Button>

export default function Button({
  variant = 'primary',
  fullWidth = false,
  type = 'button',
  className = '',
  children,
  ...rest
}) {
  const classes = [
    'btn',
    `btn--${variant}`,
    fullWidth ? 'btn--full' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button type={type} className={classes} {...rest}>
      {children}
    </button>
  );
}
