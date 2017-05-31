/**
 * 8puzzle Solver
 * Solver class
 * @TODO: Add check to determine if a puzzle is possible or not
 * @TODO: Clean up code for more readability
 * @TODO: Add detailed documentation for all methods
 */
import Board from "./board";

export class Solver {
    /**
     * function constructor (initial)
     */
    constructor (initial: Board) {
        let state = {}, queue = [],
            goal = initial.getGoalBoard();

        this.initial = initial;
        this.goal = goal;

        // Set initial state
        state = {
            board: initial,
            moves: 0,
            previous: null
        };

        // Push current state into the queue
        queue.push(state);

        this.state = state;
        this.queue = queue;
//        this.priority = []; Implement after fixing final board erroring out

        while ( ! this.state.board.equals(this.goal) ) {
            this.getNextMove();
        }

        this.solutionReady();
    }

    /**
     * function getNextMove ()
     */
    getNextMove () {
        let priority = [], bestOption,
            neighbors = this.state.board.neighbors();

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

module.exports = Solver;
