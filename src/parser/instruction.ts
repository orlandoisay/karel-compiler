import { InstructionNode } from "../types";
import { NodeParser, ParserHelpers } from "../types/parser";

export class InstructionParser implements NodeParser {
  helpers: ParserHelpers;

  constructor(helpers: ParserHelpers) {
    this.helpers = helpers;
  }
  
  public parse(): InstructionNode {
    const token = this.helpers.eatToken('InstructionIdentifier');

    this.helpers.eatToken('(');
    this.helpers.eatToken(')');
    this.helpers.eatToken(';');

    return {
      type: 'Expression',
      name: 'Instruction',
      instruction: token.value,
    };
  }
}
