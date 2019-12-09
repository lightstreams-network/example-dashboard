import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import AuthConnect from './container';
import { ROUTE_HOME, ROUTE_DASHBOARD } from '../../constants/routes';

export const IfAuth = ({ children }) => (
    <AuthConnect>
        { ({ isAuthenticated }) =>
            isAuthenticated ? children : null
        }
    </AuthConnect>
);

export const IfNotAuth = ({ children }) => (
    <AuthConnect>
        { ({ isAuthenticated }) =>
            !isAuthenticated ? children : null
        }
    </AuthConnect>
);

export const IfAuthRedirectTo = ({ route, children }) => (
    <AuthConnect>
        {({ isAuthenticated, ...props }) => {
            return isAuthenticated ? <Redirect to={route} /> : children(props);
        }}
    </AuthConnect>
);

export const IfNotAuthRedirectTo = ({ route, children }) => (
    <AuthConnect>
        {({ isAuthenticated, ...props }) => {
            return !isAuthenticated ? <Redirect to={route} /> : children(props);
        }}
    </AuthConnect>
);

const propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
        PropTypes.func
    ]).isRequired
};

IfAuth.propTypes = propTypes;
IfNotAuth.propTypes = propTypes;
IfAuthRedirectTo.propTypes = {
    ...propTypes,
    route: PropTypes.string
};
IfNotAuthRedirectTo.propTypes = {
    ...propTypes,
    route: PropTypes.string
};

IfAuthRedirectTo.defaultProps = {
    route: ROUTE_HOME
};

IfNotAuthRedirectTo.defaultProps = {
    route: ROUTE_DASHBOARD
};

