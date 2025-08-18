import { useForm } from 'react-hook-form';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';

import { Input } from '../ui/input';
import { TITLE } from './SignUpForm.constants';
import { Button } from '../ui/button';
import { useSignUpMutation } from '@/api/auth';

import s from './SignUpForm.module.css';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/providers';
import { useEffect } from 'react';

const initialValues = {
  email: '',
  login: '',
  first_name: '',
  second_name: '',
  phone: '',
  password: '',
  confirmPassword: '',
};

export const SignUpForm = () => {
  const form = useForm({
    defaultValues: initialValues,
  });
  const [signUp, { isLoading, isSuccess, error }] = useSignUpMutation();
  const navigate = useNavigate();
  const { refreshUserInfo } = useAuth();

  const onSubmit = async (values: typeof initialValues) => {
    try {
      const { confirmPassword, ...restValues } = values;
      await signUp(restValues);
      await refreshUserInfo();
    } catch (error: unknown) {
      toast.error('Sign up failed. Please try again later.');
    }
  };

  useEffect(() => {
    if (isSuccess && !error) {
      toast.success('Account created!');
      navigate('/', { replace: true });
    }
  }, [isSuccess, error]);

  const disabled = !form.formState.isValid || isLoading;

  return (
    <Form {...form}>
      <form className={s.form} onSubmit={form.handleSubmit(onSubmit)}>
        <div className={s.fields}>
          {/* EMAIL */}
          <FormField
            control={form.control}
            name='email'
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>{TITLE.EMAIL.LABEL}</FormLabel>
                <FormControl>
                  <Input type='email' placeholder={TITLE.EMAIL.PLACEHOLDER} autoComplete='email' {...field} />
                </FormControl>
                {!fieldState.error && <FormDescription>{TITLE.EMAIL.DESCRIPTION}</FormDescription>}
                <FormMessage />
              </FormItem>
            )}
          />

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

          {/* FIRST_NAME */}
          <FormField
            control={form.control}
            name='first_name'
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>{TITLE.FIRST_NAME.LABEL}</FormLabel>
                <FormControl>
                  <Input placeholder={TITLE.FIRST_NAME.PLACEHOLDER} autoComplete='given-name' {...field} />
                </FormControl>
                {!fieldState.error && <FormDescription>{TITLE.FIRST_NAME.DESCRIPTION}</FormDescription>}
                <FormMessage />
              </FormItem>
            )}
          />

          {/* SECOND_NAME */}
          <FormField
            control={form.control}
            name='second_name'
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>{TITLE.SECOND_NAME.LABEL}</FormLabel>
                <FormControl>
                  <Input placeholder={TITLE.SECOND_NAME.PLACEHOLDER} autoComplete='family-name' {...field} />
                </FormControl>
                {!fieldState.error && <FormDescription>{TITLE.SECOND_NAME.DESCRIPTION}</FormDescription>}
                <FormMessage />
              </FormItem>
            )}
          />

          {/* PHONE */}
          <FormField
            control={form.control}
            name='phone'
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>{TITLE.PHONE.LABEL}</FormLabel>
                <FormControl>
                  <Input type='tel' placeholder={TITLE.PHONE.PLACEHOLDER} autoComplete='tel' {...field} />
                </FormControl>
                {!fieldState.error && <FormDescription>{TITLE.PHONE.DESCRIPTION}</FormDescription>}
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
        </div>

        <Button type='submit' disabled={disabled} size='lg' className='w-full'>
          Sign up
        </Button>
      </form>
    </Form>
  );
};
