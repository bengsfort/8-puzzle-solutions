'use strict';

import { expect } from 'chai';

import parseBoard from '../parse-board';

const validBoard = '3\n1 2 3\n4 5 6\n7 8 0\n';
const missingSizeBoard = '3 2 1\n4 5 6\n7 8 0\n';
const smallBoard = '1\n0';

describe('parse-board.js tests', function() {
  it('should return a two dimensional array', function() {
    const result = parseBoard(validBoard);
    expect(result).to.be.an('array');
    expect(result[0]).to.be.an('array');
  });

  it('should correctly parse a valid board', function() {
    const result = parseBoard(validBoard);
    expect(result).to.deep.equal([
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 0],
    ]);
  });

  it('should fail when parsing a board with no size definition', function() {
    expect(() => parseBoard(missingSizeBoard)).to.throw();
  });

  it('should fail when provided a board with a size of 1', function() {
    expect(() => parseBoard(smallBoard)).to.throw();
  });
});
