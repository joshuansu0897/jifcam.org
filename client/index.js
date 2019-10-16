import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as WebRouter } from 'react-router-dom';
import App from './App';

const BasicExample = () => (
    <WebRouter>
      <App />
    </WebRouter>
  )

ReactDOM.hydrate(<BasicExample />, document.getElementById('root'));

