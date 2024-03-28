import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import dayjs from 'dayjs';
import { ChatCompletionMessageParam } from 'openai/resources/index.mjs';
import { GuessResponse } from '@/lib/guess.types';
import { db } from '@/lib/db';

const STARTING_DAY = dayjs('2024-01-01');
const TOTAL_WORD_COUNT = 1770;

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY');
}

// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Set the runtime to edge for best performance
export const runtime = 'edge';

const PROMPTDLE_FALLBACK_WORD = 'shade';

export async function POST(req: Request) {
  try {
    const { messages } = (await req.json()) as {
      messages: ChatCompletionMessageParam[];
    };

    const { userGuess, userGuessMessage } = (() => {
      const userMessages = messages.filter((m: any) => m.role === 'user');
      if (userMessages.length === 0) {
        throw new Error('No user messages found');
      }

      const lastMessage = userMessages[userMessages.length - 1];

      if (lastMessage.role !== 'user') {
        throw new Error('Last message is not user');
      }
      const rawWord = lastMessage.content as string;

      if (!rawWord || rawWord.split(' ').length > 1 || rawWord.length !== 5) {
        throw new Error(
          'Invalid guess! Guess should be in format of one word with 5 letters'
        );
      }

      return {
        userGuess: rawWord.toLowerCase(),
        userGuessMessage: `My guess for round ${
          userMessages.length + 1
        } is "${rawWord}"`,
      };
    })();

    const dailyWord = await (async () => {
      try {
        // get the current day index (utc based)
        const currentDayIndex =
          dayjs().diff(STARTING_DAY, 'days') % TOTAL_WORD_COUNT;

        const sqlResult = await db.execute(
          `SELECT * FROM words WHERE id = ${currentDayIndex}`
        );
        const row = sqlResult.rows[0] as {
          id: number;
          word: string;
          length: number;
        };

        return row.word.toLowerCase();
      } catch {
        return PROMPTDLE_FALLBACK_WORD;
      }
    })();

    if (userGuess === dailyWord) {
      const correctGuessResponse: GuessResponse = {
        variant: 'win',
        shouldToast: true,
        numGuesses: messages.filter((m) => m.role === 'user').length,
        message: 'Congrats! You have guessed the word correctly!',
      };

      return new Response(JSON.stringify(correctGuessResponse), {
        status: 200,
      });
    }

    // check if user used all 6 guesses
    if (messages.filter((m) => m.role === 'user').length >= 6) {
      const loseResponse: GuessResponse = {
        variant: 'lose',
        shouldToast: true,
        message: `You ran out of guesses! The word was "${dailyWord}"`,
        wordToGuess: dailyWord,
      };

      return new Response(JSON.stringify(loseResponse), { status: 200 });
    }

    const systemMessages: ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content: `You are an all-knowing oracle that is guarding the secret 5-letter word that is "${dailyWord}". 
        You give extremely difficult riddles that are about this word, but never explicitly mention the word. 
        There are 5 rounds of riddles each getting easier as the rounds progress. All the riddles are for the same secret word. 
        Each round there is a guess, and you try to make each subsequent riddle include the guess. When prompted with a guess for a certain round, 
        you should only return the riddle for the next round. This riddle needs to incorporate the previous round's guess into the next round's riddle. 
        You are deducted points every time a riddle does not mention the previous round's guess. You are also deducted points for each riddle that is too easy.`,
      },
    ];

    // add system message and replace last user message with user guess message
    const parsedMessages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] =
      [
        ...systemMessages,
        ...messages.slice(0, messages.length - 1),
        {
          role: 'user',
          content: userGuessMessage,
        },
      ];

    // Ask OpenAI for a streaming chat completion given the prompt
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      stream: true,
      messages: parsedMessages,
    });

    // Convert the response into a friendly text-stream
    const stream = OpenAIStream(response);

    // Respond with the stream
    return new StreamingTextResponse(stream);
  } catch (error: any) {
    return new Response(error?.message ?? 'Error', { status: 500 });
  }
}
