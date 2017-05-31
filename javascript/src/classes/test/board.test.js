'use strict';

import { expect } from 'chai';
import Board, { getGoalBoard, flattenBoard } from '../board';

describe('board.js tests', function() {
  describe('helpers', function() {
    it('#getGoalBoard should return a valid goal', function() {
      const result = getGoalBoard([[3, 2, 1], [4, 5, 6], [7, 8, 0]]);
      expect(result).to.not.be.null;
      expect(result).to.deep.equal([[1, 2, 3], [4, 5, 6], [7, 8, 0]]);
    });

    it('#flattenBoard should return a one-dimensional version of the board', function() {
      const result = flattenBoard([[1, 2, 3], [4, 5, 6], [7, 8, 0]]);
      expect(result).to.not.be.null;
      expect(result).to.deep.equal([1, 2, 3, 4, 5, 6, 7, 8, 0]);
    });
  });
});
