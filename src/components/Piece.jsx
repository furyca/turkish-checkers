import { useDispatch, useSelector } from "react-redux";
import {
  selectPiece,
  dropPiece,
  fetchAvailableMoves,
  fetchKingMoves,
} from "../redux/gameSlice";
import { useEffect, useState } from "react";

const Piece = ({ id, pieceColor, location, isKing }) => {
  const dispatch = useDispatch();
  const selectedPiece = useSelector((state) => state.game.selectedPiece);
  const turn = useSelector(state => state.game.turn)
  const [selected, setSelected] = useState(false);

  useEffect(() => {
    if (selectedPiece?.id === id) {
      setSelected(true);
    } else {
      setSelected(false);
    }
  }, [selectedPiece, id, selected, pieceColor, location.row]);

  const handleClick = () => {
    if (selectedPiece?.id === id) {
      dispatch(dropPiece({ id }));
    }
    else if ((turn === 'White' && pieceColor === 'white') || (turn === 'Black' && pieceColor === 'black')) {
      dispatch(selectPiece({ id, location, isKing, pieceColor }));
      if (isKing) {
        dispatch(fetchKingMoves({ location, pieceColor }));
      } else {
        dispatch(fetchAvailableMoves({ location, pieceColor }));
      }
    }
  };

  return (
    <div
      className={`piece 
      ${pieceColor} 
      ${selected ? "piece-border-selected" : "piece-border-default"}`}
      onClick={handleClick}
    >
      {isKing && <img src="../assets/crown.png" alt="" />}
    </div>
  );
};

export default Piece;
