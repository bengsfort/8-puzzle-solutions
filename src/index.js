//var Board = require('./classes/board.js'),
//    Solver = require('./classes/solver.js'),
//    fs = require('fs');

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

//let n = initial.neighbors();
//console.log(n.length);
//n.map((neighbor) => {
//    console.log('Hamming:', neighbor.hamming());
//    console.log('Manhattan:', neighbor.manhattan());
//    console.log('Initial:', '\n'+neighbor.viewBoard());
//});


// If the puzzle is solvable, continue solving
//if (!solver.isSolvable()) {
//    // No solution
//    console.log('No solution possible.');
//    process.exit(1);
//}
//
//solutions = solver.solution();
//solutions.every((solution) => {
//console.log('Hamming:', solution.board.hamming());
//console.log('Manhattan:', solution.board.manhattan());
//console.log('Initial board:', '\n'+solution.board.viewBoard());
////var neighbors = solution.board.neighbors();
////    neighbors.some((neighbor) => {
////      console.log('neighbor', '\n'+neighbor.viewBoard());
////      console.log('hamming:', neighbor.hamming());
////      console.log('manhattan:', neighbor.manhattan());
////      console.log('-----------------------------------');
////    });
//});
//console.log('Minimum number of moves: '+ solver.getMoves);
//process.exit(0);
