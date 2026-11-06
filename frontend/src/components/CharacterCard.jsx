import './character-card.css'

export default function CharacterCard({
  name = 'Your character',
  image,
  level = 1,
  description,
  className = '',
}) {
  return (
    <div className={`character-card ${className}`.trim()}>
      {image && (
        <div className="character-card__image">
          <img src={image} alt={name} />
        </div>
      )}
      <div className="character-card__body">
        <div className="character-card__header">
          <h3 className="character-card__name">{name}</h3>
          <span className="character-card__level">Level {level}</span>
        </div>
        {description && (
          <p className="character-card__description">{description}</p>
        )}
      </div>
    </div>
  )
}

export { CharacterCard }