import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';

import s from './SignInForm.module.css';
import { Input } from '../ui/input';
import { TITLE } from './SignInForm.constants';
import { Button } from '../ui/button';

export const SignInForm = () => {
  const form = useForm();

  const onSubmit = async () => {
    try {
      // TODO: send request
    } catch (error: unknown) {
      // TODO: handle error
    }
  };

  const disabled = !form.formState.isValid; // TODO: add isLoading

  return (
    <Form {...form}>
      <form className={s.form} onSubmit={form.handleSubmit(onSubmit)}>
        {/* LOGIN */}
        <FormField
          control={form.control}
          name='login'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{TITLE.LOGIN.LABEL}</FormLabel>
              <FormControl>
                <Input placeholder={TITLE.LOGIN.PLACEHOLDER} autoComplete='username' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* PASSWORD */}
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{TITLE.PASSWORD.LABEL}</FormLabel>
              <FormControl>
                <Input type='password' placeholder={TITLE.PASSWORD.PLACEHOLDER} autoComplete='password' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type='submit' disabled={disabled} size='lg' className='w-full'>
          Sign in
        </Button>
      </form>
    </Form>
  );
};
