import { ReservedKeywordSpecEntry, Token, TokenSpecEntry, TokenType } from './types';

const Spec: TokenSpecEntry[] = [
  { type: 'Number', rule: /^\d+/ },
  { type: 'Identifier', rule: /^[A-Za-z][A-Za-z0-9_]*/ },

  // Misc
  { type: '!', rule: /^!/ },
  { type: '&&', rule: /^&&/ },
  { type: '||', rule: /^\|\|/ },

  { type: '{', rule: /^\{/ },
  { type: '}', rule: /^\}/ },
  { type: '(', rule: /^\(/ },
  { type: ')', rule: /^\)/ },

  { type: ';', rule: /^;/ },

  { type: 'WhiteSpace', rule: /^\s+/ },
];

const ReservedKeywordsSpec: ReservedKeywordSpecEntry[] = [
  { type: 'Class', value: 'class' },

  { type: 'Condition', value: 'frontIsClear' },
  { type: 'Condition', value: 'frontIsClear' },
  { type: 'Condition', value: 'leftIsClear' },
  { type: 'Condition', value: 'leftIsBlocked' },
  { type: 'Condition', value: 'rightIsClear' },
  { type: 'Condition', value: 'rightIsBlocked' },
  { type: 'Condition', value: 'nextToABeeper' },
  { type: 'Condition', value: 'notNextToABeeper' },
  { type: 'Condition', value: 'anyBeepersInBeeperBag' },
  { type: 'Condition', value: 'noBeepersInBeeperBag' },
  { type: 'Condition', value: 'facingNorth' },
  { type: 'Condition', value: 'facingSouth' },
  { type: 'Condition', value: 'facingEast' },
  { type: 'Condition', value: 'facingWest' },
  { type: 'Condition', value: 'notFacingNorth' },
  { type: 'Condition', value: 'notFacingSouth' },
  { type: 'Condition', value: 'notFacingEast' },
  { type: 'Condition', value: 'notFacingWest' },

  { type: 'Else', value: 'else' },

  { type: 'If', value: 'if' },

  { type: 'InstructionIdentifier', value: 'move' },
  { type: 'InstructionIdentifier', value: 'turnleft' },
  { type: 'InstructionIdentifier', value: 'putbeeper' },
  { type: 'InstructionIdentifier', value: 'pickbeeper' },
  { type: 'InstructionIdentifier', value: 'turnoff' },

  { type: 'Iterate', value: 'iterate' },

  { type: 'MethodType', value: 'void' },
  { type: 'MethodType', value: 'define' },

  { type: 'NumberOperator', value: 'pred' },
  { type: 'NumberOperator', value: 'succ' },

  { type: 'Program', value: 'program' },

  { type: 'Return', value: 'return' },

  { type: 'While', value: 'while' },

  { type: 'Zero', value: 'iszero' },
];

export class Tokenizer {
  cursor = 0;
  program = '';

  constructor(program: string) {
    this.cursor = 0;
    this.program = program; 
  }

  public hasNextToken(): boolean {
    return this.cursor < this.program.length;
  }

  public getNextToken(): Token | null {
    if (!this.hasNextToken()) {
      return null;
    }

    const string = this.program.slice(this.cursor);

    for (const { type, rule } of Spec) {
      const match = string.match(rule);

      if (!match) {
        continue;
      }
      
      const start = this.cursor;
      const end = this.cursor + match[0].length - 1;

      this.cursor = end + 1;

      // White spaces should be skipped
      if (type === 'WhiteSpace') {
        return this.getNextToken();
      }

      const value = match[0].toString();
      let tokenType: TokenType = type;

      if (type === 'Identifier') {
        const keywordType = this.getMatchingKeyword(value);
        tokenType = keywordType || tokenType;
      }

      return {
        type: tokenType,
        value,
        start,
        end,
      };
    }

    throw new SyntaxError(`Unexpected token: "${string[0]}"`);
  }

  private getMatchingKeyword(identifier: string): TokenType | null {
    for (const { type, value } of ReservedKeywordsSpec) {
      if (identifier === value) {
        return type;
      }
    }

    return null;
  }
}
