'use client';
import { Separator } from './ui/separator';
import { StatDialog } from './StatDialog';
import { useState } from 'react';
import { InfoDialog } from './InfoDialog';

export const Hero = () => {
  const [infoOpen, setInfoOpen] = useState<boolean>(false);
  const [statOpen, setStatOpen] = useState<boolean>(false);

  return (
    <div className='flex flex-col items-center justify-center'>
      <div className='w-[35rem] flex justify-between items-end'>
        <h1 className='scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl'>
          Promptdle
        </h1>

        <div className='flex gap-2 items-end'>
          <InfoDialog open={infoOpen} onOpenChange={setInfoOpen} />
          <StatDialog open={statOpen} onOpenChange={setStatOpen} />
        </div>
      </div>

      <Separator className='my-4' />
    </div>
  );
};
