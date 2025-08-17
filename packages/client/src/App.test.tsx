/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-var-requires */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { Outlet } from 'react-router-dom';

jest.mock('./store', () => {
  const store = {
    getState: jest.fn(() => ({})),
    dispatch: jest.fn(),
    subscribe: jest.fn(() => jest.fn()),
    replaceReducer: jest.fn(),
  };
  return { store };
});

jest.mock('./layouts/MainLayout', () => {
  return {
    __esModule: true,
    default: () => (
      <div data-testid='main-layout'>
        <Outlet />
      </div>
    ),
  };
});

jest.mock('./layouts/AuthLayout', () => {
  return {
    __esModule: true,
    AuthLayout: () => (
      <div data-testid='auth-layout'>
        <Outlet />
      </div>
    ),
  };
});

jest.mock('./pages/Home', () => ({ __esModule: true, default: () => <div>HomePage</div> }));
jest.mock('./pages/Game', () => ({ __esModule: true, default: () => <div>GamePage</div> }));
jest.mock('./pages/Leaderboard', () => ({ __esModule: true, default: () => <div>LeaderboardPage</div> }));
jest.mock('./pages/Forum/Forum', () => ({ __esModule: true, default: () => <div>ForumPage</div> }));
jest.mock('./pages/Forum/ForumTopic', () => ({ __esModule: true, default: () => <div>ForumTopicPage</div> }));
jest.mock('./pages/NotFound', () => ({ __esModule: true, default: () => <div>NotFoundPage</div> }));
jest.mock('./pages/Error400', () => ({ __esModule: true, default: () => <div>Error400Page</div> }));
jest.mock('./pages/Error500', () => ({ __esModule: true, default: () => <div>Error500Page</div> }));
jest.mock('./pages', () => ({
  __esModule: true,
  SettingsPage: () => <div>SettingsPage</div>,
  CreateTopic: () => <div>CreateTopicPage</div>,
}));
jest.mock('./pages/SignIn', () => ({ __esModule: true, SignInPage: () => <div>SignInPage</div> }));
jest.mock('./pages/SignUp', () => ({ __esModule: true, SignUpPage: () => <div>SignUpPage</div> }));

jest.mock('./components/ui/sonner', () => ({ __esModule: true, Toaster: () => <div data-testid='toaster' /> }));

describe('App routing (primitive)', () => {
  beforeEach(() => {
    window.history.pushState({}, '', '/');
  });

  it('should render Home on "/" route', () => {
    const App = require('./App').default;
    render(<App />);
    expect(screen.getByText('HomePage')).toBeInTheDocument();
    expect(screen.getByTestId('main-layout')).toBeInTheDocument();
    expect(screen.getByTestId('toaster')).toBeInTheDocument();
  });

  it('should render ForumTopic on "/forum/topic/:id"', () => {
    const App = require('./App').default;
    window.history.pushState({}, '', '/forum/topic/42');
    render(<App />);
    expect(screen.getByText('ForumTopicPage')).toBeInTheDocument();
  });

  it('should render SignIn on "/sign-in" inside AuthLayout', () => {
    const App = require('./App').default;
    window.history.pushState({}, '', '/sign-in');
    render(<App />);
    expect(screen.getByText('SignInPage')).toBeInTheDocument();
    expect(screen.getByTestId('auth-layout')).toBeInTheDocument();
  });

  it('should render NotFound on unknown route', () => {
    const App = require('./App').default;
    window.history.pushState({}, '', '/unknown');
    render(<App />);
    expect(screen.getByText('NotFoundPage')).toBeInTheDocument();
  });
});
