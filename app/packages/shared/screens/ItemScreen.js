import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    Button,
    Platform,
    ScrollView
} from 'react-native';

import {
    Avatar,
} from 'react-native-elements'

import Header, { WalletBadge, LogoutBadge } from '../components/Navigation/Header'
import Footer, { LightStreamsLogoBadge } from '../components/Navigation/Footer'
import { ProfileContentList, ProfileCard } from '../components/Profile'

import ConfirmationOverlay from "../components/Overlay/ConfirmationOverlay";
import MessageOverlay from "../components/Overlay/MessageOverlay";
import RequestPasswordOverlay from "../components/Overlay/RequestPasswordOverlay";
import LoadingOverlay from "../components/Overlay/LoadingOverlay";

import { logoutAction } from '../store/actions/session';
import { getEtherAddress, isSessionInitialized } from '../store/selectors/session';
import { updateWalletAction } from '../store/actions/wallet';
import {
    purchaseContentAction,
    downloadItemAction,
    loadUserProfile
} from '../store/actions/profile';

import Style from '../styles'

class HomeScreen extends Component {

    state = { requestConfirmation: null, notificationModal: null, requestPassword: null };

    static propTypes = {
        navigation: PropTypes.object.isRequired,
        session: PropTypes.object.isRequired,
        profile: PropTypes.object.isRequired,
        item: PropTypes.object.isRequired,
        dispatch: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
    }

    componentDidUpdate(preProps) {

    }

    componentDidMount() {

    }

    logout = () => {
        const { dispatch } = this.props;
        dispatch(logoutAction());
    };

    requestAccess = (item, password) => {
        const { dispatch } = this.props;
        this.setState({
            isLoading: true
        }, () => {
            dispatch(purchaseContentAction(item, password)).catch(err => {
                this._displayNotification(null, err.message);
            }).then(() => {
                this.setState({
                    isLoading: false
                })
            });
        });
    };

    downloadItem = (item) => {
        const { dispatch } = this.props;
        dispatch(downloadItemAction(item)).catch(err => {
            this._displayNotification(null, err.message);
        });
    };

    _requestUserConfirmation(msg, onAccept, onReject) {
        this.setState({
            requestConfirmation: {
                msg,
                onAccept: () => {
                    this.setState({ requestConfirmation: null }, () => {
                        onAccept();
                    });
                },
                onReject: () => {
                    this.setState({ requestConfirmation: null }, () => {
                        onReject();
                    });
                }
            }
        });
    }

    _displayNotification(infoMsg, errorMsg, onClose) {
        this.setState({
            notificationModal: {
                infoMsg,
                errorMsg,
                onClose: () => {
                    this.setState({ notificationModal: null }, () => {
                        if (typeof onClose === 'function') {
                            onClose();
                        }
                    });
                }
            }
        });
    }

    render() {
        const { wallet, profile, dispatch, session } = this.props;
        const { requestConfirmation, notificationModal, requestPassword, isLoading } = this.state;

        if (!isSessionInitialized(session)) {
            setTimeout(() => {
                this.forceUpdate();
            }, 1000);
        }

        return (
            <View style={rootStyles.rootContainer}>
                <Header
                    rightBadge={<WalletBadge wallet={wallet} onClick={() => {
                        this._displayNotification(`Wallet address is \n${getEtherAddress(session)}`,
                            null,
                            () => {
                                dispatch(updateWalletAction())
                            })
                    }}/>}
                    leftBadge={<LogoutBadge onLogout={this.logout}/>}
                />
                <ConfirmationOverlay
                    visible={requestConfirmation !== null}
                    msg={requestConfirmation && requestConfirmation.msg}
                    onAccept={requestConfirmation && requestConfirmation.onAccept}
                    onReject={requestConfirmation && requestConfirmation.onReject}
                />
                <MessageOverlay
                    infoMsg={notificationModal && notificationModal.infoMsg}
                    errorMsg={notificationModal && notificationModal.errorMsg}
                    onClose={notificationModal && notificationModal.onClose}
                    visible={notificationModal !== null}
                />
                <LoadingOverlay visible={isLoading}/>

                <ScrollView style={rootStyles.mainContainer}>
                    <ProfileCard
                        profile={profile}
                        wallet={wallet}
                        navigation={this.props.navigation}
                        onWalletClick={() => {
                            //@TODO Upload new profile picture
                            // dispatch(getEtherAddress(session))
                        }}/>
                    <ProfileContentList
                        items={profile.items}
                        isOwner={true}
                        requestAccessAction={(item) => {
                            // this._requestPassword(
                            //     'Insert your password to proceed with the purchase',
                            //     password => {
                            //         this.purchaseItem(item, password)
                            //     }
                            // )
                        }}
                        downloadAction={(item) => {
                            this._requestUserConfirmation(
                                'You are about to download....',
                                () => {
                                    this.downloadItem(item);
                                },
                                () => {
                                    console.log('Cancelled Download', item);
                                }
                            )
                        }}
                    />
                </ScrollView>
                <Footer rightBadge={<LightStreamsLogoBadge/>}/>
            </View>
        );
    }
}

const rootStyles = StyleSheet.create(Style.Root);

const mapStateToProps = (state) => {
    const { session, profile, wallet } = state;
    return {
        session,
        wallet,
        profile
    }
};

export default connect(mapStateToProps)(HomeScreen);