'use client';
import { useChat } from 'ai/react';
import { GuessInput } from './GuessInput';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Riddles } from './Riddles';
import { Message } from 'ai';
import { VALID_WORDS } from '@/lib/valid-words';
import { GuessResponse } from '@/lib/guess.types';
import { toast } from 'sonner';
import { EndDialog } from './EndDialog';
import { UserStats, useStats } from '@/lib/stats.api';
import { useStoredGame } from '@/lib/storedGame';
import dayjs from 'dayjs';

const Chat = () => {
  const { storedGame, storeGameState } = useStoredGame();
  const [guessRes, setGuessRes] = useState<GuessResponse | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const { stats, addPlayed } = useStats();
  const riddelListRef = useRef<HTMLDivElement>(null);

  const onFinishHandler = (message: Message, _stats: UserStats) => {
    // edge cases:
    // 1. if the message is a success message, set the success state to true
    // 2. if the message is not success and total guesses are 6, set the success state to false

    try {
      riddelListRef.current?.lastElementChild?.scrollIntoView({
        behavior: 'smooth',
      });

      const guessRes = JSON.parse(message.content) as GuessResponse;
      toast(guessRes.message);
      setGuessRes(guessRes);

      addPlayed({
        numGuesses: (guessRes.numGuesses ?? 1) as any,
        isWin: guessRes.variant === 'win',
      });

      if (guessRes.variant === 'win' || guessRes.variant === 'lose') {
        setTimeout(() => {
          setOpen(true);
        }, 1000);
      }
    } catch (e) {
      // console.log('error parsing message', e);
    }
  };

  const onSubmitHandler = (guess: string): boolean => {
    // cases:
    // 1. if the guess is a valid guess, append the guess to the chat
    // 2. if the guess is an invalid guess, toast and dont accept the guess

    if (!VALID_WORDS.has(guess.toLowerCase())) {
      toast('Invalid guess! Guess is not in word list');
      return false;
    }

    append({
      content: guess,
      role: 'user',
    });
    return true;
  };

  const { messages, append, error } = useChat({
    onFinish: (message) => onFinishHandler(message, stats),
    initialMessages: storedGame.messages,
  });

  useEffect(() => {
    const currentDate = dayjs().format('YYYY-MM-DD');

    if (messages.length > 0 && currentDate >= storedGame.currentDate) {
      storeGameState(messages, guessRes?.variant === 'win');
    }
  }, [messages, guessRes, storeGameState, storedGame.currentDate]);

  const pastGuesses = useMemo(() => {
    return messages
      .filter((m) => {
        try {
          JSON.parse(m.content) as GuessResponse;
          return false;
        } catch (e) {
          return m.role === 'user';
        }
      })
      .map((m) => m.content);
  }, [messages]);

  const riddles = useMemo(() => {
    return messages
      .filter((m) => {
        try {
          JSON.parse(m.content) as GuessResponse;
          return false;
        } catch (e) {
          return m.role === 'assistant';
        }
      })
      .map((m) => m.content);
  }, [messages]);

  return (
    <div className='flex flex-col'>
      {error ? <div className='text-red-500'>{error.message}</div> : null}
      <Riddles riddles={riddles} listRef={riddelListRef} />
      <GuessInput
        isWinner={guessRes?.variant === 'win' || storedGame.hasWon}
        pastGuesses={pastGuesses}
        onHandleSubmit={onSubmitHandler}
      />
      <EndDialog open={open} onOpenChange={setOpen} guessResponse={guessRes} />
    </div>
  );
};

Chat.whyDidYouRender = true;

export { Chat };
