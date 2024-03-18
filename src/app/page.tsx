import { Hero } from '@/components/Hero';
import { Chat } from '@/components/Chat';

export default function Home() {
  return (
    <main className='flex flex-col items-center justify-between'>
      <Hero />
      <Chat />
    </main>
  );
}
