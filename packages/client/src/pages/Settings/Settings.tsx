import { ChangeAvatarDialog, ChangePasswordForm, Header, SectionHeading, UserInformationForm } from '@/components';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

import s from './Settings.module.css';
import { useNavigate } from 'react-router-dom';

export const SettingsPage = () => {
  const navigate = useNavigate();

  const onBack = () => {
    navigate(-1);
  };

  return (
    <div className={s.page}>
      <header className={s.header}>
        <Header title='Settings' subtitle='Manage your account settings.' />
      </header>

      <main className={s.main}>
        <nav className={s.nav}>
          <Button variant='outline' className='w-full' onClick={onBack}>
            <ChevronLeft />
            Go back
          </Button>
        </nav>

        <ul className={s.settingsList}>
          <li className={s.settingsItem}>
            <section className={s.section}>
              <SectionHeading
                title='Basic information'
                subtitle='View and update your personal details and account information.'
              />
              <UserInformationForm />
            </section>
          </li>

          <li className={s.settingsItem}>
            <section className={s.section}>
              <SectionHeading title='Change password' subtitle='Update your password to keep your account secure.' />
              <ChangePasswordForm />
            </section>
          </li>

          <li className={s.settingsItem}>
            <section className={s.section}>
              <SectionHeading
                title='Avatar'
                subtitle='Avatar is your profile picture - everyone who visits your profile will see this.'
              />
              <ChangeAvatarDialog />
            </section>
          </li>

          <li className={s.settingsItem}>
            <section className={s.section}>
              <SectionHeading title='Sign out' subtitle='We’ll miss you! Tap the button to sign out.' />
              <Button variant='destructive' className='w-max'>
                Sign out
              </Button>
            </section>
          </li>
        </ul>
      </main>
    </div>
  );
};
