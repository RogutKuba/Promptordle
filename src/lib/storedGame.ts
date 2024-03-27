import { Message } from 'ai/react';
import dayjs from 'dayjs';
import { useEffect, useRef, useState } from 'react';

export type GameState = {
  messages: Message[];
  hasWon: boolean;
  currentDate: string;
};

const GAME_KEY = 'stored-promptdle-game';

// doesnt need to be hook, just function to load the stored game
export const useStoredGame = () => {
  const storedGame = useRef<GameState>({
    messages: [],
    hasWon: false,
    currentDate: dayjs().format('YYYY-MM-DD'),
  });

  useEffect(() => {
    const rawStoredValue = localStorage.getItem(GAME_KEY);
    if (rawStoredValue) {
      storedGame.current = JSON.parse(rawStoredValue) as GameState;
    }
    // console.log('storedValue', storedValue);
    // read from local storage
  }, []);

  const storeGameState = (messages: Message[], hasWon: boolean) => {
    localStorage.setItem(
      GAME_KEY,
      JSON.stringify({
        messages,
        hasWon,
        currentDate: dayjs().format('YYYY-MM-DD'),
      })
    );
  };

  return {
    storedGame: storedGame.current,
    storeGameState,
    // setStoredGame: (game: GameState) => setStoredValue(game),
  };
};
