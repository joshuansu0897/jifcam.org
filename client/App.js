import React, { Component } from 'react';
import { Provider } from 'react-redux';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { createStore, applyMiddleware } from 'redux';
import HomePage from './containers/home';
import LoginPage from './containers/admin/login';
import HeaderSection from './containers/admin/header';
import DashboardPage from './containers/admin/dashboard';
import ImportPage from './containers/admin/import';
import VideosPage from './containers/admin/videos';
import VerificationMailPage from './containers/admin/verification-mail';


import createSagaMiddleware from 'redux-saga';
import { composeWithDevTools } from 'redux-devtools-extension';
import reducer from './reducers';
import actionsSaga from './sagas';
import MasterVideoList from './containers/admin/MasterVideoList';


const sagaMiddleware = createSagaMiddleware();
const store = createStore(reducer, composeWithDevTools(applyMiddleware(sagaMiddleware)));


sagaMiddleware.run(actionsSaga);

class App extends Component {
    render() {
        return (<Provider store={store}>
            <Route path="/" exact component={HomePage} />
            <Route path="/admin" exact component={LoginPage} />
            <Route path="/admin/*" component={HeaderSection} />
            <Switch>
                <Route path="/admin/dashboard/"  component={DashboardPage} />
                <Route path="/admin/video/list"  component={MasterVideoList} />
                <Route path="/admin/import"  component={ImportPage} />
                <Route path="/admin/users/:id/videos" component={VideosPage} />
                <Route path="/admin/mails" component={VerificationMailPage} />
            </Switch>
        </Provider>)
    }
}

export default App;