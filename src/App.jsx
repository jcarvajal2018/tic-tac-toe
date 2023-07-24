import './App.css'
import { useState, useEffect } from "react"
import confetti from 'canvas-confetti'
import { Square } from './components/Square'
import { TURNS } from './constants'
import { checkWinner, checkEndGame} from './logic/board'
import { Winner } from './components/Winner'
import { saveGameToStorage, resetGameStorage} from './logic/storage'

function App() {
  //const board = Array(9).fill(null)
  //const [board,setBoard] = useState(
  //  ['x','x','x','o','o','o','x','x','x']
  //)
  //const [board, setBoard] = useState(Array(9).fill(null))
  const [board, setBoard] = useState(()=> {
    const boardFromStorage = window.localStorage.getItem('board')
    return boardFromStorage? JSON.parse(boardFromStorage) : Array(9).fill(null)
  })
  
  //const [turn, setTurn] = useState(TURNS.X)
  const [turn, setTurn] = useState(()=> {
      const turnFromStorage=window.localStorage.getItem('turn')
      return turnFromStorage??TURNS.X
  })

  const [winner, setWinner] = useState(null)
  
 const resetGame = () => {
    setBoard(Array(9).fill(null))
    setTurn(TURNS.X)
    setWinner(null)
    //reset de juego
    resetGameStorage()
  }


  const updateBoard = (index) => {
    if (board[index] || winner) return
    const newBoard = [...board]
    newBoard[index] = turn
    setBoard(newBoard)

    const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X
    setTurn(newTurn)
    //guardar partida
    saveGameToStorage({board:newBoard,turn:newTurn})
    const newWinner = checkWinner(newBoard)
    if (newWinner) {
      confetti()
      setWinner(newWinner)
    } 
    if (checkEndGame(newBoard)) {
        setWinner(false)
    }
  }

  useEffect(()=> {
    console.log('useEffect')
  },[winner,turn])


  return (
    <main className='board'>
      <h1>Tic tac toe</h1>
      <button onClick={resetGame}>Reset del juego</button>
      <section className='game'>
        {
          board.map((square, index) => {
            return (
              <Square
                key={index}
                index={index}
                updateBoard={updateBoard}
              >
                {board[index]}
              </Square>
            )
          })
        }
      </section>
      <section className="turn">
        <Square isSelected={turn === TURNS.X}>
          {TURNS.X}
        </Square>
        <Square isSelected={turn === TURNS.O}>
          {TURNS.O}
        </Square>
      </section>
      <Winner resetGame={resetGame} winner={winner}/>    
    </main>

  )
}

export default App
