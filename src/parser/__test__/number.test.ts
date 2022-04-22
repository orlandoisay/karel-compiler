import { Parser } from '..';

describe('Number', () => {
  it('should parse valid number', () => {
    const parser = new Parser('123');

    const result = parser.eatNode('Number');

    expect(result).toEqual({ 
      type: 'Number',
      value: 123,
    });
  });
});