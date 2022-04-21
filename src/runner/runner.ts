import { BlockNode, ExpressionNode, InstructionIdentifierKeywordValue, InstructionNode, IterateNode, MethodCallNode, MethodNode, NumberExpressionNode, ProgramNode, WorldDescription } from '../types';
import { NumberExpressionResolver } from './number-expression';
import { ScopeStack } from './stack';
import { World } from './world';

export class Runner {
  ast: ProgramNode;
  world: World;

  stack: ScopeStack;

  constructor(ast: ProgramNode, worldDesc: WorldDescription) {
    this.ast = ast;
    this.world = new World(worldDesc);

    this.stack = new ScopeStack();
    this.stack.push({
      identifier: null,
      value: 0,
    });
  }

  private printState() {
    console.log('= STATE =========');
    console.log(JSON.stringify(this.world.getCurrentState(), null, 2));
    console.log('=================');
    console.log();
  }

  private getMethod(name: string): MethodNode {
    const method: MethodNode | undefined = this.ast.methods.find(m => m.name.value === name);

    if (!method) {
      throw Error(`Method "${name}" doesn't exists.`);
    }

    return method;
  }

  public run() {
    this.runProgram();
  }

  private runProgram() {
    this.runStatementList(this.ast.program);
  }

  private runStatementList(list: BlockNode) {
    list.expressions.forEach(statement => {
      this.runStatement(statement);
    });
  }

  private runStatement(statement: ExpressionNode) {
    switch (statement.name) {
    case 'Empty': {
      break;
    }
    case 'Instruction': {
      this.runInstruction(statement as InstructionNode);
      break;
    }
    case 'Iterate': {
      this.runIterate(statement as IterateNode);
      break;
    }
    case 'MethodCall': {
      this.runMethodCall(statement as MethodCallNode);
      break;
    }
    default: {
      throw Error(`Statement handling not defined (${statement.name}).`);
    }
    }
  }

  private runInstruction(instruction: InstructionNode) {
    switch (instruction.instruction as InstructionIdentifierKeywordValue) {
    case 'pickbeeper': {
      this.runPickBeeper();
      break;
    }
    case 'putbeeper': {
      this.runPutBeeper();
      break;
    }
    case 'turnleft': {
      this.runTurnLeft();
      break;
    }
    default: {
      throw Error('Instruction handling not defined.');
    }
    }

    this.printState();
  }

  private runPickBeeper() {
    this.world.pickBeeper();
  }

  private runPutBeeper() {
    this.world.putBeeper();
  }

  private runTurnLeft() {
    this.world.turnleft();
  }

  private runIterate(node: IterateNode) {
    const argument = this.evalNumberExpression(node.argument);

    console.log(`====== > ITERATE (${argument}) < ===`);
    
    for (let i = 0; i < argument; i++) {
      if (node.body.type === 'Expression') {
        this.runStatement(node.body);
      } 
      else {
        this.runStatementList(node.body);
      }
    }
    
    console.log('====== > ITERATE END < ===========');
  }

  private runMethodCall(node: MethodCallNode) {
    const methodCalled: MethodNode  = this.getMethod(node.method);
    
    if (methodCalled.param !== null && node.argument === null) {
      throw Error(`Method "${methodCalled.name}" requires an argument "${methodCalled.param.value}".`);
    }

    if (methodCalled.param === null && node.argument !== null) {
      throw Error(`Method "${methodCalled.name}" requires 0 arguments, but has 1.`);
    }

    if (methodCalled.param === null && node.argument === null) {
      this.stack.push({
        identifier: null,
        value: 0,
      });
    }
    
    if (methodCalled.param !== null && node.argument !== null) {
      const value = this.evalNumberExpression(node.argument); 

      this.stack.push({
        identifier: methodCalled.param.value,
        value,
      });
    }

    this.runStatementList(methodCalled.body);

    this.stack.pop();
  }

  private evalNumberExpression(expression: NumberExpressionNode) {
    const resolver = new NumberExpressionResolver(this.stack.top(), expression);
    
    return resolver.resolve();
  }


}