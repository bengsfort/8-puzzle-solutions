/**
 * @flow
 */

'use strict';

import Board from './classes/board';
import Solver from './classes/solver';
import ParseBoard from './utils/parse-board';
import fs from 'fs';
// Parse File
const file: string = fs.readFileSync(process.argv[2]).toString();

// @todo: Create more elegant performance logging wrapper for this nonsense
let startTime;
let parseTime;
let boardCreateTime;
let solverCreateTime;
let endTime;

console.log('Read file. Solving...');
startTime = Date.now();
const tiles: number[][] = ParseBoard(file);
parseTime = Date.now();
const initial = new Board(tiles);
boardCreateTime = Date.now();
const solver = new Solver(initial);
solverCreateTime = Date.now();

// If the puzzle is solvable, continue solving
if (!solver.isSolvable()) {
  // No solution
  console.log('No solution possible.');
  process.exit(1);
}

solver.onSolutionReady((states, moves) => {
  endTime = Date.now();
  states.filter((state) => {
    console.log(state.board.viewBoard());
  });
  console.log(`Minimum number of moves: ${moves}`);
  console.log(`Solution found in ${(endTime - startTime) * 1000}ms.`);
  console.log(`\tBoard parsing:\t\t${(parseTime - startTime) * 1000}ms`);
  console.log(`\tBoard creation:\t\t${(boardCreateTime - parseTime) * 1000}ms`);
  console.log(`\tSolver creation:\t\t${(solverCreateTime - boardCreateTime) * 1000}ms`);
  console.log(`\tSolving:\t\t\t${(endTime - solverCreateTime) * 1000}ms`);
  process.exit(0);
});
