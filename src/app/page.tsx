import React from 'react';
import DailyHeader from '@/components/DailyHeader';
import VerseOfTheDay from '@/components/VerseOfTheDay';
import WelcomeBanner from '@/components/WelcomeBanner';

export default function Home() {
  return (
    <div className="flex flex-col items-start justify-start min-h-[50vh] p-8 pt-12 max-w-7xl mx-auto">
      <WelcomeBanner />
      <DailyHeader />
      <VerseOfTheDay />
    </div>
  );
}
