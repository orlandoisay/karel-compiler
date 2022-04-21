import { Parser } from '..';

describe('Identifier', () => {
  it('should parse valid identifier correctly - only letters', () => {
    const parser = new Parser('validIdentifier');

    const result = parser.eatNode('Identifier');

    expect(result).toEqual({ 
      type: 'Identifier',
      value: 'validIdentifier',
    });
  });

  it('should parse valid identifier correctly - alpha numeric', () => {
    const parser = new Parser('id0123');

    const result = parser.eatNode('Identifier');

    expect(result).toEqual({ 
      type: 'Identifier',
      value: 'id0123',
    });
  });

  it('should fail to parse invalid identifier - non alpha numeric', () => {
    const parser = new Parser('!!!');

    expect(() => parser.eatNode('Identifier')).toThrow();
  });

  it('should fail to parse invalid identifier - starts with number', () => {
    const parser = new Parser('0xasdf');

    expect(() => parser.eatNode('Identifier')).toThrow();
  });
});
