import 'babel-core/polyfill';

import React from 'react';
import { Provider } from 'react-redux';
import App from './containers/App';
import configureStore from './store/configureStore';
// import 'todomvc-app-css/index.css';

import * as ipc from 'electron-safe-ipc/guest'

ipc.request('read-todos')
.catch(() => undefined)
.then(initialState => {
  const store = configureStore(initialState);

  store.subscribe(() => {
    ipc.request('write-todos', store.getState())
    .catch(err => console.log(err))
  })

  React.render(
    <Provider store={store}>
      {() => <App />}
    </Provider>,
    document.getElementById('root')
  );
})
