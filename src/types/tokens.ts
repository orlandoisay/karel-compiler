export type TokenType = 
  'Class' |
  'Condition' |
  'Else' |
  'Identifier' |
  'If' |
  'InstructionIdentifier' |
  'Iterate' |
  'MethodType' |
  'Number' |
  'NumberOperator' |
  'Program' |
  'Return' |
  'While' |
  'Zero' |
  '!' | '||' | '&&' | '{' | '}' | '(' | ')' | ';' |
  'WhiteSpace';

export type NumberOperatorType = 'pred' | 'succ';

export interface TokenSpecEntry {
  type: TokenType,
  rule: RegExp,
}
