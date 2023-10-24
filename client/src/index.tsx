import { QueryClient, QueryClientProvider } from 'react-query';
import { App } from './App';
import { ReactQueryDevtools } from 'react-query/devtools';
import { createRoot } from 'react-dom/client';
import { getCollections } from './api';

import './index.css';

const queryClient = new QueryClient();

getCollections().then(collections => {
  const container = document.getElementById('root');
  const root = createRoot(container!);
  root.render(
    <QueryClientProvider client={queryClient}>
      <App collections={collections} />
      <ReactQueryDevtools />
    </QueryClientProvider>,
  );
});
