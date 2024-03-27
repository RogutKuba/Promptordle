import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { BarChart } from 'lucide-react';
import { StatsView } from './StatsView';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const StatDialog = ({ open, onOpenChange }: Props) => {
  return (
    <Dialog open={open} defaultOpen={false} onOpenChange={onOpenChange}>
      <DialogTrigger>
        <div className='h-10 w-10 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground'>
          <BarChart className='h-4 w-4' />
        </div>
      </DialogTrigger>
      <DialogContent className=''>
        <DialogHeader>
          <DialogTitle>Your statistics</DialogTitle>
        </DialogHeader>
        <StatsView numToHighlight={undefined} />
        <DialogFooter>
          <div className='w-full flex justify-center'>
            <a href='https://twitter.com/rogutkuba' target='_blank'>
              <p className='text-sm text-muted-foreground'>
                Created by @rogutkuba
              </p>
            </a>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
