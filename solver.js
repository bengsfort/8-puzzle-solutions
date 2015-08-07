var Board = require('./board.js');

module.exports = function Solver (initial) {
  var state = {}, queue = [];

// Set initial state
  state = {
    board: initial,
    moves: 0,
    previous: null
  };
// Push the current state into the queue
  queue.push(state);

  console.log(queue);

  return {
    initial: initial,

    isSolvable: function() {
      return true || false;
    },

    moves: function() {
      return state.moves;
    },

    solution: function() {
      return queue;
    }
  };
};