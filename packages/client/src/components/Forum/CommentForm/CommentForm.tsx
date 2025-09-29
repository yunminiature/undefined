import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';

import { Button, Label, Textarea, Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { useCreateCommentMutation } from '@/api/forum';

const commentSchema = z.object({
  body: z
    .string()
    .min(1, 'Comment cannot be empty')
    .min(3, 'Comment must contain at least 3 characters')
    .max(1000, 'Comment must not exceed 1000 characters'),
});

type CommentFormData = z.infer<typeof commentSchema>;

interface CommentFormProps {
  topicId: number;
}

export const CommentForm: React.FC<CommentFormProps> = ({ topicId }) => {
  const [createComment, { isLoading: loading }] = useCreateCommentMutation();

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
      await createComment({
        topicId,
        data: { body: data.body },
      }).unwrap();

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
            <Label htmlFor='body'>Comment</Label>
            <Textarea
              id='body'
              placeholder='Write your comment...'
              {...register('body')}
              className={`min-h-[100px] resize-vertical ${errors.body ? 'border-red-500' : ''}`}
            />
            {errors.body && <p className='text-sm text-red-500'>{errors.body.message}</p>}
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
