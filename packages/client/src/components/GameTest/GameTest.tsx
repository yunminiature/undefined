import { useState } from 'react'

import { GameBoardCanvas } from '@/components/GameBoardCanvas/GameBoardCanvas'

export const GameTest = () => {
  const [board, setBoard] = useState<number[][]>([
    [2, 4, 8, 16],
    [0, 2, 0, 32],
    [4, 0, 16, 0],
    [8, 2, 4, 2],
  ])

  const generateRandomBoard = () => {
    const newBoard: number[][] = []
    const possibleValues = [0, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048]

    for (let i = 0; i < 4; i++) {
      newBoard[i] = []
      for (let j = 0; j < 4; j++) {
        newBoard[i][j] =
          possibleValues[Math.floor(Math.random() * possibleValues.length)]
      }
    }
    setBoard(newBoard)
  }

  return (
    <div className="grid grid-cols-2 gap-6">
      <div>
        <h1>GameBoardCanvas Test</h1>
        <GameBoardCanvas board={board} />
      </div>
      <div>
        <button onClick={generateRandomBoard}>Generate Random Board</button>
        <div className="board-info">
          <h3>Current Board:</h3>
          <pre>{JSON.stringify(board, null, 2)}</pre>
        </div>
      </div>
    </div>
  )
}
