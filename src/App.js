import { useEffect, useState } from 'react';
import './App.css';
import { DEFAULT_ATTRIBUTES } from './consts.js';
import CharacterSheet from './CharacterSheet.js';

function App() {
  const [characterName, setCharacterName] = useState('');
  const [characters, addNewCharacter] = useState([])

  useEffect(() => {
    const loadCharacters = async () => {
      const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }
      try {
        const response = await fetch(process.env.REACT_APP_API_URL, requestOptions)
        if (!response.ok) {
          alert('there was an error laoding')
        }
        const data = await response.json()
        addNewCharacter(data.body)
      } catch (error) {
        console.error('Error during load')
      }
    }
    loadCharacters()
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    const newCharacter = {
      name: characterName,
      attributes: DEFAULT_ATTRIBUTES
    }
    addNewCharacter([...characters, newCharacter])
    setCharacterName('')
  };

  const getTotalPoints = (character) => {
    return Object.values(character.attributes).reduce((acc, curr) => acc + curr, 0);
  };

  const handleIncrease = (character, attribute) => {
    const totalPoints = getTotalPoints(character)
    if (totalPoints > 69) {
      alert(`You have reached the maximum attribute points for ${character.name}`);
      return
    }

    const updatedCharacter = {
      ...character,
      attributes: {
        ...character.attributes,
        [attribute]: character.attributes[attribute] + 1
      }
    }
    const updatedCharacters = characters.map((mappedCharacter) => (
      mappedCharacter.name === character.name ? updatedCharacter : mappedCharacter
    ))
    addNewCharacter(updatedCharacters);
  };

  const deleteCharacter = (characterName) =>{
    const newCharacterArry = characters.filter((prevCharacter)=> prevCharacter.name !== characterName)
    addNewCharacter(newCharacterArry)
  }

  const handleDecrease = (character, attribute) => {
    const updatedCharacter = {
      ...character,
      attributes: {
        ...character.attributes,
        [attribute]: character.attributes[attribute] - 1
      }
    }
    const updatedCharacters = characters.map((mappedCharacter) => (
      mappedCharacter.name === character.name ? updatedCharacter : mappedCharacter
    ))
    addNewCharacter(updatedCharacters);
  };

  const saveCharacters = async () => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(characters)
    }

    try {
      const response = await fetch(process.env.REACT_APP_API_URL, requestOptions)
      if (!response.ok) {
        alert('there was an error saving')
      }

      const result = await response.json()
      console.log('success', result)
      alert('Your characters were saved')
    } catch (error) {
      console.error('Error during save')
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>React Coding Exercise</h1>
        <div>
          <button style={{ marginRight: 10 }} onClick={saveCharacters}>
            Save My Characters
          </button>
        </div>
      </header>

      <section className="App-section">
        <form onSubmit={handleSubmit}>
          Add a character
          <br />
          <input
            type="text"
            value={characterName}
            onChange={(e) => setCharacterName(e.target.value)}
            placeholder="Enter Character Name"
          />
          <button type="submit">Submit</button>
        </form>

        {characters.map((character) => (
          <CharacterSheet
            character={character}
            handleIncrease={handleIncrease}
            handleDecrease={handleDecrease}
            deleteCharacter={deleteCharacter}
          />))}

      </section>
    </div>
  );
}

export default App;
