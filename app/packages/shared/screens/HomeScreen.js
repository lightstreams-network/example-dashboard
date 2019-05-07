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
import { ArtistContentList, ArtistProfileCard } from '../components/Artist'

import ConfirmationOverlay from "../components/Overlay/ConfirmationOverlay";
import MessageOverlay from "../components/Overlay/MessageOverlay";
import RequestPasswordOverlay from "../components/Overlay/RequestPasswordOverlay";
import LoadingOverlay from "../components/Overlay/LoadingOverlay";

import { logoutAction } from '../store/actions/session';
import { getEtherAddress, getLethToken, isSessionInitialized, getSessionArtistToken } from '../store/selectors/session';
import { getArtistWallet } from '../store/selectors/wallet';
import { updateWalletAction, updateTokenBalance } from '../store/actions/wallet';
import {
    purchaseContentAction,
    downloadItemAction,
    loadArtistProfile,
    loadExclusiveContent
} from '../store/actions/artist';

import Style from '../styles'

class HomeScreen extends Component {

    state = { requestConfirmation: null, notificationModal: null, requestPassword: null };

    static propTypes = {
        navigation: PropTypes.object.isRequired,
        session: PropTypes.object.isRequired,
        artist: PropTypes.object.isRequired,
        wallet: PropTypes.object.isRequired,
        dispatch: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
        const { navigation } = props;
        const notificationMsg = _.get(navigation.state, 'params.message', null);
        if (notificationMsg) {
            this.state.notificationModal = {
                infoMsg: notificationMsg,
                onClose: () => {
                    this.setState({ notificationModal: null }, () => {
                        this.props.navigation.navigate('Home');
                    });
                }
            };
        }
    }

    componentDidUpdate(preProps) {
        const { session, dispatch } = this.props;
        if (!isSessionInitialized(session)) {
            this.props.navigation.navigate('Login');
        } else if (!isSessionInitialized(preProps.session)) {
            dispatch(updateWalletAction());
            dispatch(updateTokenBalance());
            dispatch(loadArtistProfile());
            dispatch(loadExclusiveContent());
        }
    }

    logout = () => {
        const { dispatch } = this.props;
        dispatch(logoutAction());
    };

    purchaseItem = (item, password) => {
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

    _requestPassword(message, onReady) {
        this.setState({
            requestPassword: {
                message,
                onPasswordReady: (pwd) => {
                    this.setState({ requestPassword: null }, () => {
                        onReady(pwd);
                    });
                },
                onReject: () => {
                    this.setState({ requestPassword: null });
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
        const { wallet, artist, dispatch, session } = this.props;
        const { requestConfirmation, notificationModal, requestPassword, isLoading } = this.state;
        const artistWallet = getArtistWallet(wallet, getSessionArtistToken(session));

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
                <RequestPasswordOverlay
                    visible={requestPassword !== null}
                    onReady={requestPassword && requestPassword.onPasswordReady}
                    message={requestPassword && requestPassword.message}
                    onClose={requestPassword && requestPassword.onReject}
                />
                <LoadingOverlay visible={isLoading}/>

                <ScrollView style={rootStyles.mainContainer}>
                    <ArtistProfileCard
                        artist={artist}
                        artistWallet={artistWallet}
                        navigation={this.props.navigation}
                        onWalletClick={() => {
                            dispatch(updateTokenBalance(artist.tokenSymbol))
                        }}/>
                    <ArtistContentList
                        items={artist.exclusive_content}
                        isTokenHolder={artistWallet.balance > 0}
                        purchaseAction={(item) => {
                            this._requestPassword(
                                'Insert your password to proceed with the purchase',
                                password => {
                                    this.purchaseItem(item, password)
                                }
                            )
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
    const { session, artist, wallet } = state;
    return {
        session,
        artist,
        wallet
    }
};

export default connect(mapStateToProps)(HomeScreen);