import { Scope } from '../types';

export class ScopeStack {
  stack: Scope[] = [];

  public push(scope: Scope): void {
    this.stack.push(scope);
  }

  public pop(): void {
    if (this.stack.length === 0) {
      throw Error('Tried to pop empty Scope stack.');
    }

    this.stack.pop();
  }

  public top(): Scope {
    return this.stack[this.stack.length - 1];
  }
}