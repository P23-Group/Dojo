import { X } from "lucide-react";
import happyCharacter from "../../assets/characters/dojo-character-happy.png";
import "./LevelUpModal.css";

function LevelUpModal({ level, totalXp, onClose }) {
  const milestoneXp = Math.max(100, (level - 1) * 100);

  return (
    <div className="level-up-overlay">
      <section
        className="level-up-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="level-up-title"
      >
        <button
          className="level-up-close"
          type="button"
          aria-label="Close level up message"
          onClick={onClose}
        >
          <X size={20} />
        </button>
        <h2 id="level-up-title">New Level!</h2>
        <p className="level-up-subtitle">Your consistency is paying off!</p>
        <img
          className="level-up-character"
          src={happyCharacter}
          alt="Your character celebrating"
        />
        <div className="level-up-result">
          <strong>Level {level} Unlocked</strong>
          <span>Keep building your momentum</span>
        </div>
        <div className="level-up-xp-line">
          <span>
            {totalXp} / {milestoneXp} XP
          </span>
          <span>Level {level}</span>
        </div>
        <div className="level-up-track">
          <span
            style={{
              width: `${Math.min(100, (totalXp / milestoneXp) * 100)}%`,
            }}
          />
        </div>
        <button className="level-up-confirm" type="button" onClick={onClose}>
          Awesome!
        </button>
      </section>
    </div>
  );
}

export default LevelUpModal;
