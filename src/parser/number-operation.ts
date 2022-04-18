import { NumberExpressionNode, NumberOperationNode, NumberOperatorType } from "../types";
import { Parser, ParserHelpers } from "../types/parser";

export class NumberOperationParser implements Parser {
  helpers: ParserHelpers;

  constructor(helpers: ParserHelpers) {
    this.helpers = helpers;
  }
  
  public parse(): NumberOperationNode {
    const token = this.helpers.eatToken('NumberOperator');

    this.helpers.eatToken('(');

    const argument = this.helpers.eatNode('NumberExpression') as NumberExpressionNode;

    this.helpers.eatToken(')');

    return {
      type: 'NumberOperation',
      operator: token.value as NumberOperatorType,
      argument,
    };
  }
}