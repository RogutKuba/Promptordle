import { Button } from './ui/button';
import { BadgeHelpIcon, BarChart, CircleHelp } from 'lucide-react';
import { QuestionMarkIcon } from '@radix-ui/react-icons';
import { Separator } from './ui/separator';

export const Hero = () => {
  return (
    <div className='flex flex-col items-center justify-center'>
      <div className='w-full flex justify-between items-end'>
        <h1 className='scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl'>
          Promptdle
        </h1>

        <div className='flex gap-2 items-end'>
          <Button variant='outline' size='icon'>
            <QuestionMarkIcon className='h-4 w-4' />
          </Button>
          <Button variant='outline' size='icon'>
            <BarChart className='h-4 w-4' />
          </Button>
        </div>
      </div>

      <Separator className='my-4' />

      {/* <p className='px-8'>
        This is a simple chat interface to interact with an AI. You can type
        anything and the AI will respond.
      </p> */}
    </div>
  );
};
