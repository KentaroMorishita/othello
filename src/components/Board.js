import React from "react";
import Square from "./Square";

function Board({ squares, onClick, blackIsNext, getValidMoves }) {
  const renderSquare = (i) => {
    const validMove =
      getValidMoves(squares, i, blackIsNext ? "B" : "W").length > 0;
    return (
      <Square
        key={i}
        value={squares[i]}
        onClick={() => onClick(i)}
        validMove={!squares[i] && validMove}
      />
    );
  };

  return (
    <div>
      {[...Array(8)].map((_, row) => (
        <div key={row} className="board-row">
          {[...Array(8)].map((_, col) => renderSquare(row * 8 + col))}
        </div>
      ))}
    </div>
  );
}

export default Board;
