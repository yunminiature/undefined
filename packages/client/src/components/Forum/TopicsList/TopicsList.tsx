import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Plus, User, Calendar } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loadTopics, selectTopics, selectForumLoading, selectForumError } from '@/store/forumSlice';

export const TopicsList: React.FC = () => {
  const dispatch = useAppDispatch();
  const topics = useAppSelector(selectTopics);
  const loading = useAppSelector(selectForumLoading);
  const error = useAppSelector(selectForumError);

  useEffect(() => {
    dispatch(loadTopics());
  }, [dispatch]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className='flex justify-center items-center min-h-[200px]'>
        <div className='text-muted-foreground'>Loading topics...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex justify-center items-center min-h-[200px]'>
        <div className='text-red-500'>Error: {error}</div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <div>
          <h1 className='text-3xl font-bold'>Forum</h1>
          <p className='text-muted-foreground mt-2'>Discuss interesting topics with other users</p>
        </div>
        <Link to='/forum/create'>
          <Button className='flex items-center gap-2'>
            <Plus className='h-4 w-4' />
            Create Topic
          </Button>
        </Link>
      </div>

      {topics.length === 0 ? (
        <Card>
          <CardContent className='flex flex-col items-center justify-center py-12'>
            <MessageCircle className='h-12 w-12 text-muted-foreground mb-4' />
            <CardTitle className='mb-2'>No topics yet</CardTitle>
            <CardDescription className='text-center mb-4'>
              Be the first to create a topic for discussion!
            </CardDescription>
            <Link to='/forum/create'>
              <Button>
                <Plus className='h-4 w-4 mr-2' />
                Create First Topic
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className='space-y-4'>
          {topics.map((topic) => (
            <Card key={topic.id} className='hover:shadow-md transition-shadow'>
              <CardHeader>
                <div className='flex justify-between items-start'>
                  <div className='flex-1'>
                    <Link to={`/forum/topic/${topic.id}`}>
                      <CardTitle className='hover:text-primary transition-colors cursor-pointer'>
                        {topic.title}
                      </CardTitle>
                    </Link>

                    <div className='flex items-center gap-4 mt-2 text-sm text-muted-foreground'>
                      <div className='flex items-center gap-1'>
                        <User className='h-4 w-4' />
                        {topic.author}
                      </div>

                      <div className='flex items-center gap-1'>
                        <Calendar className='h-4 w-4' />
                        {formatDate(topic.createdAt)}
                      </div>

                      <div className='flex items-center gap-1'>
                        <MessageCircle className='h-4 w-4' />
                        {topic.commentsCount}
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <CardDescription className='line-clamp-3'>{topic.content}</CardDescription>

                <div className='mt-4'>
                  <Link to={`/forum/topic/${topic.id}`}>
                    <Button variant='outline' size='sm'>
                      Read More
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
