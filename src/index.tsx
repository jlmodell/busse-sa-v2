import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router } from 'react-router-dom';
// import history from './history'
import './assets/main.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import { ApolloClient, DefaultOptions } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { ApolloProvider } from '@apollo/react-hooks';

// const cache = new InMemoryCache({
//     dataIdFromObject: object => {
//       // FIXME: workaround buggy apollo cache, dont cache certain types at all!
//       switch (object.__typename) {
//         case 'SaleID':
//           return `${Math.floor(Math.random() * 1000000)}`;
//         default:
//           return defaultDataIdFromObject(object) // fall back to default handling
//       }
//     }
//   })
const link = new HttpLink({
  uri: 'http://104.200.28.226:4000/graphql'
})

const defaultOptions: DefaultOptions = {
    watchQuery: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'ignore',
    },
    query: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
  }

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link,
  defaultOptions
})

ReactDOM.render(<ApolloProvider client={client}><Router><App /></Router></ApolloProvider>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
