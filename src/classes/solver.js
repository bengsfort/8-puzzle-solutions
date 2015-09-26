import Board from "./board";

export class Solver {
    constructor (initial) {
        let state = {}, queue = [],
            goal = initial.getGoalBoard();

        this.initial = initial;
        this.goal = goal;

        // Set initial state
        state = {
            board: initial,
            moves: 0,
            previous: null
        };

        // Push current state into the queue
        queue.push(state);

        this.state = state;
        this.queue = queue;

        console.log(this.state.board.viewBoard());
        for (let a = 0; a < 30; a++) {
            this.getNextMove();
        }
    }

    getNextMove () {
        if (this.state.board.equals(this.goal)) return;
//        console.log(this);
        let priority = [], bestOption, option = {}, hamming, manhattan, newState, prevCheck,
            neighbors = this.state.board.neighbors();

        console.log('Current Board:');
        console.log(this.state.board.viewBoard());

        for (let i = 0, len = neighbors.length; i < len; i++) {
//            let prevCheck = this.checkPreviousBoards( neighbors[i] );
            if ( this.checkPreviousBoards( neighbors[i] ) ) {
                option.hamming = neighbors[i].hamming(this.state.moves);
                option.manhattan = neighbors[i].manhattan(this.state.moves);
                option.board = neighbors[i];
//                console.log(`Neighbor ${i}:\n Hamming: ${option.hamming}\n Manhattan: ${option.manhattan}`);
//                console.log(option.board.viewBoard());
//                console.log('-----------');
                priority.push(option);
                option = {};
            }
        }

//        console.log('priority length', priority.length);
//        console.log(priority);

        let curr, prev;
        for (let p = 0, plen = priority.length; p < plen; p++) {
            if (p > 0) {

                prev = priority[p - 1];
                curr = priority[p];

//                console.log(`Current / hamming: ${curr.hamming} manhattan: ${curr.manhattan}`);
//                console.log(`Previous / hamming: ${prev.hamming} manhattan: ${prev.manhattan}`);
                if (curr.hamming < prev.hamming && curr.manhattan < prev.manhattan) {
//                    console.log('Current is better than prev');
                    bestOption = curr.board;
                } else {
//                    console.log('Prev is better than current');
                    bestOption = prev.board;
                }
            } else {
                console.log(priority);
                bestOption = priority[0].board;
            }
        }

        this.state = {
            board: bestOption,
            moves: this.state.moves + 1,
            previous: this.state
        };

        this.queue.push(this.state);
        console.log('Next Board:');
        console.log(this.state.board.viewBoard());
        console.log(this.getMoves);
//        this.getNextMove();
    }

    // Returns true if NOT found
    checkPreviousBoards (board, queue = this.queue) {
        if (queue.length === 1) return true;
        return queue.every((state) => {
            let boardCheck = board.equals(state.board.board), // should be false for "no matches"
                neighborCheck = state.board.neighbors().every((neighbor) => {
                    return ! board.equals(neighbor.board);
                }); // true for "no matches" (because of the way every works)
            console.log('boardCheck', boardCheck);
            console.log('neighborCheck', neighborCheck);
            if (boardCheck === false && neighborCheck === true) return true;
            return false;
        });
    }

    isSolvable () {
        return true || false;
    }

    get getMoves () {
        return this.state.moves;
    }

    solution () {
        return this.queue;
    }
}

module.exports = Solver;
//module.exports = function Solver (initial) {
//  var state = {}, queue = [],
//      goal = initial.getGoalBoard();
//
//// Set initial state
//  state = {
//    board: initial,
//    moves: 0,
//    previous: null
//  };
//// Push the current state into the queue
//  queue.push(state);
//
//  while (!state.board.equals(goal)) {
//    var neighbors = state.board.neighbors(),
//        priority = [], hamming, manhattan;
//
//    for (var i = 0; i < neighbors.length; i++) {
//      hamming = neighbors[i].hamming(state.moves);
//      manhattan = neighbors[i].manhattan(state.moves);
//      priority[i] = hamming > manhattan ? hamming : manhattan;
//    }
//
//    // priority.filter(function(el, i, arr) {
//
//    // });
////    console.log(queue);
//  }
//
//  // if
////  console.log(queue);
//
//  return {
//    initial: initial,
//
//    isSolvable: function() {
//      return true || false;
//    },
//
//    getMoves: function() {
//      return state.moves;
//    },
//
//    solution: function() {
//      return queue;
//    }
//  };
//};
