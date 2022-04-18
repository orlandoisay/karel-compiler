import { EmptyNode } from "../types";
import { Parser, ParserHelpers } from "../types/parser";

export class EmptyParser implements Parser {
  helpers: ParserHelpers;

  constructor(helpers: ParserHelpers) {
    this.helpers = helpers;
  }
  
  public parse(): EmptyNode {
    this.helpers.eatToken(';');

    return {
      type: 'Expression',
      name: 'Empty',
    };
  }
}
