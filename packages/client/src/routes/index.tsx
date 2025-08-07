import { RouteObject } from 'react-router-dom'

import MainLayout from '../layouts/MainLayout'
import Home from '../pages/Home'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Profile from '../pages/Profile'
import Game from '../pages/Game'
import Leaderboard from '../pages/Leaderboard'
import Forum from '../pages/Forum'
import ForumTopic from '../pages/ForumTopic'
import NotFound from '../pages/NotFound'

export const routes: RouteObject[] = [
  {
    element: <MainLayout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/login', element: <Login /> },
      { path: '/register', element: <Register /> },
      { path: '/profile', element: <Profile /> },
      { path: '/game', element: <Game /> },
      { path: '/leaderboard', element: <Leaderboard /> },
      { path: '/forum', element: <Forum /> },
      { path: '/forum/:topicId', element: <ForumTopic /> },
      { path: '*', element: <NotFound /> },
    ],
  },
  { path: '*', element: <NotFound /> },
]
