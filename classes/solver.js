var Board = require('./board.js');

module.exports = function Solver (initial) {
  var state = {}, queue = [],
      goal = initial.getGoalBoard();

// Set initial state
  state = {
    board: initial,
    moves: 0,
    previous: null
  };
// Push the current state into the queue
  queue.push(state);

  while (!state.board.equals(goal)) {
    var neighbors = state.board.neighbors(),
        priority = [], hamming, manhattan;

    for (var i = 0; i < neighbors.length; i++) {
      hamming = neighbors[i].hamming(state.moves);
      manhattan = neighbors[i].manhattan(state.moves);
      priority[i] = hamming > manhattan ? hamming : manhattan;
    }

    // priority.filter(function(el, i, arr) {
      
    // });
console.log(queue);
  }

  // if
  console.log(queue);

  return {
    initial: initial,

    isSolvable: function() {
      return true || false;
    },

    getMoves: function() {
      return state.moves;
    },

    solution: function() {
      return queue;
    }
  };
};