import { BooleanAndExpressionNode, BooleanTermNode } from '../types';
import { NodeParser, ParserHelpers } from '../types/parser';

export class BooleanAndExpressionParser implements NodeParser {
  helpers: ParserHelpers;

  constructor(helpers: ParserHelpers) {
    this.helpers = helpers;
  }
  
  public parse(): BooleanAndExpressionNode {
    const terms: BooleanTermNode[] = [this.helpers.eatNode('BooleanTerm') as BooleanTermNode];

    while (this.helpers.getLookAheadType() === '&&') {
      this.helpers.eatToken('&&');
      const term = this.helpers.eatNode('BooleanTerm') as BooleanTermNode;
      terms.push(term);
    }

    return {
      type: 'BooleanAndExpression',
      terms,
    };
  }
}
