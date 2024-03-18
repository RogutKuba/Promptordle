import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import dayjs from 'dayjs';
import { ChatCompletionMessageParam } from 'openai/resources/index.mjs';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY');
}

// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Set the runtime to edge for best performance
export const runtime = 'edge';

const PROMPTDLE_DAILY_WORDS: { [key: string]: string } = {
  '2024-03-13': 'great',
  '2024-03-14': 'china',
  '2024-03-15': 'plane',
};

export async function POST(req: Request) {
  try {
    const { messages } = (await req.json()) as {
      messages: ChatCompletionMessageParam[];
    };

    const todayDate = dayjs().format('YYYY-MM-DD');

    console.log('Today is', todayDate);

    const userGuess = (() => {
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

      return `My guess for round ${userMessages.length + 1} is "${rawWord}"`;
    })();

    const dailyWord = (() => {
      console.log('PROMPTDLE_DAILY_WORDS', PROMPTDLE_DAILY_WORDS[todayDate]);

      if (!PROMPTDLE_DAILY_WORDS[todayDate]) {
        return 'tests';
        // throw new Error('No daily word found');
      }
      return PROMPTDLE_DAILY_WORDS[todayDate];
    })();

    if (userGuess === dailyWord) {
      return new Response(process.env.GUESS_SUCCESS_STRING!, { status: 200 });
    }

    console.log('Daily word is', dailyWord, messages);

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

    // Ask OpenAI for a streaming chat completion given the prompt
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      stream: true,
      messages: [...systemMessages, ...messages],
    });

    // Convert the response into a friendly text-stream
    const stream = OpenAIStream(response);

    // Respond with the stream
    return new StreamingTextResponse(stream);
  } catch (error: any) {
    return new Response(error?.message ?? 'Error', { status: 500 });
  }
}
