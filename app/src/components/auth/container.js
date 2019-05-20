import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { isAuthenticated, getAuthenticatedUser, getUserToken, clearStoredState } from '../../store/auth';
import { lethStorageAdd, getWalletBalance, lethWalletBalance, lethItemList, lethFileGrant, lethUserItemList,
    lethFileRevoke, getLethFiles, lethStorageFetch, getFileDataUrl, lethFileRequestAccess } from '../../store/leth';

// see https://frontarm.com/james-k-nelson/passing-data-props-children/

const mapStateToProps = (state) => {
    return {
        isAuthenticated: isAuthenticated(state),
        user: getAuthenticatedUser(state),
        token: getUserToken(state),
        balance: getWalletBalance(state),
        files: getLethFiles(state),
        fileDataUrl: getFileDataUrl(state)
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        clearStorage() {
            dispatch(clearStoredState());
        },
        uploadFile({ token, title, description, file }) {
            return dispatch(lethStorageAdd({ token, title, description, file }));
        },
        fetchWalletBalance({ethAddress, token}) {
            return dispatch(lethWalletBalance({ethAddress, token}));
        },
        fetchItemList({ token }) {
            return dispatch(lethItemList({ token }));
        },
        fetchUserItemList({ username, token }) {
            return dispatch(lethUserItemList({ username, token }));
        },
        grantAccess({ token, itemId, toUsername }) {
            return dispatch(lethFileGrant({ token, itemId, toUsername }));
        },
        revokeAccess({ token, itemId, toUsername }) {
            return dispatch(lethFileRevoke({ token, itemId, toUsername }));
        },
        requestAccess({ token, itemId, toUsername }) {
            return dispatch(lethFileRequestAccess({ token, itemId, toUsername }));
        },
        getFileData({ token, itemId, username }) {
            return dispatch(lethStorageFetch({ token, itemId, username }));
        }
    };
};

const AuthContainer = ({ children, ...props }) => (
    <Fragment>
        {children(props)}
    </Fragment>
);

AuthContainer.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
        PropTypes.func
    ]).isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(AuthContainer);
