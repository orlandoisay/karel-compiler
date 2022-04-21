import { EmptyNode, ExpressionNode, IfNode, InstructionNode, IterateNode, MethodCallNode, ReturnNode, WhileNode } from '../types';
import { NodeParser, ParserHelpers } from '../types/parser';

export class ExpressionParser implements NodeParser {
  helpers: ParserHelpers;

  constructor(helpers: ParserHelpers) {
    this.helpers = helpers;
  }
  
  public parse(): ExpressionNode {
    switch (this.helpers.getLookAheadType()) {
    case ';':
      return this.helpers.eatNode('Empty') as EmptyNode;
    case 'Identifier':
      return this.helpers.eatNode('MethodCall') as MethodCallNode;
    case 'If':
      return this.helpers.eatNode('If') as IfNode;
    case 'InstructionIdentifier':
      return this.helpers.eatNode('Instruction') as InstructionNode;
    case 'Iterate':
      return this.helpers.eatNode('Iterate') as IterateNode;
    case 'Return':
      return this.helpers.eatNode('Return') as ReturnNode;
    case 'While':
      return this.helpers.eatNode('While') as WhileNode;
    default:
      throw new SyntaxError('Literal: Unexpected literal production');
    }
  }
}
