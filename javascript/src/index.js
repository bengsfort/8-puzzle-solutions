// @flow

'use strict';

import Board from './classes/board';
import Solver from './classes/solver';
import parseBoard from './utils/parse-board';
import fs from 'fs';

// Parse File
const file: string = fs.readFileSync(process.argv[2]).toString();
const tiles: number[][] = parseBoard(file);

const initial = new Board(tiles);
const solver = new Solver(initial);

// If the puzzle is solvable, continue solving
if (!solver.isSolvable()) {
  // No solution
  console.log('No solution possible.');
  process.exit(1);
}

solver.onSolutionReady((states, moves) => {
  states.filter((state) => {
    console.log(state.board.viewBoard());
  });
  console.log(`Minimum number of moves: ${moves}`);
  process.exit(0);
});
