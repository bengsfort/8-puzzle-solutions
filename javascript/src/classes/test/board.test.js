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
const board4 = [[4, 2, 3], [1, 5, 6], [7, 8, 0]];
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
      let board = new Board(board2);
      expect(board.hamming(2)).to.equal(4);
      board = new Board(board1);
      expect(board.hamming(5)).to.equal(5);
    });
  });

  describe('#manhattan', function() {
    it('should return 0 when at the goal with no moves', function() {
      const board = new Board(board1);
      expect(board.manhattan(0)).to.equal(0);
    });

    it('should return the sum of the distances of out of place tiles to their position with no moves', function() {
      let board = new Board(board2);
      expect(board.manhattan(0)).to.equal(4);
      board = new Board(board4);
      expect(board.manhattan(0)).to.equal(2);
    });

    it('should return the sum of the distances of out of place tiles to their position with moves', function() {
      const board = new Board(board2);
      expect(board.manhattan(2)).to.equal(6);
      expect(board.manhattan(4)).to.equal(8);
    });
  });
});
