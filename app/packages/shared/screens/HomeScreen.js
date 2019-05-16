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
import UploadFileOverlay from "../components/Overlay/UploadFileOverlay";
import MessageOverlay from "../components/Overlay/MessageOverlay";
import LoadingOverlay from "../components/Overlay/LoadingOverlay";

import { logoutAction } from '../store/actions/session';
import { getEtherAddress, isSessionInitialized, getSessionUsername } from '../store/selectors/session';
import { updateWalletAction } from '../store/actions/wallet';
import {
    purchaseContentAction,
    downloadItemAction,
    loadUserProfile
} from '../store/actions/profile';

import Style from '../styles'

class HomeScreen extends Component {

    state = { requestConfirmation: null, notificationModal: null, uploadingFile: null };

    static propTypes = {
        navigation: PropTypes.object.isRequired,
        session: PropTypes.object.isRequired,
        profiles: PropTypes.object.isRequired,
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
            dispatch(loadUserProfile());
        }
    }

    componentDidMount() {
        const { session, dispatch } = this.props;
        if (isSessionInitialized(session)) {
            dispatch(updateWalletAction());
            dispatch(loadUserProfile());
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

  _uploadingFile(onReady) {
        this.setState({
          uploadingFile: {
                onFileUploaded: (pwd) => {
                    this.setState({ uploadingFile: null }, () => {
                        onReady(pwd);
                    });
                },
                onReject: () => {
                    this.setState({ uploadingFile: null });
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
        const { wallet, profiles, dispatch, session } = this.props;
        const { requestConfirmation, notificationModal, isLoading, uploadingFile } = this.state;

        if (!isSessionInitialized(session)) {
            setTimeout(() => {
                this.forceUpdate();
            }, 1000);

            return <LoadingOverlay visible={true} />
        }

        const username = getSessionUsername(session);
        const profile = profiles[username];

        if (!profile) {
          setTimeout(() => {
            dispatch(loadUserProfile(username));
          }, 1000);
          return <LoadingOverlay visible={true}/>
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
                <UploadFileOverlay
                    visible={uploadingFile !== null}
                    onReady={uploadingFile && uploadingFile.onFileUploaded}
                    onClose={uploadingFile && uploadingFile.onReject}
                />

                <LoadingOverlay visible={isLoading || false}/>

                <ScrollView style={rootStyles.mainContainer}>
                    <ProfileCard
                        profile={profile}
                        navigation={this.props.navigation}
                        onWalletClick={() => {
                            this._uploadingFile(() => {
                                console.log("File was uploaded");
                            })
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
        profiles: profile
    }
};

export default connect(mapStateToProps)(HomeScreen);