import { BlockNode, BooleanAndExpressionNode, BooleanExpressionNode, BooleanTermNode, BooleanUnitNode, ConditionNode, EmptyNode, ExpressionNode, IdentifierNode, IfNode, InstructionNode, IterateNode, MethodCallNode, MethodNode, NodeType, NumberExpressionNode, NumberNode, NumberOperationNode, NumberOperatorType, Parser, ParserHelpers, ProgramNode, ReturnNode, Token, TokenType, WhileNode, ZeroNode } from "../types";
import { Tokenizer } from "../tokenizer";
import { ReturnParser } from "./return";
import { ZeroParser } from "./zero";
import { WhileParser } from "./while";
import { NumberOperationParser } from "./number-operation";
import { NumberExpressionParser } from "./number-expression";
import { NumberParser } from "./number";
import { MethodCallParser } from "./method-call";
import { MethodParser } from "./method";
import { IterateParser } from "./iterate";
import { InstructionParser } from "./instruction";
import { IfParser } from "./if";
import { IdentifierParser } from "./identifier";
import { EmptyParser } from "./empty";

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
  parsers: { [Type in (
    'Empty' | 'Identifier' | 'If' | 'Instruction' |
    'Iterate' | 'Method' | 'MethodCall' | 'Number' | 'NumberExpression' | 'NumberOperation' | 'Return' | 'While' | 'Zero')]: Parser };

  constructor() {
    this.tokenizer = new Tokenizer();
    this.lookAhead = null;

    const parserHelpers: ParserHelpers = {
      getLookAheadType: this.getLookAheadType.bind(this),
      eatNode: this.eatNode.bind(this),
      eatToken: this.eatToken.bind(this),
    }

    this.parsers = {
      'Empty': new EmptyParser(parserHelpers),
      'Identifier': new IdentifierParser(parserHelpers),
      'If': new IfParser(parserHelpers),
      'Instruction': new InstructionParser(parserHelpers),
      'Iterate': new IterateParser(parserHelpers),
      'Method': new MethodParser(parserHelpers),
      'MethodCall': new MethodCallParser(parserHelpers),
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
      case 'Empty': 
        return this.parsers['Empty'].parse();
      case 'Expression':
        return this.Expression();
      case 'Identifier':
        return this.parsers['Identifier'].parse();
      case 'If':
        return this.parsers['If'].parse();
      case 'Instruction':
        return this.parsers['Instruction'].parse();
      case 'Iterate':
        return this.parsers['Iterate'].parse();
      case 'Method':
        return this.parsers['Method'].parse();
      case 'MethodCall':
        return this.parsers['MethodCall'].parse();
      case 'Number':
        return this.parsers['Number'].parse();
      case 'NumberExpression':
        return this.parsers['NumberExpression'].parse();
      case 'NumberOperation':
        return this.parsers['NumberOperation'].parse();
      case 'Return':
        return this.parsers['Return'].parse();
      case 'While':
        return this.parsers['While'].parse();
      case 'Zero':
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
  
  private Expression(): ExpressionNode {
    switch (this.getLookAheadType()) {
      case ';':
        return this.eatNode('Empty') as EmptyNode;
      case 'Identifier':
        return this.eatNode('MethodCall') as MethodCallNode;
      case 'If':
        return this.eatNode('If') as IfNode;
      case 'InstructionIdentifier':
        return this.eatNode('Instruction') as InstructionNode;
      case 'Iterate':
        return this.eatNode('Iterate') as IterateNode;
      case 'Return':
        return this.eatNode('Return') as ReturnNode;
      case 'While':
        return this.eatNode('While') as WhileNode;
      default:
        throw new SyntaxError(`Literal: Unexpected literal production`);
    }
  }
}
