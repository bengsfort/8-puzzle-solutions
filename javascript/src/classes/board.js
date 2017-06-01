// @flow

'use strict';

import type {
  BoardTiles,
  TileCoord,
  CoordComparator,
} from '../types';

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
 * Finds the position of zero in a board and returns a coordinate for it
 * @param {BoardTiles} board Finds the position of zero within a board.
 * @returns {TileCoord} The tile coordinate of the empty tile.
 */
export const getZeroPosition = (board: BoardTiles): TileCoord => {
  for (let y = 0; y < board.length; y++) {
    for (let x = 0; x < board.length; x++) {
      if (board[y][x] === 0) {
        return { x, y };
      }
    }
  }
  throw new Error('Board does not contain an empty tile.');
};

/**
 * Board class.
 */
export default class Board {

  /** Reference to the provided board */
  board: BoardTiles;

  goal: BoardTiles;

  zeroPosition: TileCoord;

  constructor(tiles: BoardTiles) {
    this.board = tiles;
    this.zeroPosition = getZeroPosition(this.board);
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

  /**
   * Hamming priority function.
   * The number of blocks in the wrong position, plus the number of moves made so far to get to the state.
   * @param {number} moves The number of moves that have been taken.
   * @returns {number} The Hamming priority value.
   */
  hamming(moves: number = 0): number {
    // 1 should be at the 0 index, 2 at 1, etc.
    return flattenBoard(this.board).filter((n, idx) => {
      if (n === 0) {
        return false;
      }
      if (n !== idx + 1) {
        return true;
      }
    }).length + moves;
  }

  /**
   * Manhattan priority function.
   * The sum of the distances (vertical + horizontal) of blocks to their goal positions, plus the number of moves made so far.
   * @param {number} moves The moves taken so far.
   * @returns {number} The Manhattan priority value.
   */
  manhattan(moves: number = 0): number {
    const numTiles: number = this.board.length * this.board.length;
    let priority: number = moves;

    for (var i = 0; i < numTiles; i++) {
      const coords: CoordComparator = {};
      // Iterate through rows and see if the value exists
      for (var y = 0; y < this.board.length; y++) {
        const boardX = this.board[y].indexOf(i);
        const goalX = this.goal[y].indexOf(i);
        if (boardX !== -1) {
          coords.board = { x: boardX, y };
        }
        if (goalX !== -1) {
          coords.goal = { x: goalX, y };
        }
        if (coords.hasOwnProperty('board') && coords.hasOwnProperty('goal')) {
          break;
        }
      }

      priority += Math.abs(coords.board.x - coords.goal.x) + Math.abs(coords.board.y - coords.goal.y);
    }

    return priority;
  }

  /**
   * Returns the lowest priority function result as this boards priority.
   * @param {number} moves The number of moves so far.
   * @returns {number} The current priority.
   */
  getPriority(moves: number): number {
    const hamming = this.hamming(moves);
    const manhattan = this.manhattan(moves);
    return hamming > manhattan ? manhattan : hamming;
  }
}

// const Board = function (tiles) {
//   return {
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
//   };
// };
