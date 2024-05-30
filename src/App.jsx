import { useState } from 'react'
import Player from './components/Player'
import GameBoard from './components/GameBoard.jsx'
import Log from './components/Log'
import GameOver from './components/GameOver.jsx'
import { WINNING_COMBINATIONS } from './winning-combinations.js'

const PLAYERS = {
  X: 'Player 1',
  O: 'Player 2',
}

const INITIAL_GAME_BOARD = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
]

function deriveActivePlayer(gameTurns) {
  let currentPlayer = 'X'
  if (gameTurns.length > 0 && gameTurns[0].player === 'X') {
    currentPlayer = 'O'
  }
  return currentPlayer
}

function deriveGameBoard(gameTurns) {
  let gameBoard = [...INITIAL_GAME_BOARD.map((array) => [...array])]

  for (const turn of gameTurns) {
    const { square, player } = turn
    const { row, col } = square

    gameBoard[row][col] = player
  }
  return gameBoard
}

function deriveWinner(gameBoard, players) {
  let winner

  for (const combination of WINNING_COMBINATIONS) {
    const firstSquareSymbol =
      gameBoard[combination[0].row][combination[0].column]
    const secondSquareSymbol =
      gameBoard[combination[1].row][combination[1].column]
    const thirdSquareSymbol =
      gameBoard[combination[2].row][combination[2].column]

    if (
      firstSquareSymbol &&
      firstSquareSymbol === secondSquareSymbol &&
      firstSquareSymbol === thirdSquareSymbol
    ) {
      winner = players[firstSquareSymbol]
    }
  }
  return winner
}

function App() {
  const [players, setPlayers] = useState(PLAYERS)
  const [gameTurns, setGameTurns] = useState([])
  // 将Player组件和GameBoard组件需要的玩家状态activePlayer提升到其最近的祖先组件上，即App上，用来控制Player组件的高亮显示，以及GameBoard组件棋子的样式
  // const [activePlayer, setActivePlayer] = useState('X')

  const gameBoard = deriveGameBoard(gameTurns)
  const activePlayer = deriveActivePlayer(gameTurns)
  const winner = deriveWinner(gameBoard, players)
  const hasDraw = gameTurns.length === 9 && !winner

  function handleSelectSquare(rowIndex, colIndex) {
    // 设置当前玩家：这行代码切换当前玩家。如果当前玩家是'X'，它会变成'O'，反之亦然。
    // setActivePlayer((curActivePlayer) => (curActivePlayer === 'X' ? 'O' : 'X'))
    setGameTurns((prevTurns) => {
      // 如果没有回合记录，默认当前玩家为 'X'
      //prevTurns.length > 0检查是否已有回合记录。如果有，它会检查最后一个回合（即prevTurns[0]）的玩家是否是'X'。因为最新的回合总是位于prevTurns的第一个位置，所以prevTurns[0]实际上表示的是最后一个回合。
      // 如果prevTurns[0].player是'X'，这意味着最后一个回合是由'X'玩家执行的，因此当前回合应该由'O'玩家执行。否则，当前回合由'X'玩家执行。
      const currentPlayer = deriveActivePlayer(prevTurns)

      const updatedTurns = [
        { square: { row: rowIndex, col: colIndex }, player: currentPlayer },
        ...prevTurns,
      ]
      return updatedTurns
    })
  }

  function handleRestart() {
    setGameTurns([])
  }

  function handlePlayerNameChange(symbol, newName) {
    setPlayers((prevPlayers) => {
      return {
        ...prevPlayers,
        [symbol]: newName,
      }
    })
  }

  return (
    <main>
      <div id="game-container">
        <ol id="players" className="highlight-player">
          {/* 通过props，将isActve属性传递给Player子组件 */}
          <Player
            initialName={PLAYERS.X}
            symbol="X"
            isActive={activePlayer === 'X'}
            onChangeName={handlePlayerNameChange}
          />
          <Player
            initialName={PLAYERS.O}
            symbol="O"
            isActive={activePlayer === 'O'}
            onChangeName={handlePlayerNameChange}
          />
        </ol>
        {(winner || hasDraw) && (
          <GameOver winner={winner} onRestart={handleRestart} />
        )}
        {/* 通过onSelectSquare和activePlayerSymbol属性将handleSelectSquare函数和activePlayer状态传递给GameBoard组件 */}
        <GameBoard onSelectSquare={handleSelectSquare} board={gameBoard} />
      </div>
      <Log turns={gameTurns} />
    </main>
  )
}

export default App
