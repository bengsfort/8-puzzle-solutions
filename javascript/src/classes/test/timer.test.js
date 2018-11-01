'use strict';

import { expect } from 'chai';
import Timer from '../timer';

// Amount of time we are using to allow for setTimeout to derp on us
const TIMER_BUFFER = 10;
const TIMER_TEST_DURATION = 200;

describe('timer.js tests', function() {
  it('should save time increments with an id', function() {
    const time = new Timer();
    time.start();
    expect(time.getLength()).to.equal(0);
    time.save('foo');
    expect(time.getLength()).to.equal(1);
    time.save('bar');
    expect(time.getLength()).to.equal(2);
    const results = time.end();
    expect(results).to.have.keys('foo', 'bar', 'total');
  });

  it('should return an object with the total time included', function(done) {
    const time = new Timer();
    time.start();
    setTimeout(() => {
      const results = time.end();
      console.log('results: ', results.total * 0.001);
      expect(results).to.have.key('total');
      // Timer uses microseconds, so multiply by 1000
      expect(results.total).to.be.greaterThan(TIMER_TEST_DURATION * 1000);
      expect(results.total).to.be.lessThan((TIMER_TEST_DURATION + TIMER_BUFFER) * 1000);
      done();
    }, TIMER_TEST_DURATION);
  });
});

