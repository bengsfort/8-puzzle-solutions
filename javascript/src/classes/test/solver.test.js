'use strict';

import { expect } from 'chai';
import Solver, {
  hasBoardBeenUsed,
} from '../solver';

function MockBoard(testValue, testPriority) {
  return {
    // default to 10 if not provided
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
      console.log('testing....');
      const priority = solver.createPriorityQueue([ firstBoard, secondBoard, thirdBoard ]);
      expect(priority).to.be.an('array').that.has.lengthOf(3);
      expect(priority[0].equals(firstBoard)).to.be.true;
      expect(priority[1].equals(secondBoard)).to.be.true;
      expect(priority[2].equals(thirdBoard)).to.be.true;
    });
  });
});
