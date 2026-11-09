import { getCharacterImage } from "../../utils/characterLevels";

function CharacterCard({ level = 1, xp = 0, nextLevelXp = 100 }) {
  const progress = Math.min(100, Math.round((xp / nextLevelXp) * 100));

  const characterImage = getCharacterImage(level);

  return (
    <div className="character-card">
      <div className="character-profile">
        <div className="character-avatar">
          <img src={characterImage} alt={`Dojo character, level ${level}`} />
        </div>
        <div className="character-info">
          <span className="character-label">Welcome back,</span>
          <h2>User</h2>
          <p>Keep growing every day.</p>
        </div>
      </div>

      <div className="character-progress">
        <div className="character-progress-heading">
          <div className="character-progress-level">
            <span className="character-progress-caption">CURRENT LEVEL</span>
            <strong>Level {level}</strong>
          </div>
          <div className="character-progress-xp">
            <strong>
              {xp} / {nextLevelXp} XP
            </strong>
            <span>{progress}%</span>
          </div>
        </div>
        <div className="character-xp-track">
          <div
            className="character-xp-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export default CharacterCard;
