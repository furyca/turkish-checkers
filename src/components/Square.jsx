import { nanoid } from "@reduxjs/toolkit";
import Piece from "./Piece";
import { useDispatch, useSelector } from "react-redux";
import { movePiece } from "../redux/gameSlice";
import { useEffect, useRef, useState } from "react";

const Square = ({ squareColor, pieceColor, location, isKing }) => {
  const availableMoves = useSelector((state) => state.game.availableMoves);
  const [available, setAvailable] = useState(false);
  const dispatch = useDispatch();
  const id = useRef("");

  useEffect(() => {
    setAvailable(false);
    if (id.current === "") {
      id.current = nanoid()
    }
    for (let i = 0; i < availableMoves.length; i++) {
      if (availableMoves[i].location === location) {
        setAvailable(true);
      }
    }
  }, [availableMoves, location]);

  const handleClick = () => {
    if (available) {
      for (let i = 0; i < availableMoves.length; i++) {
        if (availableMoves[i].location === location) {
          dispatch(movePiece(availableMoves[i]))          
        }
      }
    }
  }
  
  return (
    <div className={`square ${available ? "available" : ""} ${squareColor}`} onClick={handleClick}>
      {pieceColor && (
        <Piece id={id} pieceColor={pieceColor} location={location} isKing={isKing} />
      )}
    </div>
  );
};

export default Square;
