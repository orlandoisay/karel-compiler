import { ASTNode, NodeType } from "./node";
import { Token, TokenType } from "./token";

export interface ParserHelpers {
  eatNode: (type: NodeType) => any,
  eatToken: (type: TokenType) => Token,
  getLookAheadType: () => TokenType,
}

export interface NodeParser {
  parse: () => ASTNode,
}