import React, { useState } from "react";
import Board from "./components/Board";

function App() {
  const [history, setHistory] = useState([{ squares: initializeBoard() }]);
  const [stepNumber, setStepNumber] = useState(0);
  const [blackIsNext, setBlackIsNext] = useState(true);

  const handleClick = (i) => {
    const _history = history.slice(0, stepNumber + 1);
    const current = _history[_history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) return;

    const validMoves = getValidMoves(squares, i, blackIsNext ? "B" : "W");
    if (validMoves.length === 0) return;

    squares[i] = blackIsNext ? "B" : "W";
    for (const move of validMoves) {
      squares[move] = blackIsNext ? "B" : "W";
    }

    setHistory(_history.concat([{ squares }]));
    setStepNumber(_history.length);
    setBlackIsNext(!blackIsNext);

    // Check for pass after updating the squares
    checkForPass(squares);
  };

  const current = history[stepNumber];
  const winner = calculateWinner(current.squares);

  const stoneCounts = countStones(current.squares);
  const blackStones = stoneCounts.black;
  const whiteStones = stoneCounts.white;

  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (blackIsNext ? "Black" : "White");
  }

  function countStones(squares) {
    let black = 0;
    let white = 0;

    for (const square of squares) {
      if (square === "B") {
        black += 1;
      } else if (square === "W") {
        white += 1;
      }
    }

    return { black, white };
  }

  function initializeBoard() {
    const initialSquares = Array(64).fill(null);
    initialSquares[27] = "W";
    initialSquares[28] = "B";
    initialSquares[35] = "B";
    initialSquares[36] = "W";
    return initialSquares;
  }

  function getValidMoves(squares, index, player) {
    const opponent = player === "B" ? "W" : "B";
    const directions = [
      { row: -1, col: -1 },
      { row: -1, col: 0 },
      { row: -1, col: 1 },
      { row: 0, col: -1 },
      { row: 0, col: 1 },
      { row: 1, col: -1 },
      { row: 1, col: 0 },
      { row: 1, col: 1 },
    ];

    let validMoves = [];

    if (squares[index] !== null) return validMoves;

    for (const direction of directions) {
      let row = Math.floor(index / 8) + direction.row;
      let col = (index % 8) + direction.col;
      let tempMoves = [];
      let foundOpponent = false;

      while (row >= 0 && row < 8 && col >= 0 && col < 8) {
        const currentIndex = row * 8 + col;
        if (squares[currentIndex] === opponent) {
          foundOpponent = true;
          tempMoves.push(currentIndex);
        } else if (squares[currentIndex] === player) {
          if (foundOpponent) {
            validMoves = validMoves.concat(tempMoves);
          }
          break;
        } else {
          break;
        }

        row += direction.row;
        col += direction.col;
      }
    }

    return validMoves;
  }

  function calculateWinner(squares) {
    const blackCount = squares.filter((square) => square === "B").length;
    const whiteCount = squares.filter((square) => square === "W").length;

    if (blackCount + whiteCount === 64) {
      if (blackCount > whiteCount) {
        return "Black";
      } else if (whiteCount > blackCount) {
        return "White";
      } else {
        return "Draw";
      }
    }

    return null;
  }

  const checkForPass = (squares) => {
    const currentPlayer = blackIsNext ? "B" : "W";
    const nextPlayer = blackIsNext ? "W" : "B";

    const currentPlayerMoves = [];
    const nextPlayerMoves = [];

    for (let i = 0; i < squares.length; i++) {
      if (squares[i] === null) {
        const currentPlayerValidMoves = getValidMoves(
          squares,
          i,
          currentPlayer
        );
        const nextPlayerValidMoves = getValidMoves(squares, i, nextPlayer);

        if (currentPlayerValidMoves.length > 0) {
          currentPlayerMoves.push(currentPlayerValidMoves);
        }

        if (nextPlayerValidMoves.length > 0) {
          nextPlayerMoves.push(nextPlayerValidMoves);
        }
      }
    }
    console.log(currentPlayer, currentPlayerMoves);
    console.log(nextPlayer, nextPlayerMoves);

    if (currentPlayerMoves.length === 0 && nextPlayerMoves.length === 0) {
      // No valid moves for both players, game is over
      return;
    } else if (currentPlayerMoves.length === 0) {
      // No valid moves for the current player, switch to the next player
      setBlackIsNext(!blackIsNext);
    } else if (nextPlayerMoves.length === 0) {
      setBlackIsNext(!!blackIsNext);
    }
  };

  return (
    <div className="game">
      <div className="game-board">
        <Board
          squares={current.squares}
          onClick={handleClick}
          blackIsNext={blackIsNext}
          getValidMoves={getValidMoves}
        />
      </div>
      <div className="game-info">
        <div>{status}</div>
        <div>Black stones: {blackStones}</div>
        <div>White stones: {whiteStones}</div>
      </div>
    </div>
  );
}

export default App;
