import { NumberNode } from '../types';
import { NodeParser, ParserHelpers } from '../types/parser';

export class NumberParser implements NodeParser {
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