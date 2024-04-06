import { QuestionMarkIcon } from '@radix-ui/react-icons';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const InfoDialog = ({ open, onOpenChange }: Props) => {
  return (
    <Dialog open={open} defaultOpen={false} onOpenChange={onOpenChange}>
      <DialogTrigger>
        <div className='h-10 w-10 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground'>
          <QuestionMarkIcon className='h-4 w-4' />
        </div>
      </DialogTrigger>
      <DialogContent className=''>
        <DialogHeader>
          <DialogTitle>How to play</DialogTitle>
        </DialogHeader>
        <div>
          <span>Guess the word in 6 tries.</span>
          <ul>
            <li>Each guess must be a valid word with 5 letters.</li>
            <li>Each incorrect guess will be met with a riddle</li>
            <li>The riddles should get easier for each incorrect guess</li>
            <li>The riddles will try to incorporate the previous guess</li>
          </ul>
        </div>
        <DialogFooter>
          <a
            href='https://www.producthunt.com/posts/promptordle?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-promptordle'
            target='_blank'
          >
            <img
              src='https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=449160&theme=light'
              alt='Promptordle - Wordle&#0032;with&#0032;an&#0032;AI&#0032;twist | Product Hunt'
              // style='width: 250px; height: 54px;'
              width='250'
              height='54'
            />
          </a>
          <div className='w-full flex justify-center items-center'>
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
