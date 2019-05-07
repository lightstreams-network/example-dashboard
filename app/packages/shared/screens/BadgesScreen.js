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
    Platform
} from 'react-native';

import {
    PricingCard,
} from 'react-native-elements'

import Header, { NavigationBadge } from '../components/Navigation/Header'
import Footer, { LightStreamsLogoBadge } from '../components/Navigation/Footer'
import RequestPasswordOverlay from "../components/Overlay/RequestPasswordOverlay";
import ConfirmationOverlay from "../components/Overlay/ConfirmationOverlay";
import LoadingOverlay from "../components/Overlay/LoadingOverlay";
import MessageOverlay from "../components/Overlay/MessageOverlay";

import Style from "../styles";

import { requestFaucetTransfer, purchaseCoins } from '../store/actions/wallet';

class BadgesScreen extends Component {
    state = {
        isLoading: false,
        requestPassword: false,
        errMsg: null,
        infoMsg: null,
        onPasswordReady: () => {
        }
    };

    static propTypes = {
        navigation: PropTypes.object.isRequired,
        session: PropTypes.object.isRequired,
        artist: PropTypes.object.isRequired,
        wallet: PropTypes.object.isRequired,
        dispatch: PropTypes.func.isRequired
    };

    getFreeFunds = () => {
        const { dispatch, navigation } = this.props;
        this.setState({
            isLoading: true
        }, () => {
            dispatch(requestFaucetTransfer())
                .then(() => {
                    this.setState({
                        isLoading: false
                    })
                }).then(() => {
                    navigation.navigate('Home');
                }).catch((err) => {
                    this.setState({
                        errMsg: err.message,
                        isLoading: false
                    })
                });
        });
    };

    purchaseToken = (amount) => {
        const { dispatch, navigation } = this.props;
        this.setState({
            requestPassword: true,
            onPasswordReady: (pwd) => {
                this.setState({
                    isLoading: true,
                    onPasswordReady: () => {},
                    requestPassword: false,
                }, () => {
                    dispatch(purchaseCoins(amount, pwd))
                        .then((jsonResponse) => {
                            this.setState({
                                errMsg: null,
                                isLoading: false
                            }, () => {
                                navigation.navigate('Home', {
                                    message: `Thanks for your support. You got ${jsonResponse.coins} coins`
                                });
                            });
                        }).catch((err) => {
                            this.setState({
                                infoMsg: null,
                                errMsg: err.message,
                                isLoading: false
                            })
                        });
                });
            }
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

    render() {
        const { wallet, artist, navigation } = this.props;
        const { isLoading, requestPassword, errMsg, infoMsg, requestConfirmation } = this.state;
        console.log(`Platform.OS`, Platform.OS);
        return (
            <View style={rootStyles.rootContainer}>
                <Header
                    leftBadge={<NavigationBadge label={'Home'} screenId={'Home'} navigation={navigation}/>}
                />
                {
                    requestConfirmation
                        ? <ConfirmationOverlay
                            visible={true}
                            msg={requestConfirmation.msg}
                            onAccept={requestConfirmation.onAccept}
                            onReject={requestConfirmation.onReject}
                        /> : null
                }
                <RequestPasswordOverlay
                    visible={requestPassword}
                    onReady={this.state.onPasswordReady}
                    message={'Insert you password to proceed with the purchase'}
                    onClose={() => {
                        this.setState({
                            requestPassword: false
                        })
                    }}
                />
                <LoadingOverlay visible={isLoading}/>
                <MessageOverlay visible={errMsg !== null || infoMsg !== null} errorMsg={errMsg} infoMsg={infoMsg}
                                onClose={() => this.setState({ errMsg: null, infoMsg: null })}/>
                <View style={rootStyles.mainContainer}>
                    <PricingCard
                        color={Style.Palette.GoldenYellow}
                        title={`0.11 ${wallet.appTokenSymbol}`}
                        price='Free'
                        onButtonPress={() => {
                            this._requestUserConfirmation(
                                'You are about to be awarded with 0.11 ETH. Remember, this will be available only once',
                                (() => this.getFreeFunds()),
                                (() => {
                                }),
                            );
                        }}
                        info={['Welcome Bonus', 'Get free exclusive content']}
                        button={{ title: 'CLICK NOW !', icon: 'flight-takeoff' }}
                    />
                    <PricingCard
                        color={Style.Palette.DarkBlue}
                        title={`Buy ~500 ${artist.tokenSymbol}`}
                        price={`0.10 ${wallet.appTokenSymbol}`}
                        onButtonPress={() => {
                            this.purchaseToken(0.1)
                        }}
                        info={['Get free exclusive content', 'Support your fan !']}
                        button={{ title: 'BUY', icon: 'flight-takeoff' }}
                    />
                </View>
                <Footer rightBadge={<LightStreamsLogoBadge/>}/>
            </View>
        )
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

export default connect(mapStateToProps)(BadgesScreen);