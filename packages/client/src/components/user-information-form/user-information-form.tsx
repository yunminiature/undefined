import { useForm } from 'react-hook-form';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';

import { Input } from '../ui/input';
import { Button } from '../ui/button';

import s from './user-information-form.module.css';

const TITLE = {
  LOGIN: {
    LABEL: 'Login',
    PLACEHOLDER: 'Login',
    DESCRIPTION: '3–20 characters, Latin letters and digits, no spaces, allowed: "-" and "_", must not be digits only.',
  },
  FIRST_NAME: {
    LABEL: 'First Name',
    PLACEHOLDER: 'First Name',
    DESCRIPTION: 'Use your real first name.',
  },
  SECOND_NAME: {
    LABEL: 'Second Name',
    PLACEHOLDER: 'Second Name',
    DESCRIPTION: 'Use your real second name.',
  },
  DISPLAY_NAME: {
    LABEL: 'Display Name',
    PLACEHOLDER: 'Display Name',
    DESCRIPTION: 'This is the name that will be displayed on your profile.',
  },
  EMAIL: {
    LABEL: 'Email',
    PLACEHOLDER: 'Email',
    DESCRIPTION: 'Enter a valid email you have access to.',
  },
  PHONE: {
    LABEL: 'Phone number',
    PLACEHOLDER: 'Phone number',
    DESCRIPTION: 'Include country code (e.g. +7).',
  },
} as const;

export const UserInformationForm = () => {
  const form = useForm();

  return (
    <Form {...form}>
      <form className={s.form}>
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
              <FormDescription>{TITLE.LOGIN.DESCRIPTION}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* FIRST_NAME */}
        <FormField
          control={form.control}
          name='first_name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{TITLE.FIRST_NAME.LABEL}</FormLabel>
              <FormControl>
                <Input placeholder={TITLE.FIRST_NAME.PLACEHOLDER} autoComplete='given-name' {...field} />
              </FormControl>
              <FormDescription>{TITLE.FIRST_NAME.DESCRIPTION}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* SECOND_NAME */}
        <FormField
          control={form.control}
          name='second_name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{TITLE.SECOND_NAME.LABEL}</FormLabel>
              <FormControl>
                <Input placeholder={TITLE.SECOND_NAME.PLACEHOLDER} autoComplete='family-name' {...field} />
              </FormControl>
              <FormDescription>{TITLE.SECOND_NAME.DESCRIPTION}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* DISPLAY_NAME */}
        <FormField
          control={form.control}
          name='display_name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{TITLE.DISPLAY_NAME.LABEL}</FormLabel>
              <FormControl>
                <Input placeholder={TITLE.DISPLAY_NAME.PLACEHOLDER} autoComplete='nickname' {...field} />
              </FormControl>
              <FormDescription>{TITLE.DISPLAY_NAME.DESCRIPTION}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* EMAIL */}
        <FormField
          control={form.control}
          name='phone'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{TITLE.EMAIL.LABEL}</FormLabel>
              <FormControl>
                <Input type='email' placeholder={TITLE.EMAIL.PLACEHOLDER} autoComplete='email' {...field} />
              </FormControl>
              <FormDescription>{TITLE.EMAIL.DESCRIPTION}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* PHONE */}
        <FormField
          control={form.control}
          name='phone'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{TITLE.PHONE.LABEL}</FormLabel>
              <FormControl>
                <Input type='tel' placeholder={TITLE.PHONE.PLACEHOLDER} autoComplete='tel' {...field} />
              </FormControl>
              <FormDescription>{TITLE.PHONE.DESCRIPTION}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className='w-max'>Save</Button>
      </form>
    </Form>
  );
};
