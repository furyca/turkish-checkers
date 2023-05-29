import { createSlice, current } from "@reduxjs/toolkit";
import { initializeBoard, movement, checkKingStatus, changeTurn, completeMovement, upwardsIteration,
  downwardsIteration, rightIteration, leftIteration, loopForMoves
  } from '../utils/utils'

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

      const {targetOpponent, blacks, whites} = movement(targetSquare, oldSquare, current(state))

      state.blackPieces = blacks
      state.whitePieces = whites

      if (targetOpponent) {
        const capturedOpponent = state.board.find(square =>
          square.location.row === targetOpponent.location.row
          && square.location.col === targetOpponent.location.col
        )
        capturedOpponent.pieceColor = undefined
      }

      state.turn = changeTurn(current(state), targetOpponent)
      checkKingStatus(targetSquare, oldSquare, current(state))
      completeMovement(targetSquare, oldSquare)
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

      //get the squares placed after the piece
      const downwardsSquares = state.board.filter(
        (square) =>
          square.location.col === location.col &&
          square.location.row > location.row
      );

      //get the squares placed right side of the piece
      const rightSideSquares = state.board.filter(
        (square) =>
          square.location.row === location.row &&
          square.location.col > location.col
      );

      //get the squares placed left side of the piece
      const leftSideSquares = state.board.filter(
        (square) =>
          square.location.row === location.row &&
          square.location.col < location.col
      );

      const upwardsMoves = upwardsIteration(upwardsSquares, pieceColor, current(state))
      const downwardsMoves = downwardsIteration(downwardsSquares, pieceColor, current(state))
      const rightMoves = rightIteration(rightSideSquares, pieceColor, current(state))
      const leftMoves = leftIteration(leftSideSquares, pieceColor, current(state))

      state.availableMoves = [...upwardsMoves, ...downwardsMoves, ...leftMoves, ...rightMoves]
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

      state.availableMoves = loopForMoves(possibleRows, possibleColumns, location, pieceColor, current(state))
    },
  },
});

export const { selectPiece, dropPiece, fetchAvailableMoves, fetchKingMoves, movePiece, newGame } = gameSlice.actions;

export default gameSlice.reducer;
