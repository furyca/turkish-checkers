export const initializeBoard = () => {
  let boardArray = [];
  for (let row = 1; row < 9; row++) {
    // 1 to 8
    let pieceColor;
    let isKing;
    if (row === 2 || row === 3) {
      pieceColor = "black";
      isKing = false;
    }
    if (row === 6 || row === 7) {
      pieceColor = "white";
      isKing = false;
    }
    for (let col = 1; col < 9; col++) {
      // 1 to 8
      let squareColor;

      if ((row + col) % 2 === 0) {
        squareColor = "black";
      } else {
        squareColor = "white";
      }
      boardArray.push({
        location: {
          row,
          col,
        },
        squareColor,
        pieceColor,
        isKing,
      });
    }
  }
  return boardArray;
};

export const movement = (targetSquare, oldSquare, state) => {
  let targetOpponent;
  let blacks = state.blackPieces;
  let whites = state.whitePieces;

  //is the movement horizontal
  if (targetSquare.location.row === oldSquare.location.row) {//same row
    if ( targetSquare.location.col - oldSquare.location.col > 1) {//is the movement to the right
      targetOpponent = state.board.find(square =>
        square.location.col === targetSquare.location.col - 1 &&
        square.location.row === targetSquare.location.row)

      if (targetOpponent.pieceColor) {
        targetOpponent.pieceColor === "black" ? blacks-- : whites--;
      }
    } 
    else if ( targetSquare.location.col - oldSquare.location.col < -1) {//is the movement to the left
      targetOpponent = state.board.find(square =>
        square.location.col === targetSquare.location.col + 1 &&
        square.location.row === targetSquare.location.row)

      if (targetOpponent.pieceColor) {
        targetOpponent.pieceColor === "black" ? blacks-- : whites--;
      }
    }
  }
  //or vertical
  else if (targetSquare.location.col === oldSquare.location.col) {
    if (targetSquare.location.row - oldSquare.location.row > 1) {//is the movement to the downwards
      targetOpponent = state.board.find(square =>
        square.location.row === targetSquare.location.row - 1 
        && square.location.col === targetSquare.location.col)
      
      if (targetOpponent.pieceColor) {
        targetOpponent.pieceColor === "black" ? blacks-- : whites--;
      }
    } 
    else if (targetSquare.location.row - oldSquare.location.row < -1 ) {//is the movement to the upwards
      targetOpponent = state.board.find(square =>
        square.location.row === targetSquare.location.row + 1
        && square.location.col === targetSquare.location.col)

      if (targetOpponent.pieceColor) {
        targetOpponent.pieceColor === "black" ? blacks-- : whites--;
      }
    }
  }

  else return null
  
  return {targetOpponent, blacks, whites};
}

export const completeMovement = (targetSquare, oldSquare) => {
  targetSquare.pieceColor = oldSquare.pieceColor
  oldSquare.pieceColor = undefined
  oldSquare.isKing = false
}

export const changeTurn = (state, targetOpponent) => {
  let turn = state.turn
  if (!targetOpponent?.pieceColor) {
    if (state.turn === "White") {
      turn = "Black";
    } 
    else {
      turn = "White";
    }
  }
  
  return turn
}

export const checkKingStatus = (targetSquare, oldSquare) => {
  if (oldSquare.pieceColor === "white") {
    if (oldSquare.isKing || targetSquare.location.row === 1) {
      targetSquare.isKing = true;
    } 
    else {
      targetSquare.isKing = oldSquare.isKing;
    }
  } 
  else {
    if (oldSquare.isKing || targetSquare.location.row === 8) {
      targetSquare.isKing = true;
    } 
    else {
      targetSquare.isKing = oldSquare.isKing;
    }
  }
};
