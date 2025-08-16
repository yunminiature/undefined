import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { createTopic, selectForumLoading } from '@/store/forumSlice';

import {
  Button,
  Label,
  Input,
  Textarea,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui';

const createTopicSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .min(5, 'Title must contain at least 5 characters')
    .max(100, 'Title must not exceed 100 characters'),
  content: z
    .string()
    .min(1, 'Content is required')
    .min(10, 'Content must contain at least 10 characters')
    .max(2000, 'Content must not exceed 2000 characters'),
  author: z
    .string()
    .min(1, 'Author name is required')
    .min(2, 'Author name must contain at least 2 characters')
    .max(50, 'Author name must not exceed 50 characters'),
});

type CreateTopicFormData = z.infer<typeof createTopicSchema>;

export const CreateTopicForm: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectForumLoading);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateTopicFormData>({
    resolver: zodResolver(createTopicSchema),
  });

  const onSubmit = async (data: CreateTopicFormData) => {
    try {
      const result = await dispatch(createTopic(data)).unwrap();
      toast.success('Topic created successfully!');
      reset();
      navigate(`/forum/topic/${result.id}`);
    } catch (error) {
      console.error('Error creating topic:', error);
      toast.error('Error creating topic');
    }
  };

  const handleCancel = () => {
    navigate('/forum');
  };

  return (
    <Card className='w-full max-w-2xl mx-auto'>
      <CardHeader>
        <CardTitle>Create New Topic</CardTitle>
        <CardDescription>Fill out the form below to create a new topic for discussion</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='title'>Title</Label>
            <Input
              id='title'
              placeholder='Enter topic title'
              {...register('title')}
              className={errors.title ? 'border-red-500' : ''}
            />
            {errors.title && <p className='text-sm text-red-500'>{errors.title.message}</p>}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='author'>Author</Label>
            <Input
              id='author'
              placeholder='Your name'
              {...register('author')}
              className={errors.author ? 'border-red-500' : ''}
            />
            {errors.author && <p className='text-sm text-red-500'>{errors.author.message}</p>}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='content'>Content</Label>
            <Textarea
              id='content'
              placeholder='Describe the topic for discussion...'
              {...register('content')}
              className={`min-h-[120px] resize-vertical ${errors.content ? 'border-red-500' : ''}`}
            />
            {errors.content && <p className='text-sm text-red-500'>{errors.content.message}</p>}
          </div>
        </CardContent>
        <CardFooter className='flex gap-2 justify-end'>
          <Button type='button' variant='outline' onClick={handleCancel} disabled={loading}>
            Cancel
          </Button>
          <Button type='submit' disabled={loading}>
            {loading ? 'Creating...' : 'Create Topic'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
