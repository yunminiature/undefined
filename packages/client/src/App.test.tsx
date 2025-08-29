/* eslint-disable @typescript-eslint/no-var-requires */
import React from 'react'
import { render, screen, cleanup } from '@testing-library/react'
import { Outlet } from 'react-router-dom'

// ---- mock redux store ----
jest.mock('./store', () => {
  const store = {
    getState: jest.fn(() => ({})),
    dispatch: jest.fn(),
    subscribe: jest.fn(() => jest.fn()),
    replaceReducer: jest.fn(),
  }
  return { store }
})

// ---- mock layouts that host <Outlet/> ----
jest.mock('./layouts/MainLayout', () => ({
  __esModule: true,
  default: () => (
    <div data-testid="main-layout">
      <Outlet />
    </div>
  ),
}))
jest.mock('./layouts/AuthLayout', () => ({
  __esModule: true,
  AuthLayout: () => (
    <div data-testid="auth-layout">
      <Outlet />
    </div>
  ),
}))

// ---- mock providers / boundaries used ВНУТРИ App ----
// (Пути ДОЛЖНЫ совпадать с импортами в App.tsx)
jest.mock('@/providers', () => ({
  __esModule: true,
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))
jest.mock('@/layouts/BoundaryByRoute', () => ({
  __esModule: true,
  BoundaryByRoute: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))
jest.mock('./components', () => ({
  __esModule: true,
  // ErrorBoundary как прозрачная обёртка
  ErrorBoundary: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  SafeErrorFallback: () => <div data-testid="safe-fallback" />,
  // ProtectedRoute пропускает детей (и игнорит authRoute/redirectTo)
  ProtectedRoute: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

// ---- mock toaster ----
jest.mock('./components/ui/sonner', () => ({
  __esModule: true,
  Toaster: () => <div data-testid="toaster" />,
}))

// ---- mock pages ----
jest.mock('./pages/Home', () => ({ __esModule: true, default: () => <div>HomePage</div> }))
jest.mock('./pages/Game', () => ({ __esModule: true, default: () => <div>GamePage</div> }))
jest.mock('./pages/Leaderboard', () => ({ __esModule: true, default: () => <div>LeaderboardPage</div> }))
jest.mock('./pages/Forum/Forum', () => ({ __esModule: true, default: () => <div>ForumPage</div> }))
jest.mock('./pages/Forum/ForumTopic', () => ({ __esModule: true, default: () => <div>ForumTopicPage</div> }))
jest.mock('./pages/NotFound', () => ({ __esModule: true, default: () => <div>NotFoundPage</div> }))
jest.mock('./pages/Error400', () => ({ __esModule: true, default: () => <div>Error400Page</div> }))
jest.mock('./pages/Error500', () => ({ __esModule: true, default: () => <div>Error500Page</div> }))
jest.mock('./pages', () => ({
  __esModule: true,
  SettingsPage: () => <div>SettingsPage</div>,
  CreateTopic: () => <div>CreateTopicPage</div>,
}))
jest.mock('./pages/SignIn', () => ({ __esModule: true, SignInPage: () => <div>SignInPage</div> }))
jest.mock('./pages/SignUp', () => ({ __esModule: true, SignUpPage: () => <div>SignUpPage</div> }))

describe('App routing (primitive)', () => {
  beforeEach(() => {
    cleanup()
    // старт всегда с корня
    window.history.pushState({}, '', '/')
  })

  it('renders Home on "/" route', () => {
    const App = require('./App').default
    render(<App />)
    expect(screen.getByText('HomePage')).toBeInTheDocument()
    expect(screen.getByTestId('main-layout')).toBeInTheDocument()
    expect(screen.getByTestId('toaster')).toBeInTheDocument()
  })

  it('renders ForumTopic on "/forum/topic/:id"', () => {
    const App = require('./App').default
    window.history.pushState({}, '', '/forum/topic/42')
    render(<App />)
    expect(screen.getByText('ForumTopicPage')).toBeInTheDocument()
    expect(screen.getByTestId('main-layout')).toBeInTheDocument()
  })

  it('renders SignIn inside AuthLayout on "/sign-in"', () => {
    const App = require('./App').default
    window.history.pushState({}, '', '/sign-in')
    render(<App />)
    expect(screen.getByText('SignInPage')).toBeInTheDocument()
    expect(screen.getByTestId('auth-layout')).toBeInTheDocument()
  })

  it('renders NotFound on unknown route', () => {
    const App = require('./App').default
    window.history.pushState({}, '', '/unknown')
    render(<App />)
    expect(screen.getByText('NotFoundPage')).toBeInTheDocument()
  })
})