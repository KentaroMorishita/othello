import React from "react";

function Square({ value, onClick, validMove }) {
  return (
    <button className={`square ${value}`} onClick={onClick}>
      {value && <span className="stone"></span>}
      {!value && validMove && <span className="valid-move"></span>}
    </button>
  );
}

export default Square;
