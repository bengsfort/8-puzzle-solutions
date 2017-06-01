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

    it('#getZeroPosition should throw an error when there is no blank tile', function() {
      const fixture = () => getZeroPosition([[1, 2, 3], [4, 5, 6], [7, 8, 9]]);
      expect(fixture).to.throw();
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

  describe('#hamming', function() {
    it('should return 0 when at the goal with no moves', function() {
      const board = new Board(board1);
      expect(board.hamming(0)).to.equal(0);
    });

    it('should return the number of tiles out of place with no moves', function() {
      const board = new Board(board2);
      expect(board.hamming(0)).to.equal(2);
    });

    it('should return the number of tiles out of place plus the number of moves', function() {
      const wipBoard = new Board(board2);
      expect(wipBoard.hamming(2)).to.equal(4);
      const goalBoard = new Board(board1);
      expect(goalBoard.hamming(5)).to.equal(5);
    });
  });
});
