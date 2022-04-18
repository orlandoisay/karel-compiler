import { BooleanTermNode, BooleanUnitNode } from "../types";
import { NodeParser, ParserHelpers } from "../types/parser";

export class BooleanTermParser implements NodeParser {
  helpers: ParserHelpers;

  constructor(helpers: ParserHelpers) {
    this.helpers = helpers;
  }
  
  public parse(): BooleanTermNode {
    let negated: boolean = false;

    if (this.helpers.getLookAheadType() === '!') {
      this.helpers.eatToken('!');
      negated = true;
    }

    const value = this.helpers.eatNode('BooleanUnit') as BooleanUnitNode;

    return {
      type: 'BooleanTerm',
      negated,
      value,
    };
  }
}
