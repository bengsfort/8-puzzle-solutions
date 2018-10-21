/**
 * @providesModule Timer
 * @flow
 */

'use strict';

type TimerTick = {
  id: string;
  time: number;
};

type TimerResults = {
  [string]: number;
};

export default class Timer {
  _startTime: number;
  _lastTick: number;
  _results: TimerTick[];

  constructor() {
    this._results = [];
  }

  /**
   * Start Timer
   * Initializes the timer.
   */
  start(): void {
    this._startTime = Date.now();
    this._lastTick = this._startTime;
  }

  /**
   * Save time segment
   * Saves the current time under the provided ID string.
   * @param string id: The ID for this time segment.
   */
  save(id: string): void {
    const now: number = Date.now();
    this._results.push({
      id: id,
      time: now - this._lastTick,
    });
    this._lastTick = now;
  }

  /**
   * End timer
   * Stops the timer and returns all time segments.
   * @returns TimerResults: An array of all times + total time.
   */
  end(): TimerResults {
    const now: number = Date.now();
    const results: TimerResults = {
      total: now - this._startTime,
    };

    this._results.map(item => {
      results[item.id] = item.time;
    });

    return results;
  }
}
