import { useStats } from '@/lib/stats.api';
import { useMemo } from 'react';

const STAT_FIELDS = [
  'played',
  'win_%',
  'current_streak',
  'longest_streak',
] as const;

interface Props {
  numToHighlight: number | undefined;
}

export const StatsView = ({ numToHighlight }: Props) => {
  const { stats } = useStats();

  const maxDistribution = useMemo(
    () => Math.max(...(Object.values(stats.distribution) as number[])),
    [stats.distribution]
  );

  return (
    <div className='flex flex-col items-center space-y-8'>
      <div className='flex justify-between items-center gap-8'>
        {STAT_FIELDS.map((field) => {
          const value = stats[field];

          return (
            <div key={field} className='flex flex-col items-center'>
              <div className='text-2xl font-semibold'>{value}</div>
              <div className='capitalize'>{field.replace('_', ' ')}</div>
            </div>
          );
        })}
      </div>

      <div>
        <p className='text-lg font-semibold uppercase px-[4rem]'>
          Guess distribution
        </p>

        <div className='flex flex-col items-end space-y-1 w-full'>
          {(Object.entries(stats.distribution) as [string, number][]).map(
            ([key, value]) => (
              <div key={key} className='flex items-end justify-start w-[24rem]'>
                <div className='w-8 text-center'>{key}</div>
                <div
                  className={`${
                    key === numToHighlight?.toString()
                      ? 'bg-green-600'
                      : 'bg-slate-500'
                  } flex justify-start `}
                  style={{
                    width: `calc(${(value / maxDistribution) * 100}% - 32px)`,
                    minWidth: '20px',
                  }}
                >
                  <div className='min-w-[20px] text-center text-slate-200 font-medium'>
                    {value}
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};
