import React from 'react';
import ReactDOM from 'react-dom';
import { Route, Link, BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import App from './components/App';
import reducers from './reducers';

const routing = (
    <Router>
      <div>
        <Route exact path="/" component={App} />
      </div>
    </Router>
  )


const store = createStore(reducers, applyMiddleware(thunk));
ReactDOM.render(
    <Provider store = {store}>
     <App />
    </Provider>,
    document.querySelector('#root')
);

