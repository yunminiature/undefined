import { useEffect } from 'react';
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
      <div className='app'>
        <SettingsPage />
      </div>
      <Toaster />
    </Provider>
  );
}

export default App;
