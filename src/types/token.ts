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

export interface Token {
  type: TokenType,
  value: string,
  start: number,
  end: number,
}

export type ReservedKeywordType = 
  | 'Class' 
  | 'Condition' 
  | 'Else' 
  | 'If' 
  | 'InstructionIdentifier' 
  | 'Iterate' 
  | 'MethodType' 
  | 'NumberOperator'
  | 'Program'
  | 'Return'
  | 'While'
  | 'Zero';

export type ClassReservedKeywordValue = 'class';

export type ConditionReservedKeywordValue = 
  | 'frontIsClear'
  | 'frontIsBlocked'
  | 'leftIsClear'
  | 'leftIsBlocked'
  | 'rightIsClear'
  | 'rightIsBlocked'
  | 'nextToABeeper'
  | 'notNextToABeeper'
  | 'anyBeepersInBeeperBag'
  | 'noBeepersInBeeperBag'
  | 'facingNorth'
  | 'facingSouth'
  | 'facingEast'
  | 'facingWest'
  | 'notFacingNorth'
  | 'notFacingSouth'
  | 'notFacingEast'
  | 'notFacingWest';

export type ElseReservedKeywordValue = 'else';

export type IfReservedKeywordValue = 'if';

export type InstructionIdentifierKeywordValue = 
  | 'move'
  | 'turnleft'
  | 'putbeeper'
  | 'pickbeeper'
  | 'turnoff';

export type IterateKeywordValue = 'iterate';

export type MethodTypeKeywordValue = 'define' | 'void';

export type NumberOperatorKeywordValue = 'pred' | 'succ';

export type ProgramKeywordValue = 'program';

export type ReturnKeywordValue = 'return';

export type WhileKeywordValue = 'while';

export type ZeroKeywordValue = 'iszero';

export type ReservedKeywordValue = 
  | ClassReservedKeywordValue
  | ConditionReservedKeywordValue
  | ElseReservedKeywordValue
  | IfReservedKeywordValue
  | InstructionIdentifierKeywordValue
  | IterateKeywordValue
  | MethodTypeKeywordValue
  | NumberOperatorKeywordValue
  | ProgramKeywordValue
  | ReturnKeywordValue
  | WhileKeywordValue
  | ZeroKeywordValue;

export interface ReservedKeywordSpecEntry {
  type: ReservedKeywordType,
  value: ReservedKeywordValue,
}
