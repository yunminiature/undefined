import { useForm } from 'react-hook-form';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';

import { Input } from '../ui/input';
import { Button } from '../ui/button';

import s from './change-password-form.module.css';

const TITLE = {
  OLD_PASSWORD: {
    LABEL: 'Verify current password',
    PLACEHOLDER: 'Current password',
    DESCRIPTION: 'Use your current password.',
  },
  NEW_PASSWORD: {
    LABEL: 'New password',
    PLACEHOLDER: 'New password',
    DESCRIPTION: '8–40 characters, must include at least one uppercase letter and one digit.',
  },
  CONFIRM_PASSWORD: {
    LABEL: 'Confirm password',
    PLACEHOLDER: 'Confirm password',
    DESCRIPTION: 'Re-enter your new password.',
  },
} as const;

export const ChangePasswordForm = () => {
  const form = useForm();

  return (
    <Form {...form}>
      <form className={s.form}>
        {/* OLD_PASSWORD */}
        <FormField
          control={form.control}
          name='oldPassword'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{TITLE.OLD_PASSWORD.LABEL}</FormLabel>
              <FormControl>
                <Input
                  type='password'
                  placeholder={TITLE.OLD_PASSWORD.PLACEHOLDER}
                  autoComplete='password'
                  {...field}
                />
              </FormControl>
              <FormDescription>{TITLE.OLD_PASSWORD.DESCRIPTION}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* NEW_PASSWORD */}
        <FormField
          control={form.control}
          name='newPassword'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{TITLE.NEW_PASSWORD.LABEL}</FormLabel>
              <FormControl>
                <Input type='password' placeholder={TITLE.NEW_PASSWORD.PLACEHOLDER} {...field} />
              </FormControl>
              <FormDescription>{TITLE.NEW_PASSWORD.DESCRIPTION}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* CONFIRM_PASSWORD */}
        <FormField
          control={form.control}
          name='newPassword'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{TITLE.CONFIRM_PASSWORD.LABEL}</FormLabel>
              <FormControl>
                <Input type='password' placeholder={TITLE.CONFIRM_PASSWORD.PLACEHOLDER} {...field} />
              </FormControl>
              <FormDescription>{TITLE.CONFIRM_PASSWORD.DESCRIPTION}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button className='w-max'>Save</Button>
      </form>
    </Form>
  );
};
