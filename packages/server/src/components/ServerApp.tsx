import { unstable_HistoryRouter as HistoryRouter } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import App from '@/App';

export default function ServerApp({ url }: { url: string }) {
  const history = createMemoryHistory({ initialEntries: [url] });
  return (
    <HistoryRouter history={history as unknown as any}>
      <App />
    </HistoryRouter>
  );
}
