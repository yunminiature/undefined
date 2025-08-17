import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { TITLE } from './SignUpForm.constants';

import { signUpSchema, SignUpValues } from './SignUpForm.schema';
import s from './SignUpForm.module.css';

export const SignUpForm = () => {
  const form = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',
      login: '',
      first_name: '',
      second_name: '',
      phone: '',
      password: '',
      confirmPassword: ''
    },
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  const onSubmit = async (values: SignUpValues) => {
    try {
      // TODO: send request
    } catch (error: unknown) {
      // TODO: handle error
    }
  };

  const disabled = !form.formState.isValid || form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form className={s.form} onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <div className={s.fields}>
          {/* EMAIL */}
          <FormField
            control={form.control}
            name='email'
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>{TITLE.EMAIL.LABEL}</FormLabel>
                <FormControl>
                  <Input
                    type='email'
                    placeholder={TITLE.EMAIL.PLACEHOLDER}
                    autoComplete='email'
                    {...field}
                    onBlur={() => {
                      form.trigger('email');
                      field.onBlur?.();
                    }}
                  />
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

          {/* FIRST_NAME */}
          <FormField
            control={form.control}
            name='first_name'
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>{TITLE.FIRST_NAME.LABEL}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={TITLE.FIRST_NAME.PLACEHOLDER}
                    autoComplete='given-name'
                    {...field}
                    onBlur={() => {
                      form.trigger('first_name');
                      field.onBlur?.();
                    }}
                  />
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
                  <Input
                    placeholder={TITLE.SECOND_NAME.PLACEHOLDER}
                    autoComplete='family-name'
                    {...field}
                    onBlur={() => {
                      form.trigger('second_name');
                      field.onBlur?.();
                    }}
                  />
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
                  <Input
                    type='tel'
                    placeholder={TITLE.PHONE.PLACEHOLDER}
                    autoComplete='tel'
                    {...field}
                    onBlur={() => {
                      form.trigger('phone');
                      field.onBlur?.();
                    }}
                  />
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

          {/* CONFIRM_PASSWORD */}
          <FormField
            control={form.control}
            name='confirmPassword'
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>{TITLE.CONFIRM_PASSWORD.LABEL}</FormLabel>
                <FormControl>
                  <Input
                    type='password'
                    placeholder={TITLE.CONFIRM_PASSWORD.PLACEHOLDER}
                    {...field}
                    onBlur={() => {
                      form.trigger('confirmPassword');
                      field.onBlur?.();
                    }}
                  />
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
