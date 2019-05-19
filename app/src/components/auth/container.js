import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { isAuthenticated, getAuthenticatedUser, getUserToken, clearStoredState } from '../../store/auth';
import { lethStorageAdd, getWalletBalance, lethWalletBalance, lethItemList, lethAclGrant, getLethFiles, lethStorageFetch, getFileDataUrl } from '../../store/leth';
import { getIpfsRoom, getIpfsPeers, getIpfsMessages, broadcast } from '../../store/ipfs';

// see https://frontarm.com/james-k-nelson/passing-data-props-children/

const mapStateToProps = (state) => {
    return {
        isAuthenticated: isAuthenticated(state),
        user: getAuthenticatedUser(state),
        token: getUserToken(state),
        balance: getWalletBalance(state),
        files: getLethFiles(state),
        room: getIpfsRoom(state),
        peers: getIpfsPeers(state),
        messages: getIpfsMessages(state),
        fileDataUrl: getFileDataUrl(state)
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        clearStorage() {
            dispatch(clearStoredState());
        },
        addFiles({ account, password, files }) {
            dispatch(lethStorageAdd({ account, password, files }));
        },
        fetchWalletBalance({ethAddress, token}) {
            dispatch(lethWalletBalance({ethAddress, token}));
        },
        fetchItemList({ ethAddress, token }) {
            dispatch(lethItemList({ ethAddress, token }));
        },
        broadcastMessage(room, message) {
            dispatch(broadcast(room, message));
        },
        grantAccess({ acl, ownerAccount, password, toAccount, permissionType }) {
            dispatch(lethAclGrant({ acl, ownerAccount, password, toAccount, permissionType }));
        },
        getFileData({ token, itemId, username }) {
            dispatch(lethStorageFetch({ token, itemId, username }));
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
