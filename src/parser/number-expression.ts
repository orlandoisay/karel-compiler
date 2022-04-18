import { IdentifierNode, NumberExpressionNode, NumberNode, NumberOperationNode } from "../types";
import { NodeParser, ParserHelpers } from "../types/parser";

export class NumberExpressionParser implements NodeParser {
  helpers: ParserHelpers;

  constructor(helpers: ParserHelpers) {
    this.helpers = helpers;
  }
  
  public parse(): NumberExpressionNode {
    let value: IdentifierNode | NumberNode | NumberOperationNode;

    switch (this.helpers.getLookAheadType()) {
      case 'Identifier': {
        value = this.helpers.eatNode('Identifier') as IdentifierNode;
        break;
      }
      case 'Number': {
        value = this.helpers.eatNode('Number') as NumberNode;
        break;
      }
      case 'NumberOperator': {
        value = this.helpers.eatNode('NumberOperation') as NumberOperationNode;
        break;
      }
      default:
        throw new SyntaxError(`Literal: Unexpected literal production`);
    }

    return {
      type: 'NumberExpression',
      value,
    };
  }
}