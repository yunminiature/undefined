import { render, screen } from '@testing-library/react';
import React from 'react';
import { Header } from './Header';

describe('Header', () => {
  it('should always render the "2048" logo', () => {
    const { container } = render(<Header />);
    expect(screen.getByText('2048')).toBeInTheDocument();
    expect(screen.queryByRole('heading', { level: 2 })).toBeNull();
    expect(container.querySelector('.subtitle')).toBeNull();
  });

  it('should render title and subtitle when provided', () => {
    render(<Header title='Title' subtitle='Subtitle' />);
    expect(screen.getByRole('heading', { level: 2, name: 'Title' })).toBeInTheDocument();
    expect(screen.getByText('Subtitle')).toBeInTheDocument();
  });

  it('should render only title when subtitle is not provided', () => {
    const { container } = render(<Header title='Only Title' />);
    expect(screen.getByRole('heading', { level: 2, name: 'Only Title' })).toBeInTheDocument();
    expect(container.querySelector('.subtitle')).toBeNull();
  });

  it('should render only subtitle when title is not provided', () => {
    render(<Header subtitle='Only Subtitle' />);
    expect(screen.queryByRole('heading', { level: 2 })).toBeNull();
    expect(screen.getByText('Only Subtitle')).toBeInTheDocument();
  });

  it('should render a numeric title (e.g., 123)', () => {
    render(<Header title={123} />);
    expect(screen.getByRole('heading', { level: 2, name: '123' })).toBeInTheDocument();
  });

  it('should not render title when value is 0 (current falsy logic)', () => {
    render(<Header title={0} />);
    expect(screen.queryByRole('heading', { level: 2 })).toBeNull();
  });

  it('should not render subtitle when value is an empty string (current falsy logic)', () => {
    const { container } = render(<Header subtitle='' />);
    expect(container.querySelector('.subtitle')).toBeNull();
  });
});
