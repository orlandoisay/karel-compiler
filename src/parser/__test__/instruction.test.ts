import { Parser } from '..';

describe('Instruction', () => {
  it('should parse valid instruction correctly - move', () => {
    const parser = new Parser('move();');

    const result = parser.eatNode('Instruction');

    expect(result).toEqual({
      type: 'Expression',
      name: 'Instruction',
      instruction: 'move',
    });
  });

  it('should parse valid instruction correctly - turnleft', () => {
    const parser = new Parser('turnleft();');

    const result = parser.eatNode('Instruction');

    expect(result).toEqual({
      type: 'Expression',
      name: 'Instruction',
      instruction: 'turnleft',
    });
  });

  it('should parse valid instruction correctly - pickbeeper', () => {
    const parser = new Parser('pickbeeper();');

    const result = parser.eatNode('Instruction');

    expect(result).toEqual({
      type: 'Expression',
      name: 'Instruction',
      instruction: 'pickbeeper',
    });
  });

  it('should parse valid instruction correctly - putbeeper', () => {
    const parser = new Parser('putbeeper();');

    const result = parser.eatNode('Instruction');

    expect(result).toEqual({
      type: 'Expression',
      name: 'Instruction',
      instruction: 'putbeeper',
    });
  });

  it('should parse valid instruction correctly - turnoff', () => {
    const parser = new Parser('turnoff();');

    const result = parser.eatNode('Instruction');

    expect(result).toEqual({
      type: 'Expression',
      name: 'Instruction',
      instruction: 'turnoff',
    });
  });

  it('should not parse invalid instruction', () => {
    const parser = new Parser('noninstruction();');

    expect(() => parser.eatNode('Instruction')).toThrow();
  });
});
