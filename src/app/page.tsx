import React from 'react';
import DailyHeader from '@/components/DailyHeader';

export default function Home() {
  return (
    <div className="flex flex-col items-start justify-start min-h-[50vh] p-8 pt-12 max-w-7xl mx-auto">
      <DailyHeader />
      <h1 className="text-4xl font-bold mb-8 text-center w-full">My Daily Devotional</h1>
      <p className="text-xl text-center w-full">Welcome to your daily devotional space.</p>
    </div>
  );
}
