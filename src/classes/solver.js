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
        for (let a = 0; a < 5; a++) {
            this.getNextMove();
        }
    }

    getNextMove () {
//        if (this.state.board.equals(this.goal)) return;
        let priority = [], bestOption, hamming, manhattan, newState,
            neighbors = this.state.board.neighbors();


        for (let i = 0, len = neighbors.length; i < len; i++) {
            hamming   = neighbors[i].hamming(this.state.moves);
            manhattan = neighbors[i].manhattan(this.state.moves);
            console.log(`Neighbor ${i}:\n Hamming: ${hamming}\n Manhattan: ${manhattan}`);
            console.log(neighbors[i].viewBoard());
            console.log('-----------');
            priority[i] = hamming > manhattan ? manhattan : hamming;
        }

//        console.log(priority.length);

        bestOption = priority.reduce((prev, curr, index) => {
//            console.log(index);
            if (prev < curr) {
                if (this.state.previous !== null) {
                    if (neighbors[index - 1].equals(this.state.previous.board.board) === false) {
                        return index - 1;
                    }

                    if (neighbors[index].equals(this.state.previous.board.board) === false) {
                        return index;
                    }
                }
                return index - 1;
            }
            return index;
        });

        newState = {
            board: neighbors[bestOption],
            moves: this.state.moves++,
            previous: this.state
        };

        this.state = newState;
        this.queue.push(this.state);
        console.log('Next Board: Board', bestOption);
        console.log(newState.board.viewBoard());
        console.log(this.getMoves);
//        this.getNextMove();
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
