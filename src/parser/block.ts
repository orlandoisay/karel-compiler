import { BlockNode, ExpressionNode, TokenType } from "../types";
import { NodeParser, ParserHelpers } from "../types/parser";

const StartingTokens: TokenType[] = [
  ';',
  'Identifier',
  'If',
  'InstructionIdentifier',
  'Iterate',
  'Return',
  'While',
];

export class BlockParser implements NodeParser {
  helpers: ParserHelpers;

  constructor(helpers: ParserHelpers) {
    this.helpers = helpers;
  }
  
  public parse(): BlockNode {
    let expressions: ExpressionNode[] = [];

    this.helpers.eatToken('{');

    while (StartingTokens.includes(this.helpers.getLookAheadType())) {
      const exp = this.helpers.eatNode('Expression') as ExpressionNode;
      expressions.push(exp);
    }

    this.helpers.eatToken('}');

    return {
      type: 'Block',
      expressions,
    };
  }
}
