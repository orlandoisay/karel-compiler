import { IdentifierNode } from '../types';
import { NodeParser, ParserHelpers } from '../types/parser';

export class IdentifierParser implements NodeParser {
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
