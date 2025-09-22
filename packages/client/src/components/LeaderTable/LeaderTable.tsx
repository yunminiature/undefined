import React, { useState, useEffect, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import TablePagination from '@/components/TablePagination/TablePagination';
import { useGetLeaderboardMutation } from '@/api/leaderboard';
import LeaderBlock from '@/components/LeaderTable/components/LeaderBlock';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';

import s from './LeaderTable.module.css';

const LeaderTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebouncedValue(searchTerm, 300);
  const limit = 10;

  const [getLeaderboard, { data: leaderboardData, isLoading, error }] = useGetLeaderboardMutation();

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch]);

  useEffect(() => {
    getLeaderboard({
      page: currentPage,
      limit,
      search: debouncedSearch,
    });
  }, [currentPage, debouncedSearch, getLeaderboard]);

  const renderLeaderboard = useMemo(() => {
    if (!leaderboardData) return null;
    if (leaderboardData.data.length === 0) return <p>No players yet</p>;
    if (isLoading || error) return <p>{isLoading ? 'Loading...' : 'Error loading leaderboard'}</p>;
    return leaderboardData?.data?.map((leader) => <LeaderBlock key={leader.id} leader={leader} />);
  }, [leaderboardData, isLoading, error]);

  return (
    <section className={s.leaderWrapper}>
      <h1 className={s.leaderTitle}>Top 100 Players</h1>
      <Input placeholder='Search players...' value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      <div className={s.leaderTableContainer}>{renderLeaderboard}</div>
      <TablePagination
        currentPage={currentPage}
        totalPages={leaderboardData?.totalPages ?? 0}
        onPageChange={setCurrentPage}
      />
    </section>
  );
};

export default LeaderTable;
