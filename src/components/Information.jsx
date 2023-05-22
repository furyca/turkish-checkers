import { useSelector } from "react-redux"

const Information = () => {
    const turn = useSelector(state => state.game.turn)
    const blacks = useSelector(state => state.game.blackPieces)
    const whites = useSelector(state => state.game.whitePieces)
    
  return (
    <div className="info">
        <div><span>Turn: </span> <span className={`${turn === 'White' ? 'whites' : ''}`}>{turn}</span></div>
        <div><span>Black Pieces: </span> <span>{blacks}</span></div>
        <div className="whites"><span>White Pieces: </span> <span>{whites}</span></div>
        
        
    </div>
  )
}

export default Information