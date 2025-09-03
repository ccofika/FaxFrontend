const fs = require('fs');
const content = fs.readFileSync('FacultyModal.tsx', 'utf8');
const lines = content.split('\n');

let openBraces = [];
let errors = [];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const lineNum = i + 1;
  
  // Only check specific problematic lines
  if (lineNum >= 1850 && lineNum <= 2125) {
    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      if (char === '{') {
        openBraces.push({char, line: lineNum, col: j});
      } else if (char === '}') {
        if (openBraces.length === 0) {
          errors.push(`Line ${lineNum}: Unmatched closing brace`);
        } else {
          openBraces.pop();
        }
      }
    }
  }
}

console.log('Remaining open braces:', openBraces.length);
console.log('Errors:', errors);
