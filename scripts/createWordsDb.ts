import { db } from '@/lib/db';
import { DB_WORDS } from './words-for-db';

(async () => {
  // clear words table
  await db.execute('DELETE FROM words');
  console.log('words table cleared');

  const allWords = [...DB_WORDS]
    .map((word) => {
      return {
        word,
        randomNum: Math.random(),
      };
    })
    .sort((a, b) => a.randomNum - b.randomNum)
    .map((a, i) => {
      return {
        word: a.word,
        id: i,
      };
    });

  console.log(allWords.slice(0, 10), allWords.length);

  // insert into words table
  const sqlQuery = `
    INSERT INTO words (id, word)
    VALUES ${allWords.map((word) => `(${word.id}, '${word.word}')`).join(', ')}
  `;

  await db.execute(sqlQuery);

  const sqlResult = await db.execute(`SELECT * FROM words WHERE id = ${1}`);

  console.log(sqlResult);
})();
