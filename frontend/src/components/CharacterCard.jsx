import './character-card.css'

export default function CharacterCard({
  name = 'Your hero',
  image,
  level = 1,
  description,
  progress = 0,
  className = '',
}) {
  return (
    <div className={`character-card ${className}`.trim()}>
      <div className="character-card__top">
        <div className="character-card__image">
          {image ? (
            <img src={image} alt={name} />
          ) : (
            <span>{name.slice(0, 2).toUpperCase()}</span>
          )}
        </div>
        <div className="character-card__info">
          <div className="character-card__header">
            <h3 className="character-card__name">{name}</h3>
            <span className="character-card__level">Lv {level}</span>
          </div>
          {description && (
            <p className="character-card__description">{description}</p>
          )}
        </div>
      </div>
      <div className="character-card__progress">
        <div className="character-card__progress-label">
          <span>Progress to next level</span>
          <span>{progress}%</span>
        </div>
        <div className="character-card__progress-bar">
          <div
            className="character-card__progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  )
}

export { CharacterCard }