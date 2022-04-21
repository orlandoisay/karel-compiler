import { BooleanExpressionNode, BooleanUnitNode, ConditionNode, ZeroNode } from '../types';
import { NodeParser, ParserHelpers } from '../types/parser';

export class BooleanUnitParser implements NodeParser {
  helpers: ParserHelpers;

  constructor(helpers: ParserHelpers) {
    this.helpers = helpers;
  }
  
  public parse(): BooleanUnitNode {
    let value: ZeroNode | ConditionNode | BooleanExpressionNode;

    switch (this.helpers.getLookAheadType()) {
    case 'Zero': {
      value = this.helpers.eatNode('Zero') as ZeroNode;
      break;
    }
    case 'Condition': {
      value = this.helpers.eatNode('Condition') as ConditionNode;
      break;
    }
    case '(': {
      this.helpers.eatToken('(');
      value = this.helpers.eatNode('BooleanExpression') as BooleanExpressionNode;
      this.helpers.eatToken(')');
    }
    default: {
      throw SyntaxError('Unexpected token');
    }
    }

    return {
      type: 'BooleanUnit',
      value,
    };
  }
}
