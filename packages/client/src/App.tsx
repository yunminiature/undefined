import { useEffect } from 'react';
import './App.css';
import { SettingsPage } from './pages';

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
    <div className='flex flex-col justify-center items-center w-full'>
      <SettingsPage />
    </div>
  );
}

export default App;
