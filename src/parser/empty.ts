import { EmptyNode } from "../types";
import { NodeParser, ParserHelpers } from "../types/parser";

export class EmptyParser implements NodeParser {
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
