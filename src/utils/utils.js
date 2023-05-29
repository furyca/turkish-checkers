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


export const upwardsIteration = (upwardsSquares, pieceColor, state) => {
  let upwardsAvailable = state.availableMoves

  for (let i = upwardsSquares.length - 1; i >= 0; i--) {
    //if there is an allied piece
    if (upwardsSquares[i].pieceColor === pieceColor) {
      break;
    }
    //if there is an opponent piece
    else if (upwardsSquares[i].pieceColor && i > 0) {
      //check if this piece has another piece next to it in the same column
      if (!upwardsSquares[i - 1].pieceColor) {
        upwardsAvailable.push(upwardsSquares[i - 1]);
      }
      break;
    }
    //empty squares
    else if (!upwardsSquares[i].pieceColor) {
      upwardsAvailable.push(upwardsSquares[i]);
    }
  }

  return upwardsAvailable
}

export const downwardsIteration = (downwardsSquares, pieceColor, state) => {
  let downwardsAvailable = state.availableMoves

  for (let i = 0; i < downwardsSquares.length; i++) {
    //if there is an allied piece
    if (downwardsSquares[i].pieceColor === pieceColor) {
      break;
    }
    //if there is an opponent piece
    else if (downwardsSquares[i].pieceColor && i < downwardsSquares.length-1) {
      //check if this piece has another piece next to it in the same column
      if (!downwardsSquares[i + 1].pieceColor) {
        downwardsAvailable.push(downwardsSquares[i + 1]);
      }
      break;
    }
    //empty squares
    else if (!downwardsSquares[i].pieceColor) {
      downwardsAvailable.push(downwardsSquares[i]);
    }
  }

  return downwardsAvailable
}

export const rightIteration = (rightSideSquares, pieceColor, state) => {
  let rightAvailable = state.availableMoves

  for (let i = 0; i < rightSideSquares.length; i++) {
    //if there is an allied piece
    if (rightSideSquares[i].pieceColor === pieceColor) {
      break;
    }
    //if there is an opponent piece
    else if (rightSideSquares[i].pieceColor && i < rightSideSquares.length-1) {
      //check if this piece has another piece next to it in the same column
      if (!rightSideSquares[i + 1].pieceColor) {
        rightAvailable.push(rightSideSquares[i + 1]);
      }
      break;
    }
    //empty squares
    else if (!rightSideSquares[i].pieceColor) {
      rightAvailable.push(rightSideSquares[i]);
    }
  }

  return rightAvailable
}

export const leftIteration = (leftSideSquares, pieceColor, state) => {
  let leftAvailable = state.availableMoves

  for (let i = leftSideSquares.length - 1; i >= 0; i--) {
    //if there is an allied piece
    if (leftSideSquares[i].pieceColor === pieceColor) {
      break;
    }
    //if there is an opponent piece
    else if (leftSideSquares[i].pieceColor && i > 0) {
      //check if this piece has another piece next to it in the same column
      if (!leftSideSquares[i - 1].pieceColor) {
        state.availableMoves.push(leftSideSquares[i - 1]);
      }
      break;
    }
    //empty squares
    else if (!leftSideSquares[i].pieceColor) {
      state.availableMoves.push(leftSideSquares[i]);
    }
  }

  return leftAvailable
}

export const loopForMoves = (possibleRows, possibleColumns, location, pieceColor, state) => {
  let moves = state.availableMoves
  for (let i = 0; i < possibleColumns.length; i++) {
    //0 to 6
    if (pieceColor === "white") {
      //find one square ahead
      if (possibleColumns[i].location.row === location.row - 1) {
        //check if the square is empty or filled by an opponent piece
        if (!possibleColumns[i].pieceColor) {
          moves.push(possibleColumns[i]);
        } 
        else if (possibleColumns[i].pieceColor !== pieceColor) {
          //check if there is a square behind the opponent piece
          if (i > 0) {
            //check the square behind the opponent piece
            if (!possibleColumns[i - 1].pieceColor) {
              moves.push(possibleColumns[i - 1]);
            }
          }
        }
      }
      //check left side columns
      if (possibleRows[i].location.col === location.col - 1) {
        //check if the square is empty or filled by an opponent piece
        if (!possibleRows[i].pieceColor) {
          moves.push(possibleRows[i]);
        } else if (possibleRows[i].pieceColor !== pieceColor) {
          //check if there is a square behind the opponent piece
          if (i > 0) {
            //check the square behind the opponent piece
            if (!possibleRows[i - 1].pieceColor) {
              moves.push(possibleRows[i - 1]);
            }
          }
        }
      }
      //check right side columns
      if (possibleRows[i].location.col === location.col + 1) {
        //check if the square is empty or filled by an opponent piece
        if (!possibleRows[i].pieceColor) {
          moves.push(possibleRows[i]);
        } else if (possibleRows[i].pieceColor !== pieceColor) {
          //check if there is a square behind the opponent piece
          if (i < 6) {
            //check the square behind the opponent piece
            if (!possibleRows[i + 1].pieceColor) {
              moves.push(possibleRows[i + 1]);
            }
          }
        }
      }
    }
    //black piece
    else {
      //find one square ahead
      if (possibleColumns[i].location.row === location.row + 1) {
        //check if the square is empty or filled by an opponent piece
        if (!possibleColumns[i].pieceColor) {
          moves.push(possibleColumns[i]);
        } else if (possibleColumns[i].pieceColor !== pieceColor) {
          //check if there is a square behind the opponent piece
          if (i < 6) {
            //check the square behind the opponent piece
            if (!possibleColumns[i + 1].pieceColor) {
              moves.push(possibleColumns[i + 1]);
            }
          }
        }
      }
      //check left side columns
      if (possibleRows[i].location.col === location.col - 1) {
        //check if the square is empty or filled by an opponent piece
        if (!possibleRows[i].pieceColor) {
          moves.push(possibleRows[i]);
        } else if (possibleRows[i].pieceColor !== pieceColor) {
          //check if there is a square behind the opponent piece
          if (i > 0) {
            //check the square behind the opponent piece
            if (!possibleRows[i - 1].pieceColor) {
              moves.push(possibleRows[i - 1]);
            }
          }
        }
      }
      //check right side columns
      if (possibleRows[i].location.col === location.col + 1) {
        //check if the square is empty or filled by an opponent piece
        if (!possibleRows[i].pieceColor) {
          moves.push(possibleRows[i]);
        } else if (possibleRows[i].pieceColor !== pieceColor) {
          //check if there is a square behind the opponent piece
          if (i < 6) {
            //check the square behind the opponent piece
            if (!possibleRows[i + 1].pieceColor) {
              moves.push(possibleRows[i + 1]);
            }
          }
        }
      }
    }
  }
  return moves
}