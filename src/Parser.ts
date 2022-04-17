import { 
  NumberOperatorType,
  Token,
  Tokenizer,
  TokenType,
} from "./Tokenizer";



type NodeType = 
  'Block' |
  'BooleanAndExpression' |
  'BooleanExpression' |
  'BooleanTerm' |
  'BooleanUnit' |
  'Condition' |
  'Empty' |
  'Expression' |
  'Identifier' |
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


interface BlockNode {
  type: 'Block',
  expressions: any[],
}

interface BooleanExpressionNode {
  type: 'BooleanExpression',
  terms: BooleanAndExpressionNode[],
}

interface BooleanAndExpressionNode { 
  type: 'BooleanAndExpression',
  terms: BooleanTermNode[],
}

interface BooleanTermNode {
  type: 'BooleanTerm',
  negated: boolean,
  value: BooleanUnitNode,
}

interface BooleanUnitNode {
  type: 'BooleanUnit',
  value: ZeroNode | ConditionNode,
}

interface ConditionNode {
  type: 'Condition',
  value: string,
}

interface ExpressionNode {
  type: 'Expression',
  name: string,
}

interface EmptyNode extends ExpressionNode {
  name: 'Empty',
}

interface IdentifierNode {
  type: 'Identifier',
  value: string,
}

interface InstructionNode extends ExpressionNode {
  name: 'Instruction',
  instruction: string,
}

interface IterateNode extends ExpressionNode {
  name: 'Iterate',
  argument: NumberExpressionNode,
  body: BlockNode | ExpressionNode,
}

interface MethodNode {
  type: 'Method',
  name: IdentifierNode,
  param: IdentifierNode | null,
  body: BlockNode,
}

interface MethodCallNode extends ExpressionNode {
  name: 'MethodCall',
  method: string,
  argument: NumberExpressionNode | null,
}

interface NumberNode {
  type: 'Number',
  value: number,
}

interface NumberExpressionNode { 
  type: 'NumberExpression',
  value: IdentifierNode | NumberNode | NumberOperationNode,
}

interface NumberOperationNode {
  type: 'NumberOperation',
  operator: NumberOperatorType,
  argument: NumberExpressionNode,
}

interface ReturnNode extends ExpressionNode {
  name: 'Return',
  value: NumberExpressionNode | null,
}

interface WhileNode extends ExpressionNode {
  name: 'While',
  condition: BooleanExpressionNode,
  body: BlockNode | ExpressionNode,
}

interface ZeroNode {
  type: 'Zero',
  argument: NumberExpressionNode,
}



const ExpressionStartingTokens: TokenType[] = [
  ';',
  'Identifier',
  'InstructionIdentifier',
  'Iterate',
  'Return',
  'While',
];

export class Parser {
  tokenizer: Tokenizer = new Tokenizer();
  lookAhead: Token | null = null;

  public parse(program: string) {
    this.tokenizer.init(program);
    this.lookAhead = this.tokenizer.getNextToken();

    return this.Program();
  }

  private getLookAheadType(): TokenType {
    const token = this.lookAhead;

    if (token == null) {
      throw new SyntaxError('Unexpected EOF');
    }

    return token.type;
  }

  private eatToken(tokenType: TokenType) {
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

  private eatNode(nodeType: NodeType) {
    switch (nodeType) {
      case 'Block':
        return this.Block();
      case 'BooleanAndExpression':
        return this.BooleanAndExpression();
      case 'BooleanExpression':
        return this.BooleanExpression();
      case 'BooleanTerm':
        return this.BooleanTerm();
      case 'BooleanUnit':
        return this.BooleanUnit();
      case 'Condition':
        return this.Condition();
      case 'Expression':
        return this.Expression();
      case 'Identifier':
        return this.Identifier();
      case 'Instruction':
        return this.Instruction();
      case 'Method':
        return this.Method();
      case 'MethodCall':
        return this.MethodCall();
      case 'Number':
        return this.Number();
      case 'NumberExpression':
        return this.NumberExpression();
      case 'NumberOperation':
        return this.NumberOperation();
      case 'While':
        return this.While();
      case 'Zero':
        return this.Zero();
    }
  }

  private Program() {
    return {
      type: 'Program',
      body: this.eatNode('Method'),
    };
  }

  private Block(): BlockNode {
    let expressions: ExpressionNode[] = [];

    this.eatToken('{');

    while (ExpressionStartingTokens.includes(this.getLookAheadType())) {
      const exp = this.eatNode('Expression') as ExpressionNode;
      expressions.push(exp);
    }

    this.eatToken('}');

    return {
      type: 'Block',
      expressions,
    };
  }

  private BooleanAndExpression(): BooleanAndExpressionNode {
    let terms: BooleanTermNode[] = [this.eatNode('BooleanTerm') as BooleanTermNode];

    while (this.getLookAheadType() === '&&') {
      this.eatToken('&&');
      const term = this.eatNode('BooleanTerm') as BooleanTermNode;
      terms.push(term);
    }

    return {
      type: 'BooleanAndExpression',
      terms,
    };
  }

  private BooleanExpression(): BooleanExpressionNode {
    let terms: BooleanAndExpressionNode[] = [this.eatNode('BooleanAndExpression') as BooleanAndExpressionNode];

    while (this.getLookAheadType() === '||') {
      this.eatToken('||');
      const term = this.eatNode('BooleanAndExpression') as BooleanAndExpressionNode;
      terms.push(term);
    }

    return {
      type: 'BooleanExpression',
      terms,
    };
  }

  private BooleanTerm(): BooleanTermNode {
    let negated: boolean = false;

    if (this.getLookAheadType() === '!') {
      this.eatToken('!');
      negated = true;
    }

    const value = this.eatNode('BooleanUnit') as BooleanUnitNode;

    return {
      type: 'BooleanTerm',
      negated,
      value,
    };
  }

  private BooleanUnit(): BooleanUnitNode {
    let value: ZeroNode | ConditionNode;

    switch (this.getLookAheadType()) {
      case 'Zero': {
        value = this.eatNode('Zero') as ZeroNode;
        break;
      }
      case 'Condition': {
        value = this.eatNode('Condition') as ConditionNode;
        break;
      }
      // case '(': {
      //   this.eatToken('(');
      //   this.eatToken(')');
      // }
      default: {
        throw SyntaxError(`Unexpected token`);
      }
    }

    return {
      type: 'BooleanUnit',
      value,
    };
  }

  private Condition(): ConditionNode {
    const token = this.eatToken('Condition');

    return {
      type: 'Condition',
      value: token.value,
    };
  }

  private Empty(): EmptyNode {
    this.eatToken(';');

    return {
      type: 'Expression',
      name: 'Empty',
    };
  }
  
  private Expression(): ExpressionNode {
    switch (this.getLookAheadType()) {
      case ';':
        return this.Empty();
      case 'Identifier':
        return this.MethodCall();
      case 'InstructionIdentifier':
        return this.Instruction();
      case 'Iterate':
        return this.Iterate();
      case 'Return':
        return this.Return();
      case 'While':
        return this.While();
      default:
        throw new SyntaxError(`Literal: Unexpected literal production`);
    }
  }

  private Identifier(): IdentifierNode {
    const token = this.eatToken('Identifier');

    return {
      type: 'Identifier',
      value: token.value,
    };
  }

  private Instruction(): InstructionNode {
    const token = this.eatToken('InstructionIdentifier');

    this.eatToken('(');
    this.eatToken(')');
    this.eatToken(';');

    return {
      type: 'Expression',
      name: 'Instruction',
      instruction: token.value,
    }
  }

  private Iterate(): IterateNode {
    this.eatToken('Iterate');
    this.eatToken('(');

    const argument = this.eatNode('NumberExpression') as NumberExpressionNode;
    
    this.eatToken(')');

    const body: BlockNode | ExpressionNode = this.getLookAheadType() === '{'
      ? this.eatNode('Block') as BlockNode
      : this.eatNode('Expression') as ExpressionNode;

    return {
      type: 'Expression',
      name: 'Iterate',
      argument,
      body,
    };
  }

  private Method(): MethodNode {
    this.eatToken('MethodType');

    const name = this.eatNode('Identifier') as IdentifierNode;

    this.eatToken('(');

    let param: IdentifierNode | null = null;
    if (this.getLookAheadType() !== ')') {
      param = this.eatNode('Identifier') as IdentifierNode;
    }

    this.eatToken(')');

    const body = this.eatNode('Block') as BlockNode;

    return {
      type: 'Method',
      name,
      param,
      body,
    };
  }

  private MethodCall(): MethodCallNode {
    const token = this.eatToken('Identifier');

    this.eatToken('(');

    const argument: NumberExpressionNode | null = this.getLookAheadType() !== ')' 
      ? this.eatNode('NumberExpression') as NumberExpressionNode
      : null;

    this.eatToken(')');
    this.eatToken(';');

    return {
      type: 'Expression',
      name: 'MethodCall',
      method: token.value,
      argument,
    };    
  }

  private Number(): NumberNode {
    const token = this.eatToken('Number');

    return {
      type: 'Number',
      value: Number(token.value),
    }
  }

  private NumberExpression(): NumberExpressionNode {
    let value: IdentifierNode | NumberNode | NumberOperationNode;

    switch (this.getLookAheadType()) {
      case 'Identifier': {
        value = this.eatNode('Identifier') as IdentifierNode;
        break;
      }
      case 'Number': {
        value = this.eatNode('Number') as NumberNode;
        break;
      }
      case 'NumberOperator': {
        value = this.eatNode('NumberOperation') as NumberOperationNode;
        break;
      }
      default:
        throw new SyntaxError(`Literal: Unexpected literal production`);
    }

    return {
      type: 'NumberExpression',
      value,
    };
  }

  private NumberOperation(): NumberOperationNode {
    const token = this.eatToken('NumberOperator');

    this.eatToken('(');

    const argument = this.eatNode('NumberExpression') as NumberExpressionNode;

    this.eatToken(')');

    return {
      type: 'NumberOperation',
      operator: token.value as NumberOperatorType,
      argument,
    };
  }

  private Return(): ReturnNode {
    this.eatToken('Return');

    let value: NumberExpressionNode | null = null;
    if (this.getLookAheadType() !== ';') {
      value = this.eatNode('NumberExpression') as NumberExpressionNode;
    }      

    this.eatToken(';');

    return {
      type: 'Expression',
      name: 'Return',
      value,
    };
  }

  private While(): WhileNode {
    this.eatToken('While');
    this.eatToken('(');

    const condition = this.eatNode('BooleanExpression') as BooleanExpressionNode;

    this.eatToken(')');

    const body: BlockNode | ExpressionNode = this.getLookAheadType() === '{'
      ? this.eatNode('Block') as BlockNode
      : this.eatNode('Expression') as ExpressionNode;

    return {
      type: 'Expression',
      name: 'While',
      condition,
      body,
    }
  }

  private Zero(): ZeroNode {
    this.eatToken('Zero');
    this.eatToken('(');

    const argument = this.eatNode('NumberExpression') as NumberExpressionNode;

    this.eatToken(')');

    return {
      type: 'Zero',
      argument,
    };
  }
}
