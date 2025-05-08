export const Footer = () => {
  return (
    <footer className='absolute bottom-0 w-screen flex justify-between p-8 text-muted-foreground'>
      <div className='flex flex-col gap-2'>
        <div>
          Built by <a href='https://x.com/rogutkuba'>@rogutkuba</a>
        </div>
        <span>Check out my other projects:</span>

        <a
          href='https://sfxengine.com?ref=promptordle'
          className='text-blue-400 underline'
        >
          SFX Engine
        </a>

        <a
          href='https://why.new?ref=promptordle'
          className='text-blue-400 underline'
        >
          Why.new
        </a>
      </div>
    </footer>
  );
};
