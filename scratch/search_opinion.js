import fs from 'fs';

const content = fs.readFileSync('C:\\Users\\gorillatech\\Music\\TodayTripura\\.agents\\reconstructed_heroboard.txt', 'utf8');
const lines = content.split('\n');

lines.forEach((line, index) => {
  if (line.toLowerCase().includes('opinion')) {
    console.log(`Line ${index + 1}: ${line}`);
  }
});
