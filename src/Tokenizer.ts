export type TokenType = 
  'Condition' |
  'Iterate' |
  'Identifier' |
  'InstructionIdentifier' |
  'MethodType' |
  'Number' |
  'NumberOperator' |
  'Return' |
  'While' |
  'Zero' |
  '{' | '}' | '(' | ')' | ';' |
  'WhiteSpace';

export type NumberOperatorType = 'pred' | 'succ';

export interface TokenSpecEntry {
  type: TokenType,
  rule: RegExp,
}

const Spec: TokenSpecEntry[] = [
  { type: 'Number', rule: /^\d+/ },
  { type: 'Identifier', rule: /^[A-Za-z][A-Za-z0-9_]*/ },

  // Misc
  { type: '{', rule: /^\{/ },
  { type: '}', rule: /^\}/ },
  { type: '(', rule: /^\(/ },
  { type: ')', rule: /^\)/ },

  { type: ';', rule: /^;/ },

  { type: 'WhiteSpace', rule: /^\s+/ },
];

const SpecReservedKeywords: TokenSpecEntry[] = [
  // Condition
  { type: 'Condition', rule: /^frontIsClear$/ },
  { type: 'Condition', rule: /^frontIsBlocked$/ },
  { type: 'Condition', rule: /^leftIsClear$/ },
  { type: 'Condition', rule: /^leftIsBlocked$/ },
  { type: 'Condition', rule: /^rightIsClear$/ },
  { type: 'Condition', rule: /^rightIsBlocked$/ },
  { type: 'Condition', rule: /^nextToABeeper$/ },
  { type: 'Condition', rule: /^notNextToABeeper$/ },
  { type: 'Condition', rule: /^anyBeepersInBeeperBag$/ },
  { type: 'Condition', rule: /^noBeepersInBeeperBag$/ },
  { type: 'Condition', rule: /^facingNorth$/ },
  { type: 'Condition', rule: /^facingSouth$/ },
  { type: 'Condition', rule: /^facingEast$/ },
  { type: 'Condition', rule: /^facingWest$/ },
  { type: 'Condition', rule: /^notFacingNorth$/ },
  { type: 'Condition', rule: /^notFacingSouth$/ },
  { type: 'Condition', rule: /^notFacingEast$/ },
  { type: 'Condition', rule: /^notFacingWest$/ },

  // Instruction
  { type: 'InstructionIdentifier', rule: /^move$/ },
  { type: 'InstructionIdentifier', rule: /^turnleft$/ },
  { type: 'InstructionIdentifier', rule: /^putbeeper$/ },
  { type: 'InstructionIdentifier', rule: /^pickbeeper$/ },
  { type: 'InstructionIdentifier', rule: /^turnoff$/ },

  // Iterate
  { type: 'Iterate', rule: /^iterate$/ },

  // NumberOperator
  { type: 'NumberOperator', rule: /^pred$/ },
  { type: 'NumberOperator', rule: /^succ$/ },

  // MethodType
  { type: 'MethodType', rule: /^void$/ },
  { type: 'MethodType', rule: /^define$/ },

  // Return
  { type: 'Return', rule: /^return$/ },

  // While
  { type: 'While', rule: /^while$/ },

  // Zero
  { type: 'Zero', rule: /^iszero$/ }
];

export interface Token {
  type: TokenType,
  value: string,
  start: number,
  end: number,
}

export class Tokenizer {
  cursor: number = 0;
  program: string = '';

  init(program: string) {
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
      let match = string.match(rule);

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

      let value = match[0].toString();
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
    for (const { type, rule } of SpecReservedKeywords) {
      if (identifier.match(rule)) {
        return type;
      }
    }

    return null;
  }
}
