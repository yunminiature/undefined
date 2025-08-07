import { GameBoardCanvas } from '@/components/game-board-canvas/game-board-canvas'
import { useGameBoard } from '@/hooks/use-game-board'

export const GameTest = () => {
  const { state, reset } = useGameBoard()

  return (
    <div className="grid grid-cols-2 gap-6">
      <div>
        <h1>GameBoardCanvas Test</h1>
        <GameBoardCanvas board={state.board} />
      </div>
      <div>
        <button onClick={reset}>Reset</button>
        <div>
          <h3>Current Board:</h3>
          <pre>{JSON.stringify(state, null, 2)}</pre>
        </div>
      </div>
    </div>
  )
}
