import { useForm } from 'react-hook-form';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { TITLE } from './SignInForm.constants';

import s from './SignInForm.module.css';

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
        <div className={s.fields}>
          {/* LOGIN */}
          <FormField
            control={form.control}
            name='login'
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>{TITLE.LOGIN.LABEL}</FormLabel>
                <FormControl>
                  <Input placeholder={TITLE.LOGIN.PLACEHOLDER} autoComplete='username' {...field} />
                </FormControl>
                {!fieldState.error && <FormDescription>{TITLE.LOGIN.DESCRIPTION}</FormDescription>}
                <FormMessage />
              </FormItem>
            )}
          />

          {/* PASSWORD */}
          <FormField
            control={form.control}
            name='password'
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>{TITLE.PASSWORD.LABEL}</FormLabel>
                <FormControl>
                  <Input type='password' placeholder={TITLE.PASSWORD.PLACEHOLDER} autoComplete='password' {...field} />
                </FormControl>
                {!fieldState.error && <FormDescription>{TITLE.PASSWORD.DESCRIPTION}</FormDescription>}
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type='submit' disabled={disabled} size='lg' className='w-full'>
          Sign in
        </Button>
      </form>
    </Form>
  );
};
