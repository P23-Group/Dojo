import level1Character from "../assets/characters/dojo-character-level-1.png";
import level2Character from "../assets/characters/dojo-character-level-2.png";
import level3Character from "../assets/characters/dojo-character-level-3.png";
import level4Character from "../assets/characters/dojo-character-level-4.png";
import level5Character from "../assets/characters/dojo-character-level-5.png";

export function getCharacterImage(level = 1) {
  if (level >= 15) return level5Character;
  if (level >= 10) return level4Character;
  if (level >= 6) return level3Character;
  if (level >= 3) return level2Character;
  return level1Character;
}
