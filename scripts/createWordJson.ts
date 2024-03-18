import fs from 'fs';

(async () => {
  const words = fs.readFileSync('scripts/words.txt', 'utf-8').split('\n');

  const jsonStr = JSON.stringify(words, null, 2);

  fs.writeFileSync('scripts/words.json', jsonStr);
})();
