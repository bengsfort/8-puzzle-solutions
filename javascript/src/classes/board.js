/**
 * @flow
 */

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
 * Creates a new Board instance from an new 0 coordinate.
 * @param {BoardTiles} reference board to build the new board from
 * @param {TileCoord} position the new zero position (where to place the zero in the new board)
 * @param {TileCoord} oldPosition the old zero position (for efficiency reasons)
 * @returns a new board with zero at the provided position
 */
export const newBoardFromPosition = (reference: BoardTiles, position: TileCoord, oldPosition: TileCoord): Board => {
  const tiles = reference;
  // Replace the old 0 with the number being moved before assigning 0 to its new position
  tiles[oldPosition.y][oldPosition.x] = tiles[position.y][position.x];
  tiles[position.y][position.x] = 0;
  return new Board(tiles, position);
};

/**
 * Board class.
 */
export default class Board {

  /** Reference to the provided board */
  board: BoardTiles;

  /** The board height */
  height: number;

  /** The board width */
  width: number;

  /** Reference to the goal board */
  goal: BoardTiles;

  /** The current position of zero */
  zeroPosition: TileCoord;

  constructor(tiles: BoardTiles, position: ?TileCoord = null) {
    this.board = tiles;
    this.height = tiles.length;
    this.width = tiles[0].length;
    this.zeroPosition = position || getZeroPosition(this.board);
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
    const numTiles: number = this.height * this.width;
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

  getNeighbors(): Board[] {
    const result = [];

    // Work from right to left since most puzzles favour that direction
    for (let i = 1; i > -2; i -= 2) {
      // Check horizontally first...
      if (this.zeroPosition.x + i >= 0 && this.zeroPosition.x + i < this.width) {
        result.push(newBoardFromPosition(this.board, {
          x: this.zeroPosition.x + i,
          y: this.zeroPosition.y,
        }, this.zeroPosition));
      }

      // Now vertically...
      if (this.zeroPosition.y + i >= 0 && this.zeroPosition.y + i < this.height) {
        result.push(newBoardFromPosition(this.board, {
          x: this.zeroPosition.x,
          y: this.zeroPosition.y + i,
        }, this.zeroPosition));
      }
    }

    return result;
  }
}
