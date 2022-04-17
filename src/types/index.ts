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

export type NodeType = 
  'Block' |
  'BooleanAndExpression' |
  'BooleanExpression' |
  'BooleanTerm' |
  'BooleanUnit' |
  'Condition' |
  'Empty' |
  'Expression' |
  'Identifier' |
  'If' |
  'Instruction' |
  'Iterate' |
  'Method' |
  'MethodCall' |
  'Number' |
  'NumberExpression' |
  'NumberOperation' |
  'Return' |
  'While' |
  'Zero';

export interface ASTNode {
  type: string,
}

export interface BlockNode {
  type: 'Block',
  expressions: any[],
}

export interface BooleanExpressionNode {
  type: 'BooleanExpression',
  terms: BooleanAndExpressionNode[],
}

export interface BooleanAndExpressionNode { 
  type: 'BooleanAndExpression',
  terms: BooleanTermNode[],
}

export interface BooleanTermNode {
  type: 'BooleanTerm',
  negated: boolean,
  value: BooleanUnitNode,
}

export interface BooleanUnitNode {
  type: 'BooleanUnit',
  value: ZeroNode | ConditionNode | BooleanExpressionNode,
}

export interface ConditionNode {
  type: 'Condition',
  value: string,
}

export interface ElseNode {
  type: 'Else',
  body: BlockNode | ExpressionNode,
}

export interface EmptyNode extends ExpressionNode {
  name: 'Empty',
}

export interface ExpressionNode extends ASTNode {
  type: 'Expression',
  name: string,
}

export interface IdentifierNode {
  type: 'Identifier',
  value: string,
}

export interface IfNode extends ExpressionNode {
  name: 'If',
  condition: BooleanExpressionNode,
  ifBody: BlockNode | ExpressionNode,
  elseBody: BlockNode | ExpressionNode | null,
}

export interface InstructionNode extends ExpressionNode {
  name: 'Instruction',
  instruction: string,
}

export interface IterateNode extends ExpressionNode {
  name: 'Iterate',
  argument: NumberExpressionNode,
  body: BlockNode | ExpressionNode,
}

export interface MethodNode {
  type: 'Method',
  name: IdentifierNode,
  param: IdentifierNode | null,
  body: BlockNode,
}

export interface MethodCallNode extends ExpressionNode {
  name: 'MethodCall',
  method: string,
  argument: NumberExpressionNode | null,
}

export interface NumberNode {
  type: 'Number',
  value: number,
}

export interface NumberExpressionNode { 
  type: 'NumberExpression',
  value: IdentifierNode | NumberNode | NumberOperationNode,
}

export interface NumberOperationNode {
  type: 'NumberOperation',
  operator: NumberOperatorType,
  argument: NumberExpressionNode,
}

export interface ProgramNode {
  type: 'Program',
  methods: MethodNode[],
  program: BlockNode,
}

export interface ReturnNode extends ExpressionNode {
  name: 'Return',
  value: NumberExpressionNode | null,
}

export interface WhileNode extends ExpressionNode {
  name: 'While',
  condition: BooleanExpressionNode,
  body: BlockNode | ExpressionNode,
}

export interface ZeroNode {
  type: 'Zero',
  argument: NumberExpressionNode,
}



type Orientation = 'North' | 'West' | 'South' | 'East';

export interface Position {
  x: number,
  y: number,
}

type Amount = number | 'Infinite';

export interface KarelState {
  location: Position,
  orientation: Orientation,
  beepers: Amount,
}

interface BeepersHeap {
  location: Position,
  amount: Amount,
}

export interface World {
  state: KarelState,  
  heaps: BeepersHeap[],
}