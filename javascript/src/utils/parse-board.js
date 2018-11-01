// @flow

'use strict';

import type { BoardTiles } from '../classes/board';

/**
 * Parses a stringified board representation and returns a tile set. Expected format:
 *
 * 3
 * 1 2 3
 * 4 5 6
 * 7 8 0
 *
 * The first number being the definition of the boards width/height.
 *
 * @param {string} board - The stringified board.
 * @returns A parsed tile set.
 */
const parseBoard = (board: string): BoardTiles => {
  const splitFile: string[] = board.split(/[\n\s]/);
  // As the first number in the file is the grid size definition, pop that for reference
  const numBoxes: number = parseInt(splitFile.shift(), 10);
  const tiles: BoardTiles = [];

  if (numBoxes * numBoxes !== splitFile.length - 1) {
    throw new Error('The board needs to have a size definition.');
  }

  if (numBoxes <= 1) {
    throw new Error('The board needs to be bigger than 1.');
  }

  // Iterate through the file and create tiles
  for (var i = 0; i < numBoxes; i++) {
    tiles[i] = []; // Init empty array within current row
    for (var j = 0; j < numBoxes; j++) {
      tiles[i][j] = parseInt(splitFile.shift(), 10);
    }
  }

  return tiles;
};

export default parseBoard;
