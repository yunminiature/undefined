import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { TITLE } from './UserInformationForm.constants';

import { userInfoSchema, UserInfoValues } from './UserInformationForm.schema';
import s from './UserInformationForm.module.css';

export const UserInformationForm = () => {
  const form = useForm<UserInfoValues>({
    resolver: zodResolver(userInfoSchema),
    defaultValues: {
      login: '',
      first_name: '',
      second_name: '',
      display_name: '',
      email: '',
      phone: '',
    },
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  const onSubmit = async (values: UserInfoValues) => {
    try {
      // TODO: send request with values
    } catch (e) {
      // TODO: handle error
    }
  };

  const disabled = !form.formState.isValid || form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form className={s.form} onSubmit={form.handleSubmit(onSubmit)} noValidate>
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
                    field.onBlur();
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
                    field.onBlur();
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
                    field.onBlur();
                  }}
                />
              </FormControl>
              {!fieldState.error && <FormDescription>{TITLE.SECOND_NAME.DESCRIPTION}</FormDescription>}
              <FormMessage />
            </FormItem>
          )}
        />

        {/* DISPLAY_NAME */}
        <FormField
          control={form.control}
          name='display_name'
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>{TITLE.DISPLAY_NAME.LABEL}</FormLabel>
              <FormControl>
                <Input
                  placeholder={TITLE.DISPLAY_NAME.PLACEHOLDER}
                  autoComplete='nickname'
                  {...field}
                  onBlur={() => {
                    form.trigger('display_name');
                    field.onBlur();
                  }}
                />
              </FormControl>
              {!fieldState.error && <FormDescription>{TITLE.DISPLAY_NAME.DESCRIPTION}</FormDescription>}
              <FormMessage />
            </FormItem>
          )}
        />

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
                    field.onBlur();
                  }}
                />
              </FormControl>
              {!fieldState.error && <FormDescription>{TITLE.EMAIL.DESCRIPTION}</FormDescription>}
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
                    field.onBlur();
                  }}
                />
              </FormControl>
              {!fieldState.error && <FormDescription>{TITLE.PHONE.DESCRIPTION}</FormDescription>}
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type='submit' className='w-max' disabled={disabled}>
          Save
        </Button>
      </form>
    </Form>
  );
};
