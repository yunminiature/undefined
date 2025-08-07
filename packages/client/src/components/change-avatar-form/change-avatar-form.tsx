import { Controller, useForm } from 'react-hook-form';
import { Form, FormControl, FormDescription, FormItem, FormLabel, FormMessage } from '../ui/form';

import { Input } from '../ui/input';
import { Button } from '../ui/button';

import s from './change-avatar-form.module.css';
import z from 'zod';

import { useChangeAvatarMutation } from '@/api/users';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { avatarSchema } from './change-avatar-form.validation';
import { ALLOWED_TYPES, TITLE } from './change-avatar-form.constants';
import { getAvatarErrorMessage } from './change-avatar-form.utils';

type AvatarFormValues = z.infer<typeof avatarSchema>;

type ChangeAvatarFormProps = {
  onClose: VoidFunction;
};

export const ChangeAvatarForm = ({ onClose }: ChangeAvatarFormProps) => {
  const [changeAvatar, { isLoading }] = useChangeAvatarMutation();

  const form = useForm<AvatarFormValues>({
    resolver: zodResolver(avatarSchema),
    mode: 'onChange',
  });

  const onSubmit = async ({ avatar }: AvatarFormValues) => {
    const fd = new FormData();
    fd.append('avatar', avatar);

    try {
      await changeAvatar(fd).unwrap();
      toast.success('Avatar updated');
      form.reset();
      onClose();
    } catch (err) {
      toast.error(getAvatarErrorMessage(err));
    }
  };

  const onCancel = () => {
    form.reset();
    onClose();
  };

  const disabled = isLoading || !form.formState.isValid;

  return (
    <Form {...form}>
      <form className={s.form} onSubmit={form.handleSubmit(onSubmit)}>
        <Controller
          control={form.control}
          name='avatar'
          render={({ field: { onChange, value, ...fieldProps } }) => (
            <FormItem>
              <FormLabel>{TITLE.AVATAR.LABEL}</FormLabel>
              <FormControl>
                <Input
                  type='file'
                  accept={ALLOWED_TYPES.join(',')}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) onChange(file);
                  }}
                  {...fieldProps}
                />
              </FormControl>
              <FormDescription>{TITLE.AVATAR.DESCRIPTION}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className={s.footer}>
          <Button type='button' variant='outline' className='w-max' onClick={onCancel}>
            Cancel
          </Button>
          <Button type='submit' disabled={disabled} className='w-max'>
            {isLoading ? 'Saving…' : 'Save'}
          </Button>
        </div>
      </form>
    </Form>
  );
};
