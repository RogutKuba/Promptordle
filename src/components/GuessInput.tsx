'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { InputOTP, InputOTPGroup, InputOTPSlot } from './ui/input-otp';
import { REGEXP_ONLY_CHARS } from 'input-otp';
import { VALID_WORDS } from '@/lib/valid-words';

interface Props {
  isWinner: boolean;
  pastGuesses: string[];
  onHandleSubmit: (guess: string) => boolean;
}

export const GuessInput = ({
  isWinner,
  pastGuesses,
  onHandleSubmit,
}: Props) => {
  const [guess, _setGuess] = useState<string>('');
  const [isValid, setIsValid] = useState<boolean>(true);
  const guessRef = useRef<string>(guess);
  const isValidRef = useRef<boolean>(isValid);
  const loadedRef = useRef<boolean>(false);

  const setGuess = (val: string) => {
    guessRef.current = val;
    _setGuess(val);

    if (val.length === 5) {
      const newIsValid = VALID_WORDS.has(val.toLowerCase());
      setIsValid(newIsValid);
      isValidRef.current = newIsValid;
    } else {
      setIsValid(true);
      isValidRef.current = true;
    }
  };

  const remainingGuesses = useMemo(() => {
    return Math.max(6 - pastGuesses.length - 1, 0);
  }, [pastGuesses]);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyUp = (key: string, guess: string) => {
    const wordIsComplete = guess.length === 5;
    const enterKeyPressed = key === 'Enter';

    if (wordIsComplete && enterKeyPressed) {
      if (!guess.length || !isValid) {
        return;
      }
      const shouldClear = onHandleSubmit(guess.toLowerCase());
      if (shouldClear) {
        setGuess('');
      }
    }
  };

  useEffect(() => {
    if (loadedRef.current) {
      return;
    }

    loadedRef.current = true;
    inputRef.current?.addEventListener('keyup', (e) =>
      handleKeyUp(e.key, guessRef.current)
    );
    return () => {
      inputRef.current?.removeEventListener('keyup', (e) =>
        handleKeyUp(e.key, guessRef.current)
      );
    };
  }, [handleKeyUp]);

  return (
    <div className='flex flex-col items-center gap-1'>
      {pastGuesses.map((g, guessIndex) => (
        <InputOTP
          key={`${g}-${guessIndex}`}
          maxLength={5}
          pattern={REGEXP_ONLY_CHARS}
          value={g.toUpperCase()}
          render={({ slots }) => (
            <InputOTPGroup className='gap-1'>
              {slots.map((slot, index) => (
                <InputOTPSlot
                  className={`font-semibold text-3xl h-16 w-16 bg-gray-600 text-white transition-colors
                    ${
                      isWinner && guessIndex === pastGuesses.length - 1
                        ? 'text-white bg-green-500'
                        : ''
                    }
                  `}
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

      {pastGuesses.length < 6 && !isWinner ? (
        <InputOTP
          ref={inputRef}
          autoFocus
          maxLength={5}
          pattern={REGEXP_ONLY_CHARS}
          value={!isWinner ? guess : ''}
          onChange={(val) => (!isWinner ? setGuess(val.toUpperCase()) : {})}
          render={({ slots }) => (
            <>
              <InputOTPGroup className='gap-1'>
                {slots.map((slot, index) => (
                  <InputOTPSlot
                    {...slot}
                    key={index}
                    inputMode='text'
                    className={`font-semibold text-3xl h-16 w-16 ${
                      isValid
                        ? 'text-black'
                        : 'text-red-500 border-red-500 ring-red-500'
                    }`}
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
