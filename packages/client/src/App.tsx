import { BrowserRouter, Routes, Route } from 'react-router-dom';

import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
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
import { SignInPage } from './pages/SignIn';
import { SignUpPage } from './pages/SignUp';

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path='game' element={<Game />} />
            <Route path='leaderboard' element={<Leaderboard />} />
            <Route path='forum' element={<Forum />} />
            <Route path='forum/:topicId' element={<ForumTopic />} />
            <Route path='error/400' element={<Error400 />} />
            <Route path='error/500' element={<Error500 />} />
          </Route>

          <Route element={<AuthLayout />}>
            <Route path='sign-up' element={<SignUpPage />} />
            <Route path='sign-in' element={<SignInPage />} />
            <Route path='profile' element={<SettingsPage />} />
          </Route>

          <Route path='*' element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </Provider>
  );
}

export default App;
