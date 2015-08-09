var Board = require('./classes/board.js'),
    Solver = require('./classes/solver.js'),
    fs = require('fs');

var file, splitFile, N, tiles, initial, solver, solution;

// Parse File
file = fs.readFileSync(process.argv[2]).toString();
splitFile = file.split(/[\n\s]/);

N = parseInt(splitFile.shift());
tiles = [];

if (N <= 1) return console.log("The board needs to be bigger than 1 box.");

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
if (solver.isSolvable()) {
  solutions = solver.solution();
  solutions.every(function(solution) {
    console.log('Hamming:', solution.board.hamming());
    console.log('Manhattan:', solution.board.manhattan());
    console.log('Initial board:', '\n'+solution.board.viewBoard());
    var neighbors = solution.board.neighbors();
    neighbors.some(function(neighbor) {
      console.log('neighbor', '\n'+neighbor.viewBoard());
      console.log('hamming:', neighbor.hamming());
      console.log('manhattan:', neighbor.manhattan());
      console.log('-----------------------------------');
    });
  });
  // return console.log('Minimum number of moves: '+ solver.moves());
}
// No solution
return console.log('No solution possible.');