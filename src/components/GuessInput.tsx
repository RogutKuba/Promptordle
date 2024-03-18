'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { InputOTP, InputOTPGroup, InputOTPSlot } from './ui/input-otp';
import { REGEXP_ONLY_CHARS } from 'input-otp';

interface Props {
  pastGuesses: string[];
  onHandleSubmit: (guess: string) => void;
}

export const GuessInput = ({ pastGuesses, onHandleSubmit }: Props) => {
  const [guess, _setGuess] = useState<string>('');
  const guessRef = useRef<string>(guess);

  const setGuess = (val: string) => {
    guessRef.current = val;
    _setGuess(val);
  };

  const remainingGuesses = useMemo(() => {
    return Math.max(6 - pastGuesses.length - 1, 0);
  }, [pastGuesses]);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.addEventListener('keyup', (e) =>
      handleKeyUp(e.key, guessRef.current)
    );
    return () => {
      inputRef.current?.removeEventListener('keyup', (e) =>
        handleKeyUp(e.key, guessRef.current)
      );
    };
  }, []);

  const handleKeyUp = (key: string, guess: string) => {
    const wordIsComplete = guess.length === 5;
    const enterKeyPressed = key === 'Enter';

    if (wordIsComplete && enterKeyPressed) {
      console.log('Enter pressed', guess);
      onHandleSubmit(guess);
      setGuess('');
    }
  };

  return (
    <div className='flex flex-col items-center gap-1'>
      {pastGuesses.map((g, index) => (
        <InputOTP
          key={`${g}-${index}`}
          maxLength={5}
          pattern={REGEXP_ONLY_CHARS}
          value={g.toUpperCase()}
          render={({ slots }) => (
            <InputOTPGroup className='gap-1'>
              {slots.map((slot, index) => (
                <InputOTPSlot
                  className='font-semibold text-3xl h-16 w-16 bg-gray-600 text-white'
                  key={index}
                  {...slot}
                  isActive={false}
                  hasFakeCaret={false}
                />
              ))}
            </InputOTPGroup>
          )}
        />
      ))}

      {pastGuesses.length < 6 ? (
        <InputOTP
          ref={inputRef}
          autoFocus
          maxLength={5}
          pattern={REGEXP_ONLY_CHARS}
          value={guess}
          onChange={(val) => setGuess(val.toUpperCase())}
          render={({ slots }) => (
            <>
              <InputOTPGroup className='gap-1'>
                {slots.map((slot, index) => (
                  <InputOTPSlot
                    {...slot}
                    key={index}
                    className='font-semibold text-3xl h-16 w-16'
                    hasFakeCaret={false}
                  />
                ))}
              </InputOTPGroup>
            </>
          )}
        />
      ) : null}

      {new Array(remainingGuesses).fill('').map((_, index) => (
        <InputOTP
          key={index}
          value=''
          maxLength={5}
          pattern={REGEXP_ONLY_CHARS}
          render={({ slots }) => (
            <>
              <InputOTPGroup className='gap-1'>
                {slots.map((slot, index) => (
                  <InputOTPSlot
                    className='font-semibold text-3xl h-16 w-16 bg-gray-300 text-white'
                    key={index}
                    {...slot}
                    isActive={false}
                    hasFakeCaret={false}
                  />
                ))}
              </InputOTPGroup>
            </>
          )}
        />
      ))}
    </div>
  );
};
