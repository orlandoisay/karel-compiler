import { BlockNode, ExpressionNode, InstructionNode, IterateNode, NumberExpressionNode, ProgramNode, WorldDescription } from "../types";
import { NumberExpressionResolver } from "./number-expression";
import { ScopeStack } from "./stack";
import { World } from "./world";

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


  private end() {

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
      case 'Instruction': {
        this.runInstruction(statement as InstructionNode);
        break;
      }
      case 'Iterate': {
        this.runIterate(statement as IterateNode);
        break;
      }
      default: {
        throw Error('Statement handling not defined.')
      }
    }
  }

  private runInstruction(instruction: InstructionNode) {
    switch (instruction.instruction) {
      case 'putbeeper': {
        this.runPutBeeper();
        break;
      }
      case 'turnleft': {
        this.runTurnLeft();
        break;
      }
      default: {
        throw Error('Instruction handling not defined.')
      }
    }
  }

  private runPutBeeper() {
    this.world.putBeeper();

    this.printState();
  }

  private runTurnLeft() {
    this.world.turnleft();

    this.printState();
  }

  private runIterate(node: IterateNode) {
    const amount = this.evalNumberExpression(node.argument);

    console.log(`====== > ITERATE (${amount}) < ===`);
    
    for (let i = 0; i < amount; i++) {
      if (node.body.type === 'Expression') {
        this.runStatement(node.body);
      } 
      else {
        this.runStatementList(node.body)
      }
    }
    
    console.log('====== > ITERATE END < ===========')
  }

  private evalNumberExpression(expression: NumberExpressionNode) {
    const resolver = new NumberExpressionResolver(this.stack.top(), expression);
    
    return resolver.resolve();
  }


}