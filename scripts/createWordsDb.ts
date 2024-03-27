import { db } from '@/lib/db';
import { VALID_WORDS } from '@/lib/valid-words';

(async () => {
  const allWords = [...VALID_WORDS]
    .filter((word) => word[4] !== 's') // remove plural words hack
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
  // const sqlQuery = `
  //   INSERT INTO words (id, word)
  //   VALUES ${allWords.map((word) => `(${word.id}, '${word.word}')`).join(', ')}
  // `;

  // console.log(sqlQuery);

  // await db.execute(sqlQuery);

  const sqlResult = await db.execute(`SELECT * FROM words WHERE id = ${1}`);

  console.log(sqlResult);
})();
