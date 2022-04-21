import { IdentifierNode, NumberExpressionNode, NumberNode, NumberOperationNode, Scope } from "../types"

export class NumberExpressionResolver {
  scope: Scope;
  expression: NumberExpressionNode;

  constructor(scope: Scope, expression: NumberExpressionNode) {
    this.scope = scope;
    this.expression = expression;
  }

  public resolve(): number {
    return this.resolveNumberExpression(this.expression);
  }

  private resolveNumberExpression(expression: NumberExpressionNode): number {
    switch (expression.value.type) {
      case 'Number':
        return this.resolveNumber(expression.value);
      case 'Identifier':
        return this.resolveIdentifier(expression.value);
      case 'NumberOperation':
        return this.resolveOperation(expression.value);
    }
  }

  private resolveNumber(expression: NumberNode): number {
    return expression.value;
  }

  private resolveIdentifier(expression: IdentifierNode): number {    
    if (this.scope.identifier !== expression.value) {
      throw Error(`"${expression.value}" not found.`);
    }

    return this.scope.value;
  }

  private resolveOperation(expression: NumberOperationNode): number {
    const delta = expression.operator === 'succ' ? 1 : -1;

    return delta + this.resolveNumberExpression(expression.argument);
  }
}