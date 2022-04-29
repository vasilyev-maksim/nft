import React from 'react';
import ReactDOM from 'react-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { App } from './App';
import './index.css';
// import { ReactQueryDevtools } from 'react-query/devtools';
import { getCollections } from './api';

const queryClient = new QueryClient();

getCollections().then(collections => {
  ReactDOM.render(
    <QueryClientProvider client={queryClient}>
      <App collections={collections} />
      {/* <ReactQueryDevtools /> */}
    </QueryClientProvider>,
    document.getElementById('root'),
  );
});
