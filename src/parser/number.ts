import { NumberNode } from "../types";
import { Parser, ParserHelpers } from "../types/parser";

export class NumberParser implements Parser {
  helpers: ParserHelpers;

  constructor(helpers: ParserHelpers) {
    this.helpers = helpers;
  }
  
  public parse(): NumberNode {
    const token = this.helpers.eatToken('Number');

    return {
      type: 'Number',
      value: Number(token.value),
    };
  }
}