/**
 * @flow
 */

'use strict';

/** A two-dimensional array of board tiles. */
export type BoardTiles = number[][];
/** Coordinate reference for the empty tile in a board. */
export type TileCoord = {
  x: number;
  y: number;
};
/** Coordinate comparator object. */
export type CoordComparator = {
  board: TileCoord;
  goal: TileCoord;
};
