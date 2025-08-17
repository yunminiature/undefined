import s from './Leaderboard.module.css';
import { Header } from '@/components';
import TopScores from '@/components/TopScores/TopScores';
import LeaderTable from '@/components/LeaderTable/LeaderTable';

export const Leaderboard = () => {
  return (
    <div className={s.page}>
      <section className={s.section}>
        <Header title='Leaderboard' />
        <div className={s.content}>
          <TopScores />
          <LeaderTable />
        </div>
      </section>
    </div>
  );
};
