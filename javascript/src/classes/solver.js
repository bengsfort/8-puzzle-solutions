/**
 * @flow
 * @TODO: Add check to determine if a puzzle is possible or not
 * @TODO: Clean up code for more readability
 * @TODO: Add detailed documentation for all methods
 */
import Board from './board';

type SolverState = {
  board: Board;
  moves: number;
  previous: ?SolverState;
};

type SolverSolution = {
  solution: Array<SolverState>;
  moves: number;
  context: Solver;
};

type SolutionCallback = (SolverSolution) => void;

export default class Solver {

  /** The current state of the Solver */
  state: SolverState;

  /** The starting board we are solving for */
  start: Board;

  /** The goal board we are trying to get to */
  goal: Board;

  /** The Solvers moves queue */
  queue: Array<SolverState>;

  /** List of finished solutions for slow callbacks */
  solutions: Array<SolverSolution>;

  /** List of onSolutionReady callbacks */
  doneCallbacks: Array<SolutionCallback>;

  constructor(initial: Board) {
    this.solutions = [];
    this.doneCallbacks = [];
    this.start = initial;
    this.goal = new Board(initial.goal);
    this.state = {
      board: initial,
      moves: 0,
      previous: null,
    };
    this.queue = [ this.state ];
    this.solve();
  }

  /**
   * Main solver function. Continues searching for moves until the state board equals the goal board.
   */
  solve(): void {
    while (!this.state.board.equals(this.goal)) {
      this.getNextMove();
    }
    this.solutionReady();
  }

    

    /**
     * function getNextMove ()
     */
    getNextMove () {
        let priority = [], bestOption,
            neighbors = this.state.board.getNeighbors();

        // Create a new priority queue with all neighbors that haven't already been used
        priority = this.createPriorityQueue( neighbors );

        // Decide which move is the best one to try next
        bestOption = this.chooseBestMove(priority);

        this.state = {
            board: bestOption,
            moves: this.state.moves + 1,
            previous: this.state
        };

        this.queue.push(this.state);
    }

    /**
     * function chooseBestMove (priority)
     */
    chooseBestMove (priority) {
        let curr, prev, bestOption;

        priority.map((item, index, arr) => {
            if (index == 0) {
                bestOption = item;
                return;
            }

            if ((item.hamming === 0 && item.manhattan === 0) ||
                (item.hamming < bestOption.hamming && item.manhattan < bestOption.manhattan)) {
                bestOption = item;
                return;
            }
        });

        return bestOption.board;
    }

    /**
     * function createPriorityQueue (boards)
     */
    createPriorityQueue ( boards ) {
        let priority = [];
        boards.map((board, i, arr) => {
            let test = this.checkPreviousBoards( board, this.queue, () => {
                return {
                    hamming   : board.hamming(this.state.moves),
                    manhattan : board.manhattan(this.state.moves),
                    board     : board
                };
            });
            if (test !== false) priority.push(test);
        });
        return priority;
    }

    /**
     * function checkPreviousBoards (board, queue, cb)
     * Returns true if NOT found
     */
    checkPreviousBoards (board, queue, cb) {
        if (queue.length === 1) return cb();
        let results, fireCb = false;

        results = queue.every((state) => {
            let boardCheck = board.equals(state.board.board); // should be false for "no matches"

            if (boardCheck === false) {
                fireCb = true;
                return true;
            }

            return false;
        });

        if (results === true) {
            return cb();
        }

        return results;
    }

    /**
     * function onSolutionReady(callback)
     */
    onSolutionReady (callback) {
        this.readyCallbacks = this.readyCallbacks || [];
        this.readyCallbacks.push(callback);

        if (this.hasOwnProperty('completedSolutions')) {
            this.completedSolutions.filter((finished) => {
                callback(finished.solution, finished.moves, finished.context);
            });
        }
    }

    /**
     * function solutionReady()
     */
    solutionReady () {
        if (this.hasOwnProperty('readyCallbacks')) {
            for (let i = 0, len = this.readyCallbacks.length; i < len; i++) {
                this.readyCallbacks[i](this.getSolution, this.getMoves, this);
            }
        }

        // Push completed solutions to a global array in case
        // the solution finishes before an event handler is declared.
        this.completedSolutions = [];
        this.completedSolutions.push({
            solution : this.getSolution,
            moves    : this.getMoves,
            context  : this
        });
    }

    /**
     * function isSolvable ()
     * @TODO
     */
    isSolvable () {
        return true || false;
    }

    /**
     * function getMoves()
     */
    get getMoves () {
        return this.state.moves;
    }

    /**
     * function priorityQueue ()
     */
    get priorityQueue () {
        return this.priority;
    }

    /**
     * function getState()
     */
    get getState () {
        return this.state;
    }

    /**
     * function getSolution ()
     */
    get getSolution () {
        return this.queue;
    }
}
