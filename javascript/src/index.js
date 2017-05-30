/**
 * 8puzzle Solver
 * Main app file
 * @TODO: Add check to determine if a puzzle is possible or not
 * @TODO: Refactor using more ES6 wherever it makes sense
 * @TODO: Clean up code for more readability
 * @TODO: Add detailed documentation for the entire codebase
 */
import Board from "./classes/board";
import Solver from "./classes/solver";
import fs from "fs";

var file, splitFile, N, tiles, initial, solver, solutions;

// Parse File
file = fs.readFileSync(process.argv[2]).toString();
splitFile = file.split(/[\n\s]/);

N = parseInt(splitFile.shift());
tiles = [];

if (N <= 1) {
    console.log("The board needs to be bigger than 1 box.");
    process.exit(1);
}

// Iterate through and create tiles
// Format - tiles[row][col]
for (var i = 0; i < N; i++) {
  tiles[i] = []; // Init empty array within current row
  for (var j = 0; j < N; j++) {
    tiles[i][j] = parseInt(splitFile.shift());
  }
}

initial = new Board(tiles);
solver = new Solver(initial);


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
