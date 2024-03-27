import { useRef } from 'react';
import { useLocalStorage } from './localStorage';

const USER_STATS_STORAGE_KEY = 'promptdle-user-stats';

export type UserStats = {
  played: number;
  wins: number;
  'win_%': number;
  current_streak: number;
  longest_streak: number;
  distribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
    6: number;
  };
};

const DEFAULT_STATS: UserStats = {
  played: 0,
  wins: 0,
  'win_%': 0,
  current_streak: 0,
  longest_streak: 0,
  distribution: {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
  },
};

export const useStats = () => {
  const { storedValue, setStoredValue, fetchFromLocal } =
    useLocalStorage<UserStats>(USER_STATS_STORAGE_KEY, DEFAULT_STATS);
  const stats = useRef(storedValue);

  const addPlayed = (data: {
    isWin: boolean;
    numGuesses: 1 | 2 | 3 | 4 | 5 | 6;
  }) => {
    const { isWin, numGuesses } = data;
    const userStats = fetchFromLocal();

    const played = userStats.played + 1;
    const wins = isWin ? userStats.wins + 1 : userStats.wins;
    const winPercentage = Math.round((wins / played) * 100);
    const currentStreak = isWin ? userStats.current_streak + 1 : 0;
    const longestStreak = Math.max(userStats.longest_streak, currentStreak);

    const distribution = (() => {
      if (!isWin) {
        return userStats.distribution;
      }

      return {
        ...userStats.distribution,
        [numGuesses]: userStats.distribution[numGuesses] + 1,
      };
    })();

    setStoredValue({
      played,
      wins,
      'win_%': winPercentage,
      current_streak: currentStreak,
      longest_streak: longestStreak,
      distribution,
    });

    stats.current = {
      played,
      wins,
      'win_%': winPercentage,
      current_streak: currentStreak,
      longest_streak: longestStreak,
      distribution,
    };
  };

  return {
    stats: storedValue,
    addPlayed,
  };
};
