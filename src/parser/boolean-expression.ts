import { BooleanAndExpressionNode, BooleanExpressionNode } from '../types';
import { NodeParser, ParserHelpers } from '../types/parser';

export class BooleanExpressionParser implements NodeParser {
  helpers: ParserHelpers;

  constructor(helpers: ParserHelpers) {
    this.helpers = helpers;
  }
  
  public parse(): BooleanExpressionNode {
    const terms: BooleanAndExpressionNode[] = [this.helpers.eatNode('BooleanAndExpression') as BooleanAndExpressionNode];

    while (this.helpers.getLookAheadType() === '||') {
      this.helpers.eatToken('||');
      const term = this.helpers.eatNode('BooleanAndExpression') as BooleanAndExpressionNode;
      terms.push(term);
    }

    return {
      type: 'BooleanExpression',
      terms,
    };
  }
}
