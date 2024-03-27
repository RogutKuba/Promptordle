import { Separator } from './ui/separator';

interface Props {
  riddles: string[];
}

export const Riddles = ({ riddles }: Props) => {
  return (
    <div className='m-2 max-h-[10rem] overflow-hidden overflow-y-scroll'>
      {riddles.map((riddle, i) => (
        <div key={`${riddle.substring(0, 10)}-${i}`}>
          <p className='leading-7 my-2'>{riddle}</p>
          {i !== riddles.length - 1 && <Separator />}
        </div>
      ))}
    </div>
  );
};
