const fs = require('fs');
const { Parser } = require('./Parser');
const { Runner } = require('./runner');

const world = {
  state: {
    location: {
      x: 0, y: 10,
    },
    orientation: 'North',
    beepers: 5,
  },
  heaps: [],
  walls: [],
};

const program = 
`
  

  class program {

    define turnright(n) {
      iterate(n) turnleft();
    }

    program() {
      turnright(5);
    }
  }
`;

// const program = 
// `
//   class program {
//     define moveN(n) {
//       iterate(n) move();
//     }

//     define turnright() {
//       iterate(3) {
//         turnleft();
//       }
//     }

//     define atsa() {
//       some(pred(pred(5))); 
//       moveAllBeeper();
//       turnleft();
//       return;
//       return sdf; 
//       iterate(20) { turnleft(); } 

//       while(frontIsClear && !leftIsClear || iszero(n)) { 
//         move(); ; 
//       }

//       ;
//       ;
//     }

//     program() {
//       if(anyBeepersInBeeperBag) {
//         move();
//       } else if(!facingWest) {
//         turnright();
//       } else 
//         pickbeeper();

//       turnoff();
//     }
//   } 
// `;

const parser = new Parser();
const result = parser.parse(program);

// const runner = new Runner(result, world);
// runner.run();


const formattedResult = JSON.stringify(result, null, 2);

fs.writeFile('result.json', formattedResult, (err: any) => ({}));

console.log(formattedResult);
