import { ConditionNode } from "../types";
import { NodeParser, ParserHelpers } from "../types/parser";

export class ConditionParser  implements NodeParser {
  helpers: ParserHelpers;

  constructor(helpers: ParserHelpers) {
    this.helpers = helpers;
  }
  
  public parse(): ConditionNode {
    const token = this.helpers.eatToken('Condition');

    return {
      type: 'Condition',
      value: token.value,
    };
  }
}
