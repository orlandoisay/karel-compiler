import { BlockNode, BooleanAndExpressionNode, BooleanExpressionNode, BooleanTermNode, BooleanUnitNode, ConditionNode, EmptyNode, ExpressionNode, IdentifierNode, IfNode, InstructionNode, IterateNode, MethodCallNode, MethodNode, NodeType, NumberExpressionNode, NumberNode, NumberOperationNode, NumberOperatorType, Parser, ParserHelpers, ProgramNode, ReturnNode, Token, TokenType, WhileNode, ZeroNode } from "../types";
import { Tokenizer } from "../tokenizer";
import { ReturnParser } from "./return";
import { ZeroParser } from "./zero";
import { WhileParser } from "./while";
import { NumberOperationParser } from "./number-operation";
import { NumberExpressionParser } from "./number-expression";
import { NumberParser } from "./number";

const ExpressionStartingTokens: TokenType[] = [
  ';',
  'Identifier',
  'If',
  'InstructionIdentifier',
  'Iterate',
  'Return',
  'While',
];

export class ProgramParser {
  tokenizer: Tokenizer;
  lookAhead: Token | null;  
  parsers: { [Type in ('Number' | 'NumberExpression' | 'NumberOperation' | 'Return' | 'While' | 'Zero')]: Parser };

  constructor() {
    this.tokenizer = new Tokenizer();
    this.lookAhead = null;

    const parserHelpers: ParserHelpers = {
      getLookAheadType: this.getLookAheadType.bind(this),
      eatNode: this.eatNode.bind(this),
      eatToken: this.eatToken.bind(this),
    }

    this.parsers = {
      'Number': new NumberParser(parserHelpers),
      'NumberExpression': new NumberExpressionParser(parserHelpers),
      'NumberOperation': new NumberOperationParser(parserHelpers),
      'Return': new ReturnParser(parserHelpers),
      'While': new WhileParser(parserHelpers),
      'Zero': new ZeroParser(parserHelpers),
    };
  }

  public parse(program: string) {
    this.tokenizer.init(program);
    this.lookAhead = this.tokenizer.getNextToken();

    return this.Program();
  }

  public getLookAheadType(): TokenType {
    const token = this.lookAhead;

    if (token == null) {
      throw new SyntaxError('Unexpected EOF');
    }

    return token.type;
  }

  public eatToken(tokenType: TokenType) {
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

  public eatNode(nodeType: NodeType) {
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
      case 'If':
        return this.If();
      case 'Instruction':
        return this.Instruction();
      case 'Method':
        return this.Method();
      case 'MethodCall':
        return this.MethodCall();
      case 'Number':
        // return this.Number();
        return this.parsers['Number'].parse();
      case 'NumberExpression':
        // return this.NumberExpression();
        return this.parsers['NumberExpression'].parse();
      case 'NumberOperation':
        // return this.NumberOperation();
        return this.parsers['NumberOperation'].parse();
      case 'Return':
        // return this.Return();
        return this.parsers['Return'].parse();
      case 'While':
        // return this.While();
        return this.parsers['While'].parse();
      case 'Zero':
        // return this.Zero();
        return this.parsers['Zero'].parse();
    }
  }

  private Program(): ProgramNode {
    this.eatToken('Class');
    this.eatToken('Program');
    this.eatToken('{');

    const methods: MethodNode[] = [];

    while (this.getLookAheadType() !== 'Program') {
      const method = this.eatNode('Method') as MethodNode;
      methods.push(method);
    }

    this.eatToken('Program');
    this.eatToken('(');
    this.eatToken(')');

    const program = this.eatNode('Block') as BlockNode;

    this.eatToken('}');

    return {
      type: 'Program',
      methods,
      program,
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
    let value: ZeroNode | ConditionNode | BooleanExpressionNode;

    switch (this.getLookAheadType()) {
      case 'Zero': {
        value = this.eatNode('Zero') as ZeroNode;
        break;
      }
      case 'Condition': {
        value = this.eatNode('Condition') as ConditionNode;
        break;
      }
      case '(': {
        this.eatToken('(');
        value = this.eatNode('BooleanExpression') as BooleanExpressionNode;
        this.eatToken(')');
      }
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
      case 'If':
        return this.If();
      case 'InstructionIdentifier':
        return this.Instruction();
      case 'Iterate':
        return this.Iterate();
      case 'Return':
        return this.eatNode('Return') as ReturnNode; //this.Return();
      case 'While':
        return this.eatNode('While') as WhileNode; //return this.While();
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

  private If(): IfNode {
    this.eatToken('If');
    this.eatToken('(');

    const condition = this.eatNode('BooleanExpression') as BooleanExpressionNode;

    this.eatToken(')');

    const ifBody: BlockNode | ExpressionNode = this.getLookAheadType() === '{'
      ? this.eatNode('Block') as BlockNode
      : this.eatNode('Expression') as ExpressionNode;

    let elseBody: BlockNode | ExpressionNode | null = null;
    
    if (this.getLookAheadType() === 'Else') {
      this.eatToken('Else');

      elseBody = this.getLookAheadType() === '{'
        ? this.eatNode('Block') as BlockNode
        : this.eatNode('Expression') as ExpressionNode;
    }

    return {
      type: 'Expression',
      name: 'If',
      condition,
      ifBody,
      elseBody,
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
}
