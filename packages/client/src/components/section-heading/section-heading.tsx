import s from './section-heading.module.css';

type HeaderProps = {
  title?: string | number;
  subtitle?: string | number;
};

export const SectionHeading = ({ title, subtitle }: HeaderProps) => {
  return (
    <div className={s.sectionHeading}>
      {title && <h3 className={s.sectionTitle}>{title}</h3>}
      {subtitle && <h4 className={s.sectionSubtitle}>{subtitle}</h4>}
    </div>
  );
};
