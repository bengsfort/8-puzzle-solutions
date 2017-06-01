'use strict';

import { expect } from 'chai';
import Board, {
  getGoalBoard,
  flattenBoard,
  getZeroPosition,
} from '../board';

const board1 = [[1, 2, 3], [4, 5, 6], [7, 8, 0]];
const board2 = [[3, 2, 1], [4, 5, 6], [7, 8, 0]];
const board3 = [[0, 2, 3], [6, 5, 4], [7, 8, 1]];
const formattedBoard1 = `
1 2 3
4 5 6
7 8  `;

describe('board.js tests', function() {
  describe('helpers', function() {
    it('#getGoalBoard should return a valid goal', function() {
      const result = getGoalBoard(board2);
      expect(result).to.not.be.null;
      expect(result).to.deep.equal(board1);
    });

    it('#flattenBoard should return a one-dimensional version of the board', function() {
      const result = flattenBoard(board1);
      expect(result).to.not.be.null;
      expect(result).to.deep.equal([1, 2, 3, 4, 5, 6, 7, 8, 0]);
    });

    it('#getZeroPosition should return the position of the blank tile', function() {
      const result1 = getZeroPosition(board1);
      expect(result1).to.be.an('object');
      expect(result1).to.deep.equal({ x: 2, y: 2 });

      const result2 = getZeroPosition(board3);
      expect(result2).to.be.an('object');
      expect(result2).to.deep.equal({ x: 0, y: 0});
    });
  });

  describe('#toString', function() {
    it('should return a formatted string representation of the board', function() {
      const board = new Board(board1);
      const stringifiedBoard = board.toString();
      expect(stringifiedBoard).to.be.a('string');
      expect(stringifiedBoard).to.equal(formattedBoard1);
    });
  });

  describe('#equals', function() {
    it('should return true when given an identical board', function() {
      const board = new Board(board1);
      expect(board.equals(board1)).to.be.true;
    });

    it('should return false when given a different board', function() {
      const board = new Board(board1);
      expect(board.equals(board2)).to.be.false;
    });
  });
});
