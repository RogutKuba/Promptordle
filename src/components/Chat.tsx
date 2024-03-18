'use client';
import { useChat } from 'ai/react';
import { GuessInput } from './GuessInput';
import { useMemo, useState } from 'react';
import { Riddles } from './Riddles';

export const Chat = () => {
  const [success, setSuccess] = useState(false);

  const { messages, input, handleInputChange, append, isLoading, error } =
    useChat({
      onFinish(message) {
        if (message.content === process.env.GUESS_SUCCESS_STRING!) {
          setSuccess(true);
        }

        console.log('onFinish', message);
      },
    });

  const pastGuesses = useMemo(() => {
    return messages.filter((m) => m.role === 'user').map((m) => m.content);
  }, [messages]);

  const riddles = useMemo(() => {
    return messages.filter((m) => m.role === 'assistant').map((m) => m.content);
  }, [messages]);

  return (
    <div className='flex flex-col'>
      {error ? <div className='text-red-500'>{error.message}</div> : null}

      <Riddles riddles={riddles} />

      <GuessInput
        pastGuesses={pastGuesses}
        onHandleSubmit={(guess) => {
          console.log('guess submitted', guess);
          append({
            content: guess,
            role: 'user',
          });
        }}
      />
    </div>
  );
};
