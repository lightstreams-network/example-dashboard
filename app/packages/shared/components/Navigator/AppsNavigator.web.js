import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppNavigatorSwitch from "./AppNavigatorSwitch.web";
import { View, Text } from 'react-native';
import { Provider } from 'react-redux';
import createStore from '../../store'

export default () => {
    const store = createStore();
    return (
        <Provider store={store}>
            <Router>
                <AppNavigatorSwitch/>
            </Router>
        </Provider>
    );
};
