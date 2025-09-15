import { Header, SectionHr, SignInForm, SignInWithYandexButton } from '@/components';
import s from './SignIn.module.css';
import { Link } from 'react-router-dom';
import { createLucideIcon } from 'lucide-react';

createLucideIcon;

export const SignInPage = () => {
  return (
    <div className={s.page}>
      <section className={s.section}>
        <Header title='Welcome back' subtitle='Enter your credentials to access your account.' />
        <div className={s.container}>
          <div>
            <SignInForm />
            <SectionHr title='or' />
            <SignInWithYandexButton />
          </div>
          <nav className={s.linkGroup}>
            <p className={s.subtitle}>Don’t have an account?</p>
            <Link className={s.link} to='/sign-up'>
              Sign up
            </Link>
          </nav>
        </div>
      </section>
    </div>
  );
};
