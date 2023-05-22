import { createSlice } from "@reduxjs/toolkit";

const initializeBoard = () => {
  let boardArray = [];
  for (let row = 1; row < 9; row++) {// 1 to 8
    let pieceColor;
    let isKing;
    if (row === 2 || row === 3) {
      pieceColor = "black";
      isKing = false
    }
    if (row === 6 || row === 7) {
      pieceColor = "white";
      isKing = false
    }
    for (let col = 1; col < 9; col++) {// 1 to 8
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

export const gameSlice = createSlice({
  name: "game",
  initialState: {
    board: initializeBoard(),
    selectedPiece: null,
    availableMoves: [],
    blackPieces: 16,
    whitePieces: 16,
    turn: 'White',
  },
  reducers: {
    newGame: (state, action) => {
      state.blackPieces = 16
      state.whitePieces = 16
      state.turn = 'White'
      state.board = initializeBoard()
    },
    selectPiece: (state, action) => {
      state.selectedPiece = action.payload;
    },
    dropPiece: (state) => {
      state.selectedPiece = null;
      state.availableMoves = [];
    },
    movePiece: (state, action) => {
      const targetSquare = state.board.find(square =>
        square.location.row === action.payload.location.row && square.location.col === action.payload.location.col
      )
      const oldSquare = state.board.find(square =>
        square.location.row === state.selectedPiece.location.row && square.location.col === state.selectedPiece.location.col
      )

      /*if (state.turn === 'White' ) {
        state.turn = 'Black'
      }
      else {
        state.turn = 'White'
      }*/

      if (targetSquare.location.row === oldSquare.location.row) {//same row
        if (targetSquare.location.col - oldSquare.location.col > 0 
          && Math.abs(targetSquare.location.col - oldSquare.location.col) > 1) {//is the move to the right
          const capturedOpponent = state.board.find(square => 
            square.location.col === (targetSquare.location.col-1) && square.location.row === targetSquare.location.row)
            if (capturedOpponent.pieceColor === 'black') {
              state.blackPieces--;
            }
            else if (capturedOpponent.pieceColor === 'white') {
              state.whitePieces--;
            }
            else {
              if (state.turn === 'White' ) {
                state.turn = 'Black'
              }
              else {
                state.turn = 'White'
              }
            }
          capturedOpponent.pieceColor = undefined
        }
        else if (targetSquare.location.col - oldSquare.location.col < 0 
          && Math.abs(targetSquare.location.col - oldSquare.location.col) > 1) {//is the move to the left
          const capturedOpponent = state.board.find(square => 
            square.location.col === (targetSquare.location.col+1) && square.location.row === targetSquare.location.row)
            if (capturedOpponent.pieceColor === 'black') {
              state.blackPieces--;
            }
            else if (capturedOpponent.pieceColor === 'white') {
              state.whitePieces--;
            }
            else {
              if (state.turn === 'White' ) {
                state.turn = 'Black'
              }
              else {
                state.turn = 'White'
              }
            }
          capturedOpponent.pieceColor = undefined
        }
        else {
          if (state.turn === 'White' ) {
            state.turn = 'Black'
          }
          else {
            state.turn = 'White'
          }
        }
      }
      else if (targetSquare.location.col === oldSquare.location.col) {
        if (targetSquare.location.row - oldSquare.location.row > 0
          && Math.abs(targetSquare.location.row - oldSquare.location.row) > 1) {//is the move to the downwards
          const capturedOpponent = state.board.find(square => 
            square.location.row === (targetSquare.location.row-1) && square.location.col === targetSquare.location.col)
            if (capturedOpponent.pieceColor === 'black') {
              state.blackPieces--;
            }
            else if (capturedOpponent.pieceColor === 'white') {
              state.whitePieces--;
            }
            else {
              if (state.turn === 'White' ) {
                state.turn = 'Black'
              }
              else {
                state.turn = 'White'
              }
            }
          capturedOpponent.pieceColor = undefined
        }
        else if (targetSquare.location.row - oldSquare.location.row < 0 
          && Math.abs(targetSquare.location.row - oldSquare.location.row) > 1) {//is the move to the upwards
          const capturedOpponent = state.board.find(square => 
            square.location.row === (targetSquare.location.row+1) && square.location.col === targetSquare.location.col)
            if (capturedOpponent.pieceColor === 'black') {
              state.blackPieces--;
            }
            else if (capturedOpponent.pieceColor === 'white') {
              state.whitePieces--;
            }
            else {
              if (state.turn === 'White' ) {
                state.turn = 'Black'
              }
              else {
                state.turn = 'White'
              }
            }
          capturedOpponent.pieceColor = undefined
        }
        else {
          if (state.turn === 'White' ) {
            state.turn = 'Black'
          }
          else {
            state.turn = 'White'
          }
        }
      }
      

      if (oldSquare.pieceColor === 'white') {
        if (oldSquare.isKing || targetSquare.location.row === 1) {
          targetSquare.isKing = true
        }
        else{
          targetSquare.isKing = oldSquare.isKing
        }
      }
      else {
        if (oldSquare.isKing || targetSquare.location.row === 8) {
          targetSquare.isKing = true
        }
        else{
          targetSquare.isKing = oldSquare.isKing
        }
      }
      
      targetSquare.pieceColor = oldSquare.pieceColor
      oldSquare.pieceColor = undefined
      oldSquare.isKing = false
      
      state.availableMoves = [];
    },
    fetchKingMoves: (state, action) => {
      const { location, pieceColor } = action.payload;
      state.availableMoves = [];

      //get the squares placed before the piece
      const upwardsSquares = state.board.filter(
        (square) =>
          square.location.col === location.col &&
          square.location.row < location.row
      );

      //upwards iteration through the same column
      for (let i = upwardsSquares.length - 1; i >= 0; i--) {
        //if there is an allied piece
        if (upwardsSquares[i].pieceColor === pieceColor) {
          break;
        }
        //if there is an opponent piece
        else if (upwardsSquares[i].pieceColor && i > 0) {
          //check if this piece has another piece next to it in the same column
          if (!upwardsSquares[i - 1].pieceColor) {
            state.availableMoves.push(upwardsSquares[i - 1]);
          }
          break;
        }
        //empty squares
        else if (!upwardsSquares[i].pieceColor) {
          state.availableMoves.push(upwardsSquares[i]);
        }
      }

      //get the squares placed after the piece
      const downwardsSquares = state.board.filter(
        (square) =>
          square.location.col === location.col &&
          square.location.row > location.row
      );

      //downwards iteration through the same column
      for (let i = 0; i < downwardsSquares.length; i++) {
        //if there is an allied piece
        if (downwardsSquares[i].pieceColor === pieceColor) {
          break;
        }
        //if there is an opponent piece
        else if (downwardsSquares[i].pieceColor && i < downwardsSquares.length-1) {
          //check if this piece has another piece next to it in the same column
          if (!downwardsSquares[i + 1].pieceColor) {
            state.availableMoves.push(downwardsSquares[i + 1]);
          }
          break;
        }
        //empty squares
        else if (!downwardsSquares[i].pieceColor) {
          state.availableMoves.push(downwardsSquares[i]);
        }
      }

      //get the squares placed right side of the piece
      const rightSideSquares = state.board.filter(
        (square) =>
          square.location.row === location.row &&
          square.location.col > location.col
      );

      //right side iteration through the same row
      for (let i = 0; i < rightSideSquares.length; i++) {
        //if there is an allied piece
        if (rightSideSquares[i].pieceColor === pieceColor) {
          break;
        }
        //if there is an opponent piece
        else if (rightSideSquares[i].pieceColor && i < rightSideSquares.length-1) {
          //check if this piece has another piece next to it in the same column
          if (!rightSideSquares[i + 1].pieceColor) {
            state.availableMoves.push(rightSideSquares[i + 1]);
          }
          break;
        }
        //empty squares
        else if (!rightSideSquares[i].pieceColor) {
          state.availableMoves.push(rightSideSquares[i]);
        }
      }

      //get the squares placed left side of the piece
      const leftSideSquares = state.board.filter(
        (square) =>
          square.location.row === location.row &&
          square.location.col < location.col
      );

      //left side iteration through the same row
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
    },
    fetchAvailableMoves: (state, action) => {
      const { location, pieceColor } = action.payload;
      state.availableMoves = [];

      //squares that share the same column excluding the square itself
      const possibleColumns = state.board.filter(
        (square) =>
          square.location.col === location.col &&
          !(
            square.location.col === location.col &&
            square.location.row === location.row
          )
      );
      //squares that share the same row excluding the square itself
      const possibleRows = state.board.filter(
        (square) =>
          square.location.row === location.row &&
          !(
            square.location.col === location.col &&
            square.location.row === location.row
          )
      );

      for (let i = 0; i < possibleColumns.length; i++) {
        //0 to 6
        if (pieceColor === "white") {
          //find one square ahead
          if (possibleColumns[i].location.row === location.row - 1) {
            //check if the square is empty or filled by an opponent piece
            if (!possibleColumns[i].pieceColor) {
              state.availableMoves.push(possibleColumns[i]);
            } else if (possibleColumns[i].pieceColor !== pieceColor) {
              //check if there is a square behind the opponent piece
              if (i > 0) {
                //check the square behind the opponent piece
                if (!possibleColumns[i - 1].pieceColor) {
                  state.availableMoves.push(possibleColumns[i - 1]);
                }
              }
            }
          }
          //check left side columns
          if (possibleRows[i].location.col === location.col - 1) {
            //check if the square is empty or filled by an opponent piece
            if (!possibleRows[i].pieceColor) {
              state.availableMoves.push(possibleRows[i]);
            } else if (possibleRows[i].pieceColor !== pieceColor) {
              //check if there is a square behind the opponent piece
              if (i > 0) {
                //check the square behind the opponent piece
                if (!possibleRows[i - 1].pieceColor) {
                  state.availableMoves.push(possibleRows[i - 1]);
                }
              }
            }
          }
          //check right side columns
          if (possibleRows[i].location.col === location.col + 1) {
            //check if the square is empty or filled by an opponent piece
            if (!possibleRows[i].pieceColor) {
              state.availableMoves.push(possibleRows[i]);
            } else if (possibleRows[i].pieceColor !== pieceColor) {
              //check if there is a square behind the opponent piece
              if (i < 6) {
                //check the square behind the opponent piece
                if (!possibleRows[i + 1].pieceColor) {
                  state.availableMoves.push(possibleRows[i + 1]);
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
              state.availableMoves.push(possibleColumns[i]);
            } else if (possibleColumns[i].pieceColor !== pieceColor) {
              //check if there is a square behind the opponent piece
              if (i < 6) {
                //check the square behind the opponent piece
                if (!possibleColumns[i + 1].pieceColor) {
                  state.availableMoves.push(possibleColumns[i + 1]);
                }
              }
            }
          }
          //check left side columns
          if (possibleRows[i].location.col === location.col - 1) {
            //check if the square is empty or filled by an opponent piece
            if (!possibleRows[i].pieceColor) {
              state.availableMoves.push(possibleRows[i]);
            } else if (possibleRows[i].pieceColor !== pieceColor) {
              //check if there is a square behind the opponent piece
              if (i > 0) {
                //check the square behind the opponent piece
                if (!possibleRows[i - 1].pieceColor) {
                  state.availableMoves.push(possibleRows[i - 1]);
                }
              }
            }
          }
          //check right side columns
          if (possibleRows[i].location.col === location.col + 1) {
            //check if the square is empty or filled by an opponent piece
            if (!possibleRows[i].pieceColor) {
              state.availableMoves.push(possibleRows[i]);
            } else if (possibleRows[i].pieceColor !== pieceColor) {
              //check if there is a square behind the opponent piece
              if (i < 6) {
                //check the square behind the opponent piece
                if (!possibleRows[i + 1].pieceColor) {
                  state.availableMoves.push(possibleRows[i + 1]);
                }
              }
            }
          }
        }
      }
    },
  },
});

export const { selectPiece, dropPiece, fetchAvailableMoves, fetchKingMoves, movePiece, newGame } = gameSlice.actions;

export default gameSlice.reducer;
