import './Card.css';

  // <Card>Будь-який вміст</Card>
  // <Card onClick={...}>Клікабельна картка</Card>

export default function Card({
  title,
  as: Tag = 'div',
  className = '',
  children,
  onClick,
  ...rest
}) {
  const classes = [
    'card',
    onClick ? 'card--clickable' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const interactiveProps = onClick
    ? {
        onClick,
        role: 'button',
        tabIndex: 0,
        onKeyDown: (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick(e);
          }
        },
      }
    : {};

  return (
    <Tag className={classes} {...interactiveProps} {...rest}>
      {title && <h3 className="card__title">{title}</h3>}
      {children}
    </Tag>
  );
}
