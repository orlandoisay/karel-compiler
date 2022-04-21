import { BlockNode, ExpressionNode, IterateNode, NumberExpressionNode } from '../types';
import { NodeParser, ParserHelpers } from '../types/parser';

export class IterateParser implements NodeParser {
  helpers: ParserHelpers;

  constructor(helpers: ParserHelpers) {
    this.helpers = helpers;
  }
  
  public parse(): IterateNode {
    this.helpers.eatToken('Iterate');
    this.helpers.eatToken('(');

    const argument = this.helpers.eatNode('NumberExpression') as NumberExpressionNode;
    
    this.helpers.eatToken(')');

    const body: BlockNode | ExpressionNode = this.helpers.getLookAheadType() === '{'
      ? this.helpers.eatNode('Block') as BlockNode
      : this.helpers.eatNode('Expression') as ExpressionNode;

    return {
      type: 'Expression',
      name: 'Iterate',
      argument,
      body,
    };
  }
}
