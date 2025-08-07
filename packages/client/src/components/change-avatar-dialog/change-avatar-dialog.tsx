import { Pencil } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';

import s from './change-avatar-dialog.module.css';
import { Button } from '../ui/button';
import { ChangeAvatarForm } from '../change-avatar-form';
import { useState } from 'react';

export const ChangeAvatarDialog = () => {
  const [open, setOpen] = useState(false);

  const onClose = () => setOpen(false);

  return (
    <div className={s.group}>
      <Avatar className='size-[64px]'>
        <AvatarImage src='https://github.com/shadcn.png' />
        <AvatarFallback>AI</AvatarFallback>
      </Avatar>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant='outline'>
            <Pencil />
            Edit
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload new avatar</DialogTitle>
            <DialogDescription>
              Make changes to your profile Avatar. Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>

          <ChangeAvatarForm onClose={onClose} />
        </DialogContent>
      </Dialog>
    </div>
  );
};
