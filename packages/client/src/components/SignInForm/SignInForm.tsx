import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { TITLE } from './SignInForm.constants';

import { signInSchema, SignInValues } from './SignInForm.schema';
import s from './SignInForm.module.css';
import { useSignInMutation } from '@/api/auth';
import { toast } from 'sonner';
import { useAuth } from '@/providers';
import { useEffect } from 'react';

const initialValues = {
  login: '',
  password: '',
};

export const SignInForm = () => {
  const form = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: initialValues,
    mode: 'onChange',
    reValidateMode: 'onChange',
  });
  const [signIn, { isLoading, isSuccess, error }] = useSignInMutation();
  const { refreshUserInfo } = useAuth();

  const onSubmit = async (values: SignInValues) => {
    try {
      await signIn({ login: values.login, password: values.password });
      await refreshUserInfo();
    } catch (error: unknown) {
      toast.error('Login failed. Please try again later.');
    }
  };

  useEffect(() => {
    if (isSuccess && !error) {
      toast.success('Signed in!');
    }
  }, [isSuccess, error]);

  const disabled = !form.formState.isValid || form.formState.isSubmitting || isLoading;

  return (
    <Form {...form}>
      <form className={s.form} onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <div className={s.fields}>
          {/* LOGIN */}
          <FormField
            control={form.control}
            name='login'
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>{TITLE.LOGIN.LABEL}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={TITLE.LOGIN.PLACEHOLDER}
                    autoComplete='username'
                    {...field}
                    onBlur={() => {
                      form.trigger('login');
                      field.onBlur?.();
                    }}
                  />
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
                  <Input
                    type='password'
                    placeholder={TITLE.PASSWORD.PLACEHOLDER}
                    autoComplete='password'
                    {...field}
                    onBlur={() => {
                      form.trigger('password');
                      field.onBlur?.();
                    }}
                  />
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
