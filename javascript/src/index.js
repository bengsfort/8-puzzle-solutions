/**
 * @flow
 */

'use strict';

import Board from './classes/board';
import Solver from './classes/solver';
import ParseBoard from './utils/parse-board';
import fs from 'fs';

import type {
  SolverState,
  SolverSolution,
  NotSolvableError,
} from './classes/solver';

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

solver.solve()
  // Print out the solution to console then exit on success
  .then((solution: SolverSolution) => {
    endTime = Date.now();
    
    solution.states.filter((state) => {
      console.log(state.board.toString());
    });
    
    // Log results to console
    console.log(`Minimum number of moves: ${solution.moves}`);
    console.log(`Solution found in ${(endTime - startTime) * 1000}ms.`);
    console.log(`\tBoard parsing:\t\t${(parseTime - startTime) * 1000}ms`);
    console.log(`\tBoard creation:\t\t${(boardCreateTime - parseTime) * 1000}ms`);
    console.log(`\tSolver creation:\t\t${(solverCreateTime - boardCreateTime) * 1000}ms`);
    console.log(`\tSolving:\t\t\t${(endTime - solverCreateTime) * 1000}ms`);

    process.exit(0);
  })
  // Solver will throw an error if there was a problem or no solution available
  .catch(error => {
    console.error(`[${error.name}]:`, error.message);
    process.exit(1);
  });
