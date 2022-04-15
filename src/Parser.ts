import { 
  Token,
  Tokenizer,
  TokenType,
} from "./Tokenizer";

const ExpressionStartingTokens: TokenType[] = [
  'Identifier',
  'InstructionIdentifier',
  'Iterate',
  'Return',
];

export class Parser {
  tokenizer: Tokenizer = new Tokenizer();
  lookAhead: Token | null = null;

  public parse(program: string) {
    this.tokenizer.init(program);
    this.lookAhead = this.tokenizer.getNextToken();

    return this.Program();
  }

  private eat(tokenType: TokenType) {
    // console.log('Eating: ', tokenType);

    const token = this.lookAhead;

    if (token == null) {
      throw new SyntaxError(`Unexpected EOF, expected: "${tokenType}"`);
    }

    if (token.type !== tokenType) {
      throw new SyntaxError(`Unexpected token "${token.value}", expected: "${tokenType}"`)
    }

    this.lookAhead = this.tokenizer.getNextToken();

    return token;
  }

  private Program() {
    return {
      type: 'Program',
      body: this.Method(),
    };
  }

  private Block() {
    let expressions = [];

    this.eat('{');

    while (ExpressionStartingTokens.includes(this.lookAhead!.type)) {
      const expr = this.Expression();
      expressions.push(expr);
    }

    this.eat('}');

    return {
      type: 'ExpressionBlock',
      expressions,
    };
  }

  private Condition() {
    const token = this.eat('Condition');

    return {
      type: 'Condition',
      value: token.value,
    };
  }
  
  private Expression() {
    switch (this.lookAhead!.type) {
      case 'Identifier':
        return this.MethodCall();
      case 'InstructionIdentifier':
        return this.Instruction();
      case 'Iterate':
        return this.Iterate();
      case 'Return':
        return this.Return();
      default:
        throw new SyntaxError(`Literal: Unexpected literal production`);
    }
  }

  private Identifier() {
    const token = this.eat('Identifier');

    return {
      type: 'Identifier',
      value: token.value,
    };
  }

  private Instruction() {
    const token = this.eat('InstructionIdentifier');

    this.eat('(');
    this.eat(')');
    this.eat(';');

    return {
      type: 'Instruction',
      name: token.value,
    }
  }

  private Iterate() {
    this.eat('Iterate');
    this.eat('(');

    const value = this.NumberExpression();

    this.eat(')');

    const body = this.lookAhead!.value === '{'
      ? this.Block()
      : this.Expression();

    return {
      type: 'Iterate',
      argument: value,
      body,
    };
  }

  private Method() {
    this.eat('MethodType');

    const token = this.eat('Identifier');

    this.eat('(');

    let param = null;
    if (this.lookAhead!.type !== ')') {
      param = this.Identifier();
    }

    this.eat(')');

    const body = this.Block();

    return {
      type: 'Method',
      name: token.value,
      param,
      body,
    };
  }

  private MethodCall() {
    const token = this.eat('Identifier');

    this.eat('(');

    const argument = this.lookAhead!.type !== ')' 
      ? this.NumberExpression()
      : null;

    this.eat(')');
    this.eat(';');

    return {
      type: 'MethodCall',
      method: token.value,
      argument,
    };    
  }

  private Number() {
    const token = this.eat('Number');

    return {
      type: 'Number',
      value: Number(token.value),
    }
  }

  private NumberExpression(): any {
    switch (this.lookAhead!.type) {
      case 'Identifier':
        return this.Identifier();
      case 'Number':
        return this.Number();
      case 'NumberOperator':
        return this.NumberOperation();
      default:
        throw new SyntaxError(`Literal: Unexpected literal production`);
    }
  }

  private NumberOperation() {
    const token = this.eat('NumberOperator');

    this.eat('(');

    const argument = this.NumberExpression();

    this.eat(')');

    return {
      type: 'NumberExpression',
      operation: token.value,
      argument,
    };
  }

  private Return() {
    this.eat('Return');

    let value = null;
    if (this.lookAhead!.type !== ';') {
      value = this.NumberExpression();
    }      

    this.eat(';');

    return {
      type: 'Return',
      value,
    };
  }

  private While() {
    this.eat('While');
  }

  private Zero() {
    this.eat('Zero');
    this.eat('(');

    const argument = this.NumberExpression();

    this.eat(')');

    return {
      type: 'Zero',
      argument,
    };
  }
}
