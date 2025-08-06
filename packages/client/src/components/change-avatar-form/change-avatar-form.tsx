import { useForm } from 'react-hook-form';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';

import { Input } from '../ui/input';
import { Button } from '../ui/button';

import s from './change-avatar-form.module.css';

const TITLE = {
  AVATAR: {
    LABEL: 'File',
    DESCRIPTION: 'Allowed formats: JPG, PNG, WebP. Max size: 2&nbsp;MB.',
  },
} as const;

export const ChangeAvatarForm = () => {
  const form = useForm();

  return (
    <Form {...form}>
      <form className={s.form}>
        <FormField
          control={form.control}
          name='avatar'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{TITLE.AVATAR.LABEL}</FormLabel>
              <FormControl>
                <Input type='file' {...field} />
              </FormControl>
              <FormDescription>{TITLE.AVATAR.DESCRIPTION}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className={s.footer}>
          <Button variant='outline' className='w-max'>
            Cancel
          </Button>
          <Button type='submit' className='w-max'>
            Save
          </Button>
        </div>
      </form>
    </Form>
  );
};
