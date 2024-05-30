import { useState } from 'react'

export default function Player({
  initialName,
  symbol,
  isActive,
  onChangeName,
}) {
  const [playerName, setPlayerName] = useState(initialName)
  const [isEdithing, setIsEditing] = useState(false)

  function handleEditClick() {
    setIsEditing((editing) => !editing)
    if (isEdithing) {
      onChangeName(symbol, playerName)
    }
  }

  function handleChange(event) {
    setPlayerName(event.target.value)
  }

  return (
    <li className={isActive ? 'active' : undefined}>
      <span className="player">
        {isEdithing ? (
          <input
            type="text"
            required
            value={playerName}
            onChange={handleChange}
          />
        ) : (
          <span className="player-name">{playerName}</span>
        )}
        <span className="player-symbol">{symbol}</span>
      </span>
      <button onClick={handleEditClick}>{isEdithing ? 'Save' : 'Edit'}</button>
    </li>
  )
}
