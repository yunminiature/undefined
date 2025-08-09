import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import MainLayout from './layouts/MainLayout'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import Game from './pages/Game'
import Leaderboard from './pages/Leaderboard'
import Forum from './pages/Forum'
import ForumTopic from './pages/ForumTopic'
import NotFound from './pages/NotFound'
import Error400 from './pages/Error400'
import Error500 from './pages/Error500'

import './App.css'

function App() {
  useEffect(() => {
    const fetchServerData = async () => {
      const url = `http://localhost:${__SERVER_PORT__}`
      const response = await fetch(url)
      const data = await response.json()
      console.log(data)
    }

    fetchServerData()
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="profile" element={<Profile />} />
          <Route path="game" element={<Game />} />
          <Route path="leaderboard" element={<Leaderboard />} />
          <Route path="forum" element={<Forum />} />
          <Route path="forum/:topicId" element={<ForumTopic />} />
          <Route path="error/400" element={<Error400 />} />
          <Route path="error/500" element={<Error500 />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
