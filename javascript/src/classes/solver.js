/**
 * @flow
 * @todo: Add check to determine if a puzzle is possible or not
 */
'use strict';

import Board from './board';

export type SolverState = {
  board: Board;
  moves: number;
  previous: ?SolverState;
};

export type SolverSolution = {
  states: Array<SolverState>;
  moves: number;
  solvable: boolean;
  context: Solver;
};

export type PriorityQueueItem = {
  priority: number;
  board: Board;
};

/**
 * Error for when a board is not solvable.
 */
export class NotSolvableError {
  name: string;
  message: string;
  solver: SolverSolution;
  constructor(solver: SolverSolution) {
    this.message = 'Board not solvable!';
    this.name = 'NotSolvableError';
    this.solver = solver;
  }
}

/**
 * Checks to see whether a provided board has been used within a queue.
 * @param {Board} board - The board to check against the queue.
 * @param {Array<SolverState>} queue - The queue to check in.
 * @returns boolean - true if the board has been used previously.
 */
export const hasBoardBeenUsed = (board: Board, queue: Array<SolverState>): boolean => {
  return !queue.every(state => !board.equals(state.board));
};

export default class Solver {

  /** The current state of the Solver */
  state: SolverState;

  /** The starting board we are solving for */
  start: Board;

  /** The goal board we are trying to get to */
  goal: Board;

  /** The Solvers moves queue */
  history: Array<SolverState>;

  constructor(initial: Board) {
    this.start = initial;
    this.goal = new Board(initial.goal);
    this.state = {
      board: initial,
      moves: 0,
      previous: null,
    };
    this.history = [ this.state ];
  }

  /**
   * Main solver function. Continues searching for moves until the state board equals the goal board.
   * @todo: This should probably have less dependencies so that multiple solves can be happening at once.
   */
  solve(): Promise<?SolverSolution> {
    return new Promise((resolve, reject) => {
      try {
        while (!this.state.board.equals(this.goal)) {
          this.getNextMove();
        }
        resolve({
          states: this.history,
          moves: this.state.moves,
          context: this,
          solvable: true,
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Checks all neighbors and determines which one is the most likely to lead to a solved puzzle,
   * then pushes that into the state.
   */
  getNextMove(): void {
    // Create a new priority queue with all neighbors that haven't already been used
    const neighbors = this.state.board.getNeighbors();
    const priority = this.createPriorityQueue(neighbors);
    
    // If the priority queue is empty that means we've tried everything already
    if (priority.length < 1) {
      throw new NotSolvableError({
        states: this.history,
        moves: this.state.moves,
        context: this,
        solvable: false,
      });
    }

    this.state = {
      board: priority[0].board,
      moves: this.state.moves + 1,
      previous: this.state,
    };

    this.history.push(this.state);
  }

  /**
   * Creates a sorted priority queue from a group of boards.
   * @param {Array<Board>} boards - The group of boards the queue should be created from.
   * @returns Array<PriorityQueueItem> - A priority queue filled with the boards.
   */
  createPriorityQueue(boards: Array<Board>): Array<PriorityQueueItem> {
    const priority: Array<PriorityQueueItem> = [];
    boards.map(board => {
      console.log('checking board', board.board);
      if (!hasBoardBeenUsed(board, this.history)) {
        console.log('board has not been used...');
        priority.push({
          priority: board.getPriority(this.state.moves),
          board: board,
        });
      }
    });
    console.log('sorting result array');
    return priority.sort((a, b) => a.priority - b.priority);
  }
}
