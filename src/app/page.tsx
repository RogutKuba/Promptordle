import { Hero } from "@/components/Hero";
import { Chat } from "@/components/Chat";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Promptordle",
  description: "A word guessing game with an AI twist!",
};

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-between">
      <Hero />
      <Chat />
    </main>
  );
}
