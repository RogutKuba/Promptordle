interface Props {
  riddles: string[];
}

export const Riddles = ({ riddles }: Props) => {
  return (
    <div className='m-2'>
      {riddles.map((riddle, i) => (
        <p className='leading-7' key={`${riddle.substring(0, 10)}-${i}`}>
          {riddle}
        </p>
      ))}
    </div>
  );
};
