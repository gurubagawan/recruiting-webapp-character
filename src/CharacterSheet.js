import { ATTRIBUTE_LIST, CLASS_LIST } from "./consts";
import { useState } from 'react';


export const CharacterSheet = ({ character, handleDecrease, handleIncrease, deleteCharacter }) => {
  const [displayedClass, setSelectedClass] = useState(null)

  const meetsRequirements = (characterClass) => Object.keys(CLASS_LIST[characterClass]).every(
    (attr) => character.attributes[attr] >= CLASS_LIST[characterClass][attr]
  )

  const calculateModifier = (attribute) => {
    return Math.floor((attribute - 10) / 2);
  };
  return (
    <div>

      <h1>Character Sheet for {character.name}</h1>
      <button onClick={deleteCharacter}>Delete Character</button>
      <div style={{ display: 'flex', marginTop: 10 }}>
        <div style={{ width: '50%' }}>
          {ATTRIBUTE_LIST.map((attr) => (
            <div key={attr}>
              <span>{attr}: {character.attributes[attr]}</span>
              <button onClick={() => handleIncrease(character, attr)}>+</button>
              <button onClick={() => handleDecrease(character, attr)}>-</button>
              <span> Modifier: {calculateModifier(character.attributes[attr])}</span>
            </div>
          ))}
        </div>

        <div style={{ width: '50%' }}>
          {Object.keys(CLASS_LIST).map((characterClass) => {
            return (
              <div
                onClick={() => setSelectedClass(characterClass)}
                key={characterClass}
                className={`${meetsRequirements(characterClass) ? "green" : "red"} class-details`}
              >
                <div>{characterClass}</div>
                <ul>
                  {(displayedClass === characterClass) && (Object.entries(CLASS_LIST[characterClass]).map(([attribute, value]) => (
                    <li className="no-bullets" key={attribute}>
                      {attribute}: {value}
                    </li>)
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default CharacterSheet