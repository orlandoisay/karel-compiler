import { NumberOperatorType } from "./token";

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
  'Program' |
  'Return' |
  'While' |
  'Zero';

export interface ASTNode {
  type: string,
}

export interface BlockNode extends ASTNode {
  type: 'Block',
  expressions: any[],
}

export interface BooleanExpressionNode extends ASTNode {
  type: 'BooleanExpression',
  terms: BooleanAndExpressionNode[],
}

export interface BooleanAndExpressionNode extends ASTNode { 
  type: 'BooleanAndExpression',
  terms: BooleanTermNode[],
}

export interface BooleanTermNode extends ASTNode {
  type: 'BooleanTerm',
  negated: boolean,
  value: BooleanUnitNode,
}

export interface BooleanUnitNode extends ASTNode {
  type: 'BooleanUnit',
  value: ZeroNode | ConditionNode | BooleanExpressionNode,
}

export interface ConditionNode extends ASTNode {
  type: 'Condition',
  value: string,
}

export interface ElseNode extends ASTNode {
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

export interface IdentifierNode extends ASTNode {
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

export interface MethodNode extends ASTNode {
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

export interface NumberNode extends ASTNode {
  type: 'Number',
  value: number,
}

export interface NumberExpressionNode extends ASTNode { 
  type: 'NumberExpression',
  value: IdentifierNode | NumberNode | NumberOperationNode,
}

export interface NumberOperationNode extends ASTNode {
  type: 'NumberOperation',
  operator: NumberOperatorType,
  argument: NumberExpressionNode,
}

export interface ProgramNode extends ASTNode {
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

export interface ZeroNode extends ASTNode {
  type: 'Zero',
  argument: NumberExpressionNode,
}
