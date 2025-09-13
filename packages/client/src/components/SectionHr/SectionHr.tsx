import s from './SectionHr.module.css';

interface SectionHrProps {
  title?: string | number;
}

export const SectionHr = ({ title }: SectionHrProps) => {
  return (
    <div className={s.section}>
      <div className={s.title}>
        <span>{title}</span>
      </div>
    </div>
  );
};
