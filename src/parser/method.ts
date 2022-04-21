import { BlockNode, IdentifierNode, MethodNode } from '../types';
import { NodeParser, ParserHelpers } from '../types/parser';

export class MethodParser implements NodeParser {
  helpers: ParserHelpers;

  constructor(helpers: ParserHelpers) {
    this.helpers = helpers;
  }
  
  public parse(): MethodNode {
    this.helpers.eatToken('MethodType');

    const name = this.helpers.eatNode('Identifier') as IdentifierNode;

    this.helpers.eatToken('(');

    let param: IdentifierNode | null = null;
    if (this.helpers.getLookAheadType() !== ')') {
      param = this.helpers.eatNode('Identifier') as IdentifierNode;
    }

    this.helpers.eatToken(')');

    const body = this.helpers.eatNode('Block') as BlockNode;

    return {
      type: 'Method',
      name,
      param,
      body,
    };  
  }
}
