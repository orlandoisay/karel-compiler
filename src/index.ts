const fs = require('fs');
const { Parser } = require('./Parser');

const program = 'define atsa() {      some(pred(pred(5)));  moveAllBeeper(); turnleft();  return; return sdf; } ';
// const program = ' {     }  ';

const parser = new Parser();
const result = parser.parse(program);

const formattedResult = JSON.stringify(result, null, 2);

fs.writeFile('result.json', formattedResult, (err: any) => console.log(err));

console.log(formattedResult);
