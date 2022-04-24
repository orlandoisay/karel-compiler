import { Parser } from '..';

describe('Number Operation', () => {
  it('should parse valid number operattion correctly - pred', () => {
    const parser = new Parser('pred(n)');

    const result = parser.eatNode('NumberOperation');

    expect(result).toMatchObject({
      type: 'NumberOperation',
      operator: 'pred',
    });
  });

  it('should parse valid number operattion correctly - succ', () => {
    const parser = new Parser('succ(5)');

    const result = parser.eatNode('NumberOperation');

    expect(result).toMatchObject({
      type: 'NumberOperation',
      operator: 'succ',
    });
  });
});