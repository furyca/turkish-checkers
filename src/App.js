import { useSelector } from "react-redux";
import Board from "./components/Board";
import EndGame from "./components/EndGame";
import Information from "./components/Information";

function App() {
  const blacks = useSelector(state => state.game.blackPieces)
  const whites = useSelector(state => state.game.whitePieces)

  return (
    <>
      {(blacks === 0 || whites === 0) && <EndGame />}
      <Information />
      <div className="container">
        <Board />
      </div>
    </>
    
  );
}

export default App;
