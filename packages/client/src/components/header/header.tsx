import s from './header.module.css';

type HeaderProps = {
  title?: string | number;
  subtitle?: string | number;
};

export const Header = ({ title, subtitle }: HeaderProps) => {
  return (
    <div className={s.container}>
      <p className={s.logo}>2048</p>
      <div className={s.group}>
        {title && <h2 className={s.title}>{title}</h2>}
        {subtitle && <p className={s.subtitle}>{subtitle}</p>}
      </div>
    </div>
  );
};
