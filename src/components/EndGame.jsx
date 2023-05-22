import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { newGame } from "../redux/gameSlice";

const EndGame = () => {
  const blacks = useSelector((state) => state.game.blackPieces);
  const dispatch = useDispatch();
  const handleClick = () => {
    dispatch(newGame());
  };

  return (
    <div className="endgame">
      {blacks === 0 ? (
        <h2 className="whites">Whites have won</h2>
      ) : (
        <h2>Blacks have won</h2>
      )}
      <button onClick={handleClick}>New Game</button>
    </div>
  );
};

export default EndGame;
