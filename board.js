module.exports = function Board(tiles) {
  return {
    board: tiles,

    getGoalBoard: function() {
      var goal = [], nums = [];
      // Create array with correct num order
      var range = this.board.length * this.board[0].length;
      for (var i = 0; i <= range; i++) {
        if (i == range) nums.push(0);
        else nums.push(i + 1);
      }
      
      // Create goal
      for (var i = 0; i < this.board.length; i++) {
        goal[i] = []; // Init empty array within current row
        for (var j = 0; j < this.board[0].length; j++) {
          goal[i][j] = nums.shift();
        }
      }

      return goal;
    },

    viewBoard: function() {
      var boardView = "";
      for (var r = 0; r < this.board.length; r++) {
        for (var c = 0; c < this.board[r].length; c++) {
          if (this.board[r][c] === 0) boardView += " ";
          else boardView += this.board[r][c];
          boardView += c === this.board[r].length - 1 ? "\n" : " ";
        }
      }
      return boardView;
    },

    flattenBoard: function() {
      return combined = this.board.reduce(function(prev, cur) {
        return prev.concat(cur);
      });
    },

    // Hamming Priority Function
    // The number of blocks in the wrong position, plus the number of moves made so far to get to the state.
    // Intuitively, a state with a small number of blocks in the wrong position is close to the goal state,
    // and we prefer a state that have been reached using a small number of moves.
    hamming: function(moves) {
      moves = moves || 0;
      // 1 should be at the 0 index, 2 at 1, etc.
      return this.flattenBoard().filter(function(N) {
        if (N === 0) return false;
        else if (N !== this.flattenBoard()[N - 1]) return true;
      }, this).length;
    },

    // Manhattan Priority Function
    // The sum of the distances (sum of the vertical and horizontal distance) from the blocks to their goal 
    // positions, plus the number of moves made so far to get to the state.
    manhattan: function(moves) {
      moves = moves || 0;
      var goal = this.getGoalBoard(),
          board = this.board,
          coords = [],
          priority = 0,
          goalRow, goalCol, boardRow, boardCol;

      for (var i = 0; i < board.length * board[0].length; i++) {
        coords[i] = {};
        // Iterate through each row to get the coords of each
        // coords[1].boardRow = 0,
        // coords[1].boardCol = 2,
        // coords[1].goalRow = 0,
        // coords[1].goalCol = 0
        // It would take 2 moves to to get to the correct spot, add to priority
        for (r = 0; r < board.length; r++) {
          if (board[r].indexOf(i) !== -1) {
            coords[i].boardRow = r;
            coords[i].boardCol = board[r].indexOf(i);
          }
          if (goal[r].indexOf(i) !== -1) {
            coords[i].goalRow = r;
            coords[i].goalCol = goal[r].indexOf(i);
          }
        }
      }

      coords.reduce(function(prev, curr, i) {
        var x = Math.abs(curr.boardRow - curr.goalRow);
        var y = Math.abs(curr.boardCol - curr.goalCol);
        priority += x + y;
      });

      return priority;
    },

    equals: function(boardY) {
      return true || false;
    },

    neighbors: function() {
      return [];
    },

    toString: function() {
      return this.flattenBoard().join('');
    }
  };
};