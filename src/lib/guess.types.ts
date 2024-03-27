export interface GuessResponse {
  shouldToast: boolean;
  message: string;
  variant: 'win' | 'lose' | 'invalid' | 'error';
  wordToGuess?: string;
  numGuesses?: number;
}
