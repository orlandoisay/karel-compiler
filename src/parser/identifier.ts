import { IdentifierNode } from "../types";
import { Parser, ParserHelpers } from "../types/parser";

export class IdentifierParser implements Parser {
  helpers: ParserHelpers;

  constructor(helpers: ParserHelpers) {
    this.helpers = helpers;
  }
  
  public parse(): IdentifierNode {
    const token = this.helpers.eatToken('Identifier');

    return {
      type: 'Identifier',
      value: token.value,
    };
  }
}
