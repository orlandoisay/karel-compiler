import { NodeType, NodeParser, ParserHelpers, Token, TokenType } from "../types";
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
import { ExpressionParser } from "./expression";
import { ConditionParser } from "./condition";
import { BooleanUnitParser } from "./boolean-unit";
import { BooleanTermParser } from "./boolean-term";
import { BooleanExpressionParser } from "./boolean-expression";
import { BooleanAndExpressionParser } from "./boolean-and-expression";
import { BlockParser } from "./block";
import { ProgramParser } from "./program";

export class Parser {
  tokenizer: Tokenizer;
  lookAhead: Token | null;  
  parsers: { [Type in NodeType]: NodeParser };

  constructor() {
    this.tokenizer = new Tokenizer();
    this.lookAhead = null;

    const parserHelpers: ParserHelpers = {
      getLookAheadType: this.getLookAheadType.bind(this),
      eatNode: this.eatNode.bind(this),
      eatToken: this.eatToken.bind(this),
    }

    this.parsers = {
      'Block': new BlockParser(parserHelpers),
      'BooleanAndExpression': new BooleanAndExpressionParser(parserHelpers),
      'BooleanExpression': new BooleanExpressionParser(parserHelpers),
      'BooleanTerm': new BooleanTermParser(parserHelpers),
      'BooleanUnit': new BooleanUnitParser(parserHelpers),
      'Condition': new ConditionParser(parserHelpers),
      'Empty': new EmptyParser(parserHelpers),
      'Expression': new ExpressionParser(parserHelpers),
      'Identifier': new IdentifierParser(parserHelpers),
      'If': new IfParser(parserHelpers),
      'Instruction': new InstructionParser(parserHelpers),
      'Iterate': new IterateParser(parserHelpers),
      'Method': new MethodParser(parserHelpers),
      'MethodCall': new MethodCallParser(parserHelpers),
      'Number': new NumberParser(parserHelpers),
      'NumberExpression': new NumberExpressionParser(parserHelpers),
      'NumberOperation': new NumberOperationParser(parserHelpers),
      'Program': new ProgramParser(parserHelpers),
      'Return': new ReturnParser(parserHelpers),
      'While': new WhileParser(parserHelpers),
      'Zero': new ZeroParser(parserHelpers),
    };
  }

  public parse(program: string) {
    this.tokenizer.init(program);
    this.lookAhead = this.tokenizer.getNextToken();

    return this.eatNode('Program');
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
    return this.parsers[nodeType].parse();
  }
}
