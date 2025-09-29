import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { useCreateTopicMutation } from '@/api/forum';

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
  body: z
    .string()
    .min(1, 'Content is required')
    .min(10, 'Content must contain at least 10 characters')
    .max(2000, 'Content must not exceed 2000 characters'),
});

type CreateTopicFormData = z.infer<typeof createTopicSchema>;

export const CreateTopicForm: React.FC = () => {
  const navigate = useNavigate();
  const [createTopic, { isLoading: loading }] = useCreateTopicMutation();

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
      const result = await createTopic(data).unwrap();
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
            <Label htmlFor='body'>Content</Label>
            <Textarea
              id='body'
              placeholder='Describe the topic for discussion...'
              {...register('body')}
              className={`min-h-[120px] resize-vertical ${errors.body ? 'border-red-500' : ''}`}
            />
            {errors.body && <p className='text-sm text-red-500'>{errors.body.message}</p>}
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
