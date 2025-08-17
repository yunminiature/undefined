import React, { FC } from 'react';
import { Card } from '@/components/ui/card';

import s from './ScoreBlock.module.css';

type ScoreBlockProps = {
  score: number;
  scoreDescription: string;
};

const ScoreBlock: FC<ScoreBlockProps> = ({ score, scoreDescription }) => {
  return (
    <Card className={s.cardWrapper}>
      <p className={s.scoreTitle}>{score}</p>
      <span className={s.scoreDescription}>{scoreDescription}</span>
    </Card>
  );
};

export default ScoreBlock;
