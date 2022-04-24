import { Parser } from '..';

describe('Empty', () => {
  it('should parse empty statement correctly - pred', () => {
    const parser = new Parser(';');

    const result = parser.eatNode('Empty');

    expect(result).toEqual({
      type: 'Expression',
      name: 'Empty',
    });
  });
});