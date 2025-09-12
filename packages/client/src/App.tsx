import { Routes, Route } from 'react-router-dom';

import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Game from './pages/Game';
import Forum from './pages/Forum/Forum';
import ForumTopic from './pages/Forum/ForumTopic';
import NotFound from './pages/NotFound';

import './App.css';
import { SettingsPage, CreateTopic } from './pages';
import { Toaster } from './components/ui/sonner';
import { AuthLayout } from './layouts/AuthLayout';
import Error400 from './pages/Error400';
import Error500 from './pages/Error500';
import { ErrorBoundary, ProtectedRoute, SafeErrorFallback } from './components';
import { BoundaryByRoute } from '@/layouts/BoundaryByRoute';
import { SignInPage } from './pages/SignIn';
import { SignUpPage } from './pages/SignUp';
import { Leaderboard } from './pages/Leaderboard';
import { AuthProvider } from '@/providers';

function App() {
  return (
    //Глобальный Boundary для отслеживания ошибок роутера, провайдеров, которыми обернуты страницы и т.д.
    <ErrorBoundary fallback={<SafeErrorFallback />}>
      <AuthProvider>
        {/*Boundary для ошибок внутри страниц */}
        <BoundaryByRoute>
          <Routes>
            <Route path='/' element={<MainLayout />}>
              <Route index element={<Home />} />
              <Route
                path='game'
                element={
                  <ProtectedRoute>
                    <Game />
                  </ProtectedRoute>
                }
              />
              <Route
                path='leaderboard'
                element={
                  <ProtectedRoute>
                    <Leaderboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path='forum'
                element={
                  <ProtectedRoute>
                    <Forum />
                  </ProtectedRoute>
                }
              />
              <Route
                path='forum/create'
                element={
                  <ProtectedRoute>
                    <CreateTopic />
                  </ProtectedRoute>
                }
              />
              <Route
                path='forum/topic/:id'
                element={
                  <ProtectedRoute>
                    <ForumTopic />
                  </ProtectedRoute>
                }
              />
              <Route path='error/400' element={<Error400 />} />
              <Route path='error/500' element={<Error500 />} />
            </Route>

            <Route element={<AuthLayout />}>
              <Route
                path='sign-up'
                element={
                  <ProtectedRoute authRoute redirectTo='/'>
                    <SignUpPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path='sign-in'
                element={
                  <ProtectedRoute authRoute redirectTo='/'>
                    <SignInPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path='profile'
                element={
                  <ProtectedRoute>
                    <SettingsPage />
                  </ProtectedRoute>
                }
              />
            </Route>

            <Route path='*' element={<NotFound />} />
          </Routes>
        </BoundaryByRoute>
      </AuthProvider>

      <Toaster />
    </ErrorBoundary>
  );
}

export default App;
