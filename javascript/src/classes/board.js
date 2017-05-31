// @flow

'use strict';

import type { BoardTiles } from '../types';

/**
 * Gets the goal board based on a provided board.
 * @param {BoardTiles} board The board to determine a goal for.
 * @returns {BoardTiles} the goal board.
 */
export const getGoalBoard = (board: BoardTiles): BoardTiles => {
  const range: number = board.length * board.length;
  const goal: BoardTiles = [];

  for (let y = 0, n = 1; y < board.length; y++) {
    goal[y] = [];
    for (let x = 0; x < board.length; x++, n++) {
      goal[y][x] = (n < range ? n : 0);
    }
  }

  return goal;
};

/**
 * Flattens a board into a one-dimensional array for easier parsing.
 * @param {BoardTiles} board The board to flatten.
 * @returns {number[]} A one-dimensional array.
 */
export const flattenBoard = (board: BoardTiles): number[] => {
  return board.reduce((prev, cur) => prev.concat(cur));
};

/**
 * Board class.
 */
export default class Board {

  /** Reference to the provided board */
  board: BoardTiles;

  goal: BoardTiles;

  constructor(tiles: BoardTiles) {
    this.board = tiles;
    this.goal = getGoalBoard(this.board);
  }

  /**
   * Returns a string representation of the board.
   * @returns {string} The board as a string.
   */
  toString(): string {
    return this.board
      .reduce((prev, cur) => `${prev}\n${cur.join(' ')}`, '')
      .replace('0', ' ');
  }

  /**
   * Compares two boards equality.
   * @param {BoardTiles} other The other board.
   * @returns {boolean} If the boards are equal.
   */
  equals(other: BoardTiles): boolean {
    const otherBoard = flattenBoard(other);
    return flattenBoard(this.board).every((val, i) => val === otherBoard[i]);
  }



}

// const Board = function (tiles) {
//   return {
//     board: tiles,

//     // Hamming Priority Function
//     // The number of blocks in the wrong position, plus the number of moves made so far to get to the state.
//     // Intuitively, a state with a small number of blocks in the wrong position is close to the goal state,
//     // and we prefer a state that have been reached using a small number of moves.
//     hamming: function(moves) {
//       moves = moves || 0;
//       // 1 should be at the 0 index, 2 at 1, etc.
//       return this.flattenBoard().filter(function(N) {
//         if (N === 0) return false;
//         else if (N !== this.flattenBoard()[N - 1]) return true;
//       }, this).length;
//     },

//     // Manhattan Priority Function
//     // The sum of the distances (sum of the vertical and horizontal distance) from the blocks to their goal
//     // positions, plus the number of moves made so far to get to the state.
//     manhattan: function(moves) {
//       moves = moves || 0;
//       var goal = this.getGoalBoard(),
//           board = this.board,
//           coords = [],
//           priority = 0,
//           goalRow, goalCol, boardRow, boardCol;

//       for (var i = 0; i < board.length * board[0].length; i++) {
//         coords[i] = {};
//         // Iterate through each row to get the coords of each
//         for (var r = 0; r < board.length; r++) {
//           if (board[r].indexOf(i) !== -1) {
//             coords[i].boardRow = r;
//             coords[i].boardCol = board[r].indexOf(i);
//           }
//           if (goal[r].indexOf(i) !== -1) {
//             coords[i].goalRow = r;
//             coords[i].goalCol = goal[r].indexOf(i);
//           }
//         }
//       }

//       coords.reduce(function(prev, curr, i) {
//         var x = Math.abs(curr.boardRow - curr.goalRow);
//         var y = Math.abs(curr.boardCol - curr.goalCol);
//         priority += x + y;
//       });

//       return priority;
//     },

//     getPriority: function(moves) {
//       var hamming = this.hamming(moves),
//           manhattan = this.manhattan(moves);
//       return hamming > manhattan ? manhattan : hamming;
//     },

//     equals: function(boardY) {
//       var boardX = this.board;
      
//       if (boardX.length !== boardY.length) {
//         return false;
//       }

// //        console.log('--------------------------------------');
// //        console.log('boardX');
// //        console.log(boardX);
// //        console.log('boardY');
// //        console.log(boardY);

//       var result = boardY.every(function(row, rowIndex) {
//         return row.every(function(col, colIndex) {
//           return col === boardX[rowIndex][colIndex];
//         });
//       });

//       return result;
//     },

//     getPossibleMoves: function(emptyCoords) {
//       var possibleNeighbors = [];

//       for (var i = -1; i < 2; i++) {
//         if (i != 0) {
//           if (emptyCoords.row + i >= 0 &&
//               emptyCoords.row + i < this.board[0].length) {
//             possibleNeighbors.push({
//               val: this.board[emptyCoords.row + i][emptyCoords.col],
//               row: emptyCoords.row + i,
//               col: emptyCoords.col
//             });
//           }

//           if (emptyCoords.col + i >= 0 &&
//               emptyCoords.col + i < this.board.length) {
//             possibleNeighbors.push({
//               val: this.board[emptyCoords.row][emptyCoords.col + i],
//               row: emptyCoords.row,
//               col: emptyCoords.col + i
//             });
//           }
//         }
//       }

//       return possibleNeighbors;
//     },

//     neighbors: function() {
//       var initBoard = this.board,
//           emptyCoords = {},
//           neighbors = [],
//           neighborCoords;

//       // Get coords of zero
//       for (var r = 0; r < this.board.length; r++) {
//         if (this.board[r].indexOf(0) !== -1) {
//           emptyCoords.row = r;
//           emptyCoords.col = this.board[r].indexOf(0);
//         }
//       }

//       // Get all possible moves
//       neighborCoords = this.getPossibleMoves(emptyCoords);

//       var newBoard;
//       // Iterate through all possible moves,
//       for (var i = 0; i < neighborCoords.length; i++) {
//         newBoard = [];
//         for (var r = 0; r < initBoard.length; r++) {
//           newBoard[r] = [];
//           for (var c = 0; c < initBoard[0].length; c++) {
//             if (r == emptyCoords.row && c == emptyCoords.col) {
//               newBoard[r].push(neighborCoords[i].val);
//             } else if (r == neighborCoords[i].row && c == neighborCoords[i].col) {
//               newBoard[r].push(0);
//             } else {
//               newBoard[r].push(initBoard[r][c]);
//             }
//           }
//         }
//         neighbors.push(new Board(newBoard));
//       }
//       return neighbors;
//     },

//     toString: function() {
//       return this.flattenBoard().join('');
//     }
//   };
// };
