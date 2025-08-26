import React from 'react';
import { render, screen } from '@testing-library/react';
import { SectionHeading } from './SectionHeading';

describe('SectionHeading', () => {
  it('should render no headings when neither title nor subtitle is provided', () => {
    render(<SectionHeading />);
    expect(screen.queryByRole('heading', { level: 3 })).toBeNull();
    expect(screen.queryByRole('heading', { level: 4 })).toBeNull();
  });

  it('should render title and subtitle when provided', () => {
    render(<SectionHeading title='Section' subtitle='Subsection' />);
    expect(screen.getByRole('heading', { level: 3, name: 'Section' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 4, name: 'Subsection' })).toBeInTheDocument();
  });

  it('should render only title when subtitle is not provided', () => {
    render(<SectionHeading title='Only Title' />);
    expect(screen.getByRole('heading', { level: 3, name: 'Only Title' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { level: 4 })).toBeNull();
  });

  it('should render only subtitle when title is not provided', () => {
    render(<SectionHeading subtitle='Only Subtitle' />);
    expect(screen.queryByRole('heading', { level: 3 })).toBeNull();
    expect(screen.getByRole('heading', { level: 4, name: 'Only Subtitle' })).toBeInTheDocument();
  });

  it('should render a numeric title (e.g., 123)', () => {
    render(<SectionHeading title={123} />);
    expect(screen.getByRole('heading', { level: 3, name: '123' })).toBeInTheDocument();
  });

  it('should not render title when value is 0 (current falsy logic)', () => {
    render(<SectionHeading title={0} />);
    expect(screen.queryByRole('heading', { level: 3 })).toBeNull();
  });

  it('should not render subtitle when value is an empty string (current falsy logic)', () => {
    render(<SectionHeading subtitle='' />);
    expect(screen.queryByRole('heading', { level: 4 })).toBeNull();
  });
});
