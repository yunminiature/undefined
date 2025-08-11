import { useForm } from 'react-hook-form';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';

import { Input } from '../ui/input';
import { Button } from '../ui/button';

import s from './ChangePasswordForm.module.css';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useChangePasswordMutation } from '@/api/users';
import { toast } from 'sonner';
import { schema } from './ChangePasswordForm.validation';
import { getErrorMessage } from './ChangePasswordForm.utils';
import { TITLE } from './ChangePasswordForm.constants';

type FormValues = z.infer<typeof schema>;

export const ChangePasswordForm = () => {
  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      await changePassword({
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      }).unwrap();

      toast.success('Password updated');
      form.reset();
    } catch (error: unknown) {
      toast.error(getErrorMessage(error));
    }
  };

  const disabled = isLoading || !form.formState.isValid;

  return (
    <Form {...form}>
      <form className={s.form} onSubmit={form.handleSubmit(onSubmit)}>
        {/* OLD_PASSWORD */}
        <FormField
          control={form.control}
          name='oldPassword'
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>{TITLE.OLD_PASSWORD.LABEL}</FormLabel>
              <FormControl>
                <Input
                  type='password'
                  placeholder={TITLE.OLD_PASSWORD.PLACEHOLDER}
                  autoComplete='current-password'
                  {...field}
                />
              </FormControl>
              {!fieldState.error && <FormDescription>{TITLE.OLD_PASSWORD.DESCRIPTION}</FormDescription>}
              <FormMessage />
            </FormItem>
          )}
        />

        {/* NEW_PASSWORD */}
        <FormField
          control={form.control}
          name='newPassword'
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>{TITLE.NEW_PASSWORD.LABEL}</FormLabel>
              <FormControl>
                <Input type='password' placeholder={TITLE.NEW_PASSWORD.PLACEHOLDER} {...field} />
              </FormControl>
              {!fieldState.error && <FormDescription>{TITLE.NEW_PASSWORD.DESCRIPTION}</FormDescription>}
              <FormMessage />
            </FormItem>
          )}
        />

        {/* CONFIRM_PASSWORD */}
        <FormField
          control={form.control}
          name='confirmPassword'
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>{TITLE.CONFIRM_PASSWORD.LABEL}</FormLabel>
              <FormControl>
                <Input type='password' placeholder={TITLE.CONFIRM_PASSWORD.PLACEHOLDER} {...field} />
              </FormControl>
              {!fieldState.error && <FormDescription>{TITLE.CONFIRM_PASSWORD.DESCRIPTION}</FormDescription>}
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type='submit' disabled={disabled} className='w-max'>
          {isLoading ? 'Saving…' : 'Save'}
        </Button>
      </form>
    </Form>
  );
};
