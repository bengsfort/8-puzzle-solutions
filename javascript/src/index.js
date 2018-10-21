/**
 * @flow
 */

'use strict';

import Timer from './classes/timer';
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

// Create timer
const timer = new Timer();
console.log('Read file. Solving...');

timer.start();
const tiles: number[][] = ParseBoard(file);
console.log(`Tiles: ${tiles}`);
timer.save('parseBoard');
const initial = new Board(tiles);
console.log(`Board: ${initial}`);
timer.save('createBoard');
const solver = new Solver(initial);
timer.save('createSolver');

solver.solve()
  // Print out the solution to console then exit on success
  .then((solution: SolverSolution) => {
    timer.save('solving');
    const speed = timer.end();

    solution.states.filter((state: SolverState) => {
      console.log(state.board.toString());
    });

    // Log results to console
    console.log(`Minimum number of moves: ${solution.moves}`);
    console.log(`Solution found in ${speed.total * 1000}ms.`);
    console.log(`\tBoard parsing:\t\t${speed.parseBoard * 1000}ms`);
    console.log(`\tBoard creation:\t\t${speed.createBoard * 1000}ms`);
    console.log(`\tSolver creation:\t\t${speed.createSolver * 1000}ms`);
    console.log(`\tSolving:\t\t\t${speed.solving * 1000}ms`);

    process.exit(0);
  })
  // Solver will throw an error if there was a problem or no solution available
  .catch((error: NotSolvableError) => {
    timer.save('solving');
    const speed = timer.end();

    console.error(`[${error.name}]:`, error.message);

    console.log(`Errored after ${speed.total * 1000}ms.`);
    console.log(`\tBoard parsing:\t\t${(speed.parseBoard || 0) * 1000}ms`);
    console.log(`\tBoard creation:\t\t${(speed.createBoard || 0) * 1000}ms`);
    console.log(`\tSolver creation:\t${(speed.createSolver || 0) * 1000}ms`);
    console.log(`\tSolving:\t\t${(speed.solving || 0) * 1000}ms`);

    process.exit(1);
  });
