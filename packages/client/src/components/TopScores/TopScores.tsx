import React, { useMemo } from 'react';
import { useGetTopScoresQuery } from '@/api/leaderboard';
import ScoreBlock from './components/ScoreBlock';

import s from './TopScores.module.css';

const TopScores = () => {
  const { data: scores, isLoading, error } = useGetTopScoresQuery();

  const renderScores = useMemo(() => {
    if (!scores) return null;
    if (scores.length === 0) return <p>No scores yet</p>;
    if (isLoading || error) return <p>{isLoading ? 'Loading...' : 'Error loading scores'}</p>;
    return scores.map((score, index) => (
      <ScoreBlock key={`${score.score}-${index}`} score={score.score} scoreDescription={score.scoreDescription} />
    ));
  }, [scores, isLoading, error]);

  return (
    <div className={s.scoresWrapper}>
      <h1 className={s.scoresTitle}>Top Scores</h1>
      <section className={s.scoresContainer}>{renderScores}</section>
    </div>
  );
};

export default TopScores;
