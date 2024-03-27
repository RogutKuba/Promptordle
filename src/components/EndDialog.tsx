import { GuessResponse } from '@/lib/guess.types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { StatsView } from './StatsView';
import { Button } from './ui/button';
import { Share1Icon } from '@radix-ui/react-icons';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  guessResponse: GuessResponse | null;
}

export const EndDialog = ({ open, onOpenChange, guessResponse }: Props) => {
  const variant = guessResponse?.variant;

  return (
    <Dialog open={open} defaultOpen={false} onOpenChange={onOpenChange}>
      <DialogContent className=''>
        {variant === 'win' ? (
          <WinHeader />
        ) : variant === 'lose' ? (
          <LoseHeader wordToGuess={guessResponse?.wordToGuess ?? 'XXXXX'} />
        ) : null}
        <div className='flex flex-col items-center space-y-8'>
          <StatsView numToHighlight={guessResponse?.numGuesses} />

          <ShareButton />
        </div>
        <DialogFooter>
          <div className='w-full flex justify-center'>
            <a href='https://twitter.com/rogutkuba' target='_blank'>
              <div className='text-sm text-muted-foreground'>
                Created by @rogutkuba
              </div>
            </a>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const WinHeader = () => {
  return (
    <DialogHeader>
      <DialogTitle>Congratulations!</DialogTitle>
      <DialogDescription>
        You have successfully guessed the word!
      </DialogDescription>
    </DialogHeader>
  );
};

const LoseHeader = ({ wordToGuess }: { wordToGuess: string }) => {
  return (
    <DialogHeader>
      <DialogTitle>Ooops!</DialogTitle>
      <div className='flex text-sm text-muted-foreground'>
        <div>You ran out of guesses! The word was</div>
        <div className='font-semibold whitespace-pre'>{` ${wordToGuess.toUpperCase()}`}</div>
      </div>
    </DialogHeader>
  );
};

const ShareButton = () => {
  return (
    <Button className='bg-green-600'>
      Share
      <Share1Icon className='h-4 w-4 ml-2' />
    </Button>
  );
};
