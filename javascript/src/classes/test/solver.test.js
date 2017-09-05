'use strict';

import { expect } from 'chai';
import Solver, {
  hasBoardBeenUsed,
} from '../solver';

function MockBoard(testValue, testPriority) {
  return {
    value: testValue,
    board: [[1, 2, 3], [4, 5, 6], [7, 8, 0]],
    goal: [[1, 2, 3], [4, 5, 6], [7, 8, 0]],
    getPriority: (moves) => testPriority || 10,
    equals: (val) => val === testValue,
  };
}

function MockSolverState(val) {
  return {
    board: val,
  };
}

describe('solver.js tests', function() {
  describe('#helpers', function() {
    const testQueue = [
      new MockSolverState('foo'),
      new MockSolverState('bar'),
      new MockSolverState('gaz'),
    ];

    it('#hasBoardBeenUsed should return true if a board has exists in a queue', function() {
      const board = new MockBoard('foo');
      expect(hasBoardBeenUsed(board, testQueue)).to.be.true;
    });

    it('#hasBoardBeenUsed should return false if a board does not exist in a queue', function() {
      const board = new MockBoard('seinfeld');
      expect(hasBoardBeenUsed(board, testQueue)).to.be.false;
    });
  });

  describe('#createPriorityQueue', function() {
    const testStartBoard = new MockBoard('foo');

    it('should return a priority-sorted list of boards', function() {
      const solver = new Solver(testStartBoard);
      const firstBoard = new MockBoard('a', 1);
      const secondBoard = new MockBoard('b', 2);
      const thirdBoard = new MockBoard('c', 3);
      const priority = solver.createPriorityQueue([ thirdBoard, firstBoard, secondBoard ]);

      expect(priority).to.be.an('array').that.has.lengthOf(3);
      expect(priority[0].board.equals('a')).to.be.true;
      expect(priority[1].board.equals('b')).to.be.true;
      expect(priority[2].board.equals('c')).to.be.true;
    });

    it('should ignore boards that have already been used', function() {
      const solver = new Solver(testStartBoard);
      const firstBoard = new MockBoard('a', 1);
      const secondBoard = new MockBoard('b', 2);
      const priority = solver.createPriorityQueue([ testStartBoard, firstBoard, secondBoard ]);

      expect(priority).to.be.an('array').that.has.lengthOf(2);
      expect(priority[0].board.equals('a')).to.be.true;
      expect(priority[0].board.equals('b')).to.be.true;
    });
  });
});
