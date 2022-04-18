import { BlockNode, BooleanExpressionNode, ExpressionNode, WhileNode } from "../types";
import { NodeParser, ParserHelpers } from "../types/parser";

export class WhileParser implements NodeParser {
  helpers: ParserHelpers;

  constructor(helpers: ParserHelpers) {
    this.helpers = helpers;
  }
  
  public parse(): WhileNode {
    this.helpers.eatToken('While');
    this.helpers.eatToken('(');

    const condition = this.helpers.eatNode('BooleanExpression') as BooleanExpressionNode;

    this.helpers.eatToken(')');

    const body: BlockNode | ExpressionNode = this.helpers.getLookAheadType() === '{'
      ? this.helpers.eatNode('Block') as BlockNode
      : this.helpers.eatNode('Expression') as ExpressionNode;

    return {
      type: 'Expression',
      name: 'While',
      condition,
      body,
    };
  }
}