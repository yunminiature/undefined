import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';

import { Button, Label, Input, Textarea, Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addComment, selectForumLoading } from '@/store/forumSlice';

const commentSchema = z.object({
  content: z
    .string()
    .min(1, 'Comment cannot be empty')
    .min(3, 'Comment must contain at least 3 characters')
    .max(1000, 'Comment must not exceed 1000 characters'),
  author: z
    .string()
    .min(1, 'Author name is required')
    .min(2, 'Author name must contain at least 2 characters')
    .max(50, 'Author name must not exceed 50 characters'),
});

type CommentFormData = z.infer<typeof commentSchema>;

interface CommentFormProps {
  topicId: string;
}

export const CommentForm: React.FC<CommentFormProps> = ({ topicId }) => {
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectForumLoading);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CommentFormData>({
    resolver: zodResolver(commentSchema),
  });

  const onSubmit = async (data: CommentFormData) => {
    try {
      await dispatch(
        addComment({
          topicId,
          content: data.content,
          author: data.author,
        })
      ).unwrap();

      toast.success('Comment added!');
      reset();
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Error adding comment');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Comment</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='author'>Your Name</Label>
            <Input
              id='author'
              placeholder='Enter your name'
              {...register('author')}
              className={errors.author ? 'border-red-500' : ''}
            />
            {errors.author && <p className='text-sm text-red-500'>{errors.author.message}</p>}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='content'>Comment</Label>
            <Textarea
              id='content'
              placeholder='Write your comment...'
              {...register('content')}
              className={`min-h-[100px] resize-vertical ${errors.content ? 'border-red-500' : ''}`}
            />
            {errors.content && <p className='text-sm text-red-500'>{errors.content.message}</p>}
          </div>

          <div className='flex justify-end'>
            <Button type='submit' disabled={loading}>
              {loading ? 'Adding...' : 'Add Comment'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
