'use strict';

import { expect } from 'chai';
import Solver, {
  hasBoardBeenUsed,
} from '../solver';

/** @todo use actual mocking lib one of these days */
function MockBoard(testValue, testPriority) {
  const board = {
    neighbors: [],
    value: testValue,
    board: [[1, 2, 3], [4, 5, 6], [7, 8, 0]],
    goal: [[1, 2, 3], [4, 5, 6], [7, 8, 0]],
  };

  board.mockNeighbors = (...items) => {
    board.neighbors = [ ...items ];
  };
  board.getNeighbors = () => board.neighbors;
  board.getPriority = (moves) => testPriority || 10;
  board.equals = (other) => other.value === testValue;

  return board;
}

function MockSolverState(testValue, testPriority, moves) {
  return {
    board: new MockBoard(testValue, testPriority || 10),
    moves: 0,
    previous: null,
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
      const priority = solver.createPriorityQueue([ thirdBoard, firstBoard, secondBoard ], 0);

      expect(priority).to.be.an('array').that.has.lengthOf(3);
      expect(priority[0].board.equals(firstBoard)).to.be.true;
      expect(priority[1].board.equals(secondBoard)).to.be.true;
      expect(priority[2].board.equals(thirdBoard)).to.be.true;
    });
  });

  describe('#getNextMove', function() {
    const testStartBoard = new MockBoard('foo');

    it('should throw a NotSolvableError if there are no possible options', function() {
      const solver = new Solver(testStartBoard);
      const firstState = new MockSolverState('foo', 0);
      firstState.board.mockNeighbors(testStartBoard);
      expect(
        () => solver.getNextMove(firstState, [ firstState ])
      ).to.throw('Board not solvable!');
    });

    it('should return a solver state', function() {
      const solver = new Solver(testStartBoard);
      const firstState = new MockSolverState('bar', 2);
      firstState.board.mockNeighbors(testStartBoard);
      const result = solver.getNextMove(firstState, []);

      expect(result).to.not.be.undefined;
      expect(result).to.have.a.property('board');
      expect(result.board.equals(testStartBoard)).to.be.true;
      expect(result).to.have.a.property('moves');
      expect(result.moves).to.be.a('number');
      expect(result).to.have.a.property('previous');
    });

    it('should increment number moves each state change', function() {
      const solver = new Solver(testStartBoard);
      const firstState = new MockSolverState('foo', 5, 0);
      const firstBoard = new MockBoard('bar', 1);

      firstState.board.mockNeighbors(firstBoard);
      expect(firstState.moves).to.equal(0);
      const nextState = solver.getNextMove(firstState, [ firstState ]);
      expect(nextState).to.not.be.undefined;
      expect(nextState.moves).to.equal(1);
    });

    it('should return the board with the lowest priority', function() {
      const solver = new Solver(testStartBoard);
      const firstState = new MockSolverState('foo', 5, 0);

      const highPriorityBoard = new MockBoard('high', 10);
      const medPriorityBoard = new MockBoard('med', 5);
      const lowPriorityBoard = new MockBoard('low', 1);

      firstState.board.mockNeighbors(highPriorityBoard, medPriorityBoard, lowPriorityBoard);
      const nextState = solver.getNextMove(firstState, [ firstState ]);

      expect(nextState).to.not.be.undefined;
      expect(nextState.board.equals(lowPriorityBoard)).to.be.true;
    });
  });
});
