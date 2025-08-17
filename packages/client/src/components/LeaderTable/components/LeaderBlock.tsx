import React, { FC } from 'react';
import { Card } from '@/components/ui/card';
import type { LeaderboardEntry } from '@/api/leaderboard';

type LeaderBlockProps = {
  leader: LeaderboardEntry;
};

const LeaderBlock: FC<LeaderBlockProps> = ({ leader }) => {
  return (
    <Card className='flex items-center p-4 gap-2'>
      <span className='text-lg font-bold text-center'>#{leader.rank}</span>
      {leader.avatar && <img src={leader.avatar} alt={leader.name} className='w-10 h-10 rounded-full object-cover' />}
      <div className='flex-1'>
        <span className='font-semibold'>{leader.name}</span>
      </div>
      <span className='text-lg font-bold'>{leader.score.toLocaleString()}</span>
    </Card>
  );
};

export default LeaderBlock;
