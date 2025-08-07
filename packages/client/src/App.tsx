import { useEffect } from 'react'
import { useRoutes } from 'react-router-dom'
import { routes } from './routes'
import './App.css'

function App() {
  const element = useRoutes(routes)
  useEffect(() => {
    const fetchServerData = async () => {
      const url = `http://localhost:${__SERVER_PORT__}`
      const response = await fetch(url)
      const data = await response.json()
      console.log(data)
    }

    fetchServerData()
  }, [])

  return element
}

export default App
