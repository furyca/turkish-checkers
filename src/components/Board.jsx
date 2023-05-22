import { useSelector } from "react-redux";
import Square from "../components/Square";
import { nanoid } from "@reduxjs/toolkit";

const Board = () => {
  const board = useSelector((state) => state.game.board);

  return (
    <div className="board">
      {board.map((square) => (
        <Square
          key={nanoid()}
          squareColor={square.squareColor}
          pieceColor={square.pieceColor}
          location={square.location}
          isKing={square.isKing}
        />
      ))}
    </div>
  );
};

export default Board;
