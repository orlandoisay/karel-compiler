import { NumberExpressionNode, ReturnNode } from '../types';
import { NodeParser, ParserHelpers } from '../types/parser';

export class ReturnParser implements NodeParser {
  helpers: ParserHelpers;

  constructor(helpers: ParserHelpers) {
    this.helpers = helpers;
  }
  
  public parse(): ReturnNode {
    this.helpers.eatToken('Return');

    let value: NumberExpressionNode | null = null;
    if (this.helpers.getLookAheadType() !== ';') {
      value = this.helpers.eatNode('NumberExpression') as NumberExpressionNode;
    }      

    this.helpers.eatToken(';');

    return {
      type: 'Expression',
      name: 'Return',
      value,
    };
  }
}