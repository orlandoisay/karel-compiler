import { Token } from "../tokenizer";
import { ASTNode, NodeType, NumberExpressionNode, ReturnNode, TokenType } from "../types";

interface Parser {
  getLookAheadType: () => TokenType,
  eatToken: (type: TokenType) => Token,
  eatNode: (type: NodeType) => any,
}

export interface ParserHelper {
  parse: () => ASTNode,
}

export class ReturnParserHelper implements ParserHelper {
  parser: Parser;

  constructor(parser: Parser) {
    this.parser = parser;
  }
  
  public parse(): ReturnNode {
    this.parser.eatToken('Return');

    let value: NumberExpressionNode | null = null;
    if (this.parser.getLookAheadType() !== ';') {
      value = this.parser.eatNode('NumberExpression') as NumberExpressionNode;
    }      

    this.parser.eatToken(';');

    return {
      type: 'Expression',
      name: 'Return',
      value,
    };
  }
}