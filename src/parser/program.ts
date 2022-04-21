import { BlockNode, MethodNode, ProgramNode } from '../types';
import { NodeParser, ParserHelpers } from '../types/parser';

export class ProgramParser implements NodeParser {
  helpers: ParserHelpers;

  constructor(helpers: ParserHelpers) {
    this.helpers = helpers;
  }
  
  public parse(): ProgramNode {
    this.helpers.eatToken('Class');
    this.helpers.eatToken('Program');
    this.helpers.eatToken('{');

    const methods: MethodNode[] = [];

    while (this.helpers.getLookAheadType() !== 'Program') {
      const method = this.helpers.eatNode('Method') as MethodNode;
      methods.push(method);
    }

    this.helpers.eatToken('Program');
    this.helpers.eatToken('(');
    this.helpers.eatToken(')');

    const program = this.helpers.eatNode('Block') as BlockNode;

    this.helpers.eatToken('}');

    return {
      type: 'Program',
      methods,
      program,
    };
  }
}
