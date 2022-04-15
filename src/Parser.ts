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

  public eatToken(tokenType: TokenType) {
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

    this.eatToken('{');

    while (ExpressionStartingTokens.includes(this.lookAhead!.type)) {
      const expr = this.Expression();
      expressions.push(expr);
    }

    this.eatToken('}');

    return {
      type: 'ExpressionBlock',
      expressions,
    };
  }

  private Condition() {
    const token = this.eatToken('Condition');

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
    const token = this.eatToken('Identifier');

    return {
      type: 'Identifier',
      value: token.value,
    };
  }

  private Instruction() {
    const token = this.eatToken('InstructionIdentifier');

    this.eatToken('(');
    this.eatToken(')');
    this.eatToken(';');

    return {
      type: 'Instruction',
      name: token.value,
    }
  }

  private Iterate() {
    this.eatToken('Iterate');
    this.eatToken('(');

    const value = this.NumberExpression();

    this.eatToken(')');

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
    this.eatToken('MethodType');

    const token = this.eatToken('Identifier');

    this.eatToken('(');

    let param = null;
    if (this.lookAhead!.type !== ')') {
      param = this.Identifier();
    }

    this.eatToken(')');

    const body = this.Block();

    return {
      type: 'Method',
      name: token.value,
      param,
      body,
    };
  }

  private MethodCall() {
    const token = this.eatToken('Identifier');

    this.eatToken('(');

    const argument = this.lookAhead!.type !== ')' 
      ? this.NumberExpression()
      : null;

    this.eatToken(')');
    this.eatToken(';');

    return {
      type: 'MethodCall',
      method: token.value,
      argument,
    };    
  }

  private Number() {
    const token = this.eatToken('Number');

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
    const token = this.eatToken('NumberOperator');

    this.eatToken('(');

    const argument = this.NumberExpression();

    this.eatToken(')');

    return {
      type: 'NumberExpression',
      operation: token.value,
      argument,
    };
  }

  private Return() {
    this.eatToken('Return');

    let value = null;
    if (this.lookAhead!.type !== ';') {
      value = this.NumberExpression();
    }      

    this.eatToken(';');

    return {
      type: 'Return',
      value,
    };
  }

  private While() {
    this.eatToken('While');
  }

  private Zero() {
    this.eatToken('Zero');
    this.eatToken('(');

    const argument = this.NumberExpression();

    this.eatToken(')');

    return {
      type: 'Zero',
      argument,
    };
  }
}
