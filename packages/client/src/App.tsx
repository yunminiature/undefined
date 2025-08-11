import { BrowserRouter, Routes, Route } from 'react-router-dom';

import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Game from './pages/Game';
import Leaderboard from './pages/Leaderboard';
import Forum from './pages/Forum';
import ForumTopic from './pages/ForumTopic';
import NotFound from './pages/NotFound';

import './App.css';
import { SettingsPage } from './pages';
import { Provider } from 'react-redux';
import { store } from './store';
import { Toaster } from './components/ui/sonner';
import { AuthLayout } from './layouts/AuthLayout';
import Error400 from './pages/Error400';
import Error500 from './pages/Error500';
import { ErrorBoundary, SafeErrorFallback } from './components';
import { BoundaryByRoute } from '@/layouts/BoundaryByRoute';

function App() {
  return (
    //Глобальный Boundary для отслеживания ошибок роутера, провайдеров, которыми обернуты страницы и т.д.
    <ErrorBoundary fallback={<SafeErrorFallback />}>
      <Provider store={store}>
        <BrowserRouter>
          {/*Boundary для ошибок внутри страниц */}
          <BoundaryByRoute>
            <Routes>
              <Route path='/' element={<MainLayout />}>
                <Route index element={<Home />} />
                <Route path='login' element={<Login />} />
                <Route path='register' element={<Register />} />
                <Route path='game' element={<Game />} />
                <Route path='leaderboard' element={<Leaderboard />} />
                <Route path='forum' element={<Forum />} />
                <Route path='forum/:topicId' element={<ForumTopic />} />
                <Route path='error/400' element={<Error400 />} />
                <Route path='error/500' element={<Error500 />} />
              </Route>
              <Route element={<AuthLayout />}>
                <Route path='profile' element={<SettingsPage />} />
              </Route>
              <Route path='*' element={<NotFound />} />
            </Routes>
          </BoundaryByRoute>
        </BrowserRouter>

        <Toaster />
      </Provider>
    </ErrorBoundary>
  );
}

export default App;
