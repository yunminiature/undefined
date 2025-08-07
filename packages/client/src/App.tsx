import { useEffect } from 'react';
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

function App() {
  useEffect(() => {
    const fetchServerData = async () => {
      const url = `http://localhost:${__SERVER_PORT__}`;
      const response = await fetch(url);
      const data = await response.json();
      console.log(data);
    };

    fetchServerData();
  }, []);

  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path='login' element={<Login />} />
            <Route path='register' element={<Register />} />
            <Route path='game' element={<Game />} />
            <Route path='leaderboard' element={<Leaderboard />} />
            <Route path='forum' element={<Forum />} />
            <Route path='forum/:topicId' element={<ForumTopic />} />
            <Route path='*' element={<NotFound />} />
          </Route>
          <Route path='profile' element={<SettingsPage />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </Provider>
  );
}

export default App;
