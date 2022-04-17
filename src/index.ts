const fs = require('fs');
const { Parser } = require('./Parser');

const program = 
`
  class program {
    define atsa() {
      some(pred(pred(5))); 
      moveAllBeeper();
      turnleft();
      return;
      return sdf; 
      iterate(20) { turnleft(); } 

      while(frontIsClear && !leftIsClear || iszero(n)) { 
        move(); ; 
      }

      ;
      ;
    }
  } 
`;
// const program = ' {     }  ';

const parser = new Parser();
const result = parser.parse(program);

const formattedResult = JSON.stringify(result, null, 2);

fs.writeFile('result.json', formattedResult, (err: any) => console.log(err));

console.log(formattedResult);
