import { Header, SectionHr, SignInWithYandexButton, SignUpForm } from '@/components';
import { Link } from 'react-router-dom';

import s from './SignUp.module.css';

export const SignUpPage = () => {
  return (
    <div className={s.page}>
      <section className={s.section}>
        <Header title='Create your account' subtitle='Your path to 2048 starts here. Save your progress!' />
        <div className={s.container}>
          <div>
            <SignUpForm />
            <SectionHr title='or' />
            <SignInWithYandexButton />
          </div>
          <nav className={s.linkGroup}>
            <p className={s.subtitle}>Already have an account?</p>
            <Link className={s.link} to='/sign-in'>
              Sign in
            </Link>
          </nav>
        </div>
      </section>
    </div>
  );
};
