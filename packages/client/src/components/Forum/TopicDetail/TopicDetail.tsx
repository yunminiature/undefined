import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Calendar, MessageCircle } from 'lucide-react';

import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { CommentForm } from '@/components/Forum/CommentForm';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  loadTopicById,
  selectCurrentTopic,
  selectCurrentTopicComments,
  selectForumLoading,
  selectForumError,
  clearCurrentTopic,
} from '@/store/forumSlice';
import { Comment } from '@/types';

export const TopicDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const topic = useAppSelector(selectCurrentTopic);
  const comments = useAppSelector(selectCurrentTopicComments);
  const loading = useAppSelector(selectForumLoading);
  const error = useAppSelector(selectForumError);

  useEffect(() => {
    if (!id) {
      navigate('/forum');
      return;
    }

    dispatch(loadTopicById(id))
      .unwrap()
      .catch(() => {
        navigate('/forum');
      });

    return () => {
      dispatch(clearCurrentTopic());
    };
  }, [id, navigate, dispatch]);

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
        <div className='text-muted-foreground'>Loading topic...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='text-center py-12'>
        <h2 className='text-2xl font-bold mb-4'>Error</h2>
        <p className='text-red-500 mb-4'>{error}</p>
        <Link to='/forum'>
          <Button>
            <ArrowLeft className='h-4 w-4 mr-2' />
            Back to Forum
          </Button>
        </Link>
      </div>
    );
  }

  if (!topic) {
    return (
      <div className='text-center py-12'>
        <h2 className='text-2xl font-bold mb-4'>Topic not found</h2>
        <Link to='/forum'>
          <Button>
            <ArrowLeft className='h-4 w-4 mr-2' />
            Back to Forum
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center gap-4'>
        <Link to='/forum'>
          <Button variant='outline' size='sm'>
            <ArrowLeft className='h-4 w-4 mr-2' />
            Back to Forum
          </Button>
        </Link>
      </div>

      {/* Topic */}
      <Card>
        <CardHeader>
          <CardTitle className='text-2xl'>{topic.title}</CardTitle>
          <div className='flex items-center gap-4 text-sm text-muted-foreground'>
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
              {comments.length}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className='prose max-w-none'>
            <p className='whitespace-pre-wrap'>{topic.content}</p>
          </div>
        </CardContent>
      </Card>

      {/* Comments */}
      <div className='space-y-4'>
        <h3 className='text-xl font-semibold'>Comments ({comments.length})</h3>

        {comments.length === 0 ? (
          <Card>
            <CardContent className='py-8 text-center'>
              <MessageCircle className='h-12 w-12 text-muted-foreground mx-auto mb-4' />
              <CardDescription>No comments yet. Be the first to leave a comment!</CardDescription>
            </CardContent>
          </Card>
        ) : (
          <div className='space-y-4'>
            {comments.map((comment) => (
              <Card key={comment.id}>
                <CardHeader className='pb-3'>
                  <div className='flex items-center gap-4 text-sm text-muted-foreground'>
                    <div className='flex items-center gap-1'>
                      <User className='h-4 w-4' />
                      <span className='font-medium'>{comment.author}</span>
                    </div>
                    <div className='flex items-center gap-1'>
                      <Calendar className='h-4 w-4' />
                      {formatDate(comment.createdAt)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className='whitespace-pre-wrap'>{comment.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Comment Form */}
      <CommentForm topicId={topic.id} />
    </div>
  );
};
