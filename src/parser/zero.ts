import { NumberExpressionNode, ZeroNode } from "../types";
import { Parser, ParserHelpers } from "../types/parser";

export class ZeroParser implements Parser {
  helpers: ParserHelpers;

  constructor(helpers: ParserHelpers) {
    this.helpers = helpers;
  }
  
  public parse(): ZeroNode {
    this.helpers.eatToken('Zero');
    this.helpers.eatToken('(');

    const argument = this.helpers.eatNode('NumberExpression') as NumberExpressionNode;

    this.helpers.eatToken(')');

    return {
      type: 'Zero',
      argument,
    };
  }
}