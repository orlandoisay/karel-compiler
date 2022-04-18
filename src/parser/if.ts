import { BlockNode, BooleanExpressionNode, ExpressionNode, IfNode } from "../types";
import { Parser, ParserHelpers } from "../types/parser";

export class IfParser implements Parser {
  helpers: ParserHelpers;

  constructor(helpers: ParserHelpers) {
    this.helpers = helpers;
  }
  
  public parse(): IfNode {
    this.helpers.eatToken('If');
    this.helpers.eatToken('(');

    const condition = this.helpers.eatNode('BooleanExpression') as BooleanExpressionNode;

    this.helpers.eatToken(')');

    const ifBody: BlockNode | ExpressionNode = this.helpers.getLookAheadType() === '{'
      ? this.helpers.eatNode('Block') as BlockNode
      : this.helpers.eatNode('Expression') as ExpressionNode;

    let elseBody: BlockNode | ExpressionNode | null = null;
    
    if (this.helpers.getLookAheadType() === 'Else') {
      this.helpers.eatToken('Else');

      elseBody = this.helpers.getLookAheadType() === '{'
        ? this.helpers.eatNode('Block') as BlockNode
        : this.helpers.eatNode('Expression') as ExpressionNode;
    }

    return {
      type: 'Expression',
      name: 'If',
      condition,
      ifBody,
      elseBody,
    };
  }
}
