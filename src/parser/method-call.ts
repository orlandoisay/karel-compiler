import { MethodCallNode, NumberExpressionNode } from "../types";
import { Parser, ParserHelpers } from "../types/parser";

export class MethodCallParser implements Parser {
  helpers: ParserHelpers;

  constructor(helpers: ParserHelpers) {
    this.helpers = helpers;
  }
  
  public parse(): MethodCallNode {
    const token = this.helpers.eatToken('Identifier');

    this.helpers.eatToken('(');

    const argument: NumberExpressionNode | null = this.helpers.getLookAheadType() !== ')' 
      ? this.helpers.eatNode('NumberExpression') as NumberExpressionNode
      : null;

    this.helpers.eatToken(')');
    this.helpers.eatToken(';');

    return {
      type: 'Expression',
      name: 'MethodCall',
      method: token.value,
      argument,
    };    
  }
}
