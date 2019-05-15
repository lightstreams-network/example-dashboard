import React, { Component } from "react";
import PropTypes from 'prop-types';

import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image
} from 'react-native';

import {
    Header,
    Card,
    Badge
} from 'react-native-elements'

import Style from '../../styles'

const defaultOnPress = () => {};

export const LogoutBadge = class Wallet extends Component {
    static propTypes = {
        onLogout: PropTypes.func.isRequired
    };

    render() {
        const { onLogout } = this.props;

        return (
            <Badge
                component={TouchableOpacity}
                onPress={onLogout}
                containerStyle={{
                    backgroundColor: 'transparent',
                    flexDirection: 'row',
                    alignItems: 'center'
                }}
            >
                <Text style={rootStyles.headerText}>Exit</Text>
            </Badge>
        )
    }
};

export const NavigationBadge = class Wallet extends Component {
    static propTypes = {
        label: PropTypes.string.isRequired,
        screenId: PropTypes.string.isRequired,
        navigation: PropTypes.object.isRequired
    };

    render() {
        const { screenId, navigation } = this.props;

        return (
            <Badge
                component={TouchableOpacity}
                onPress={() => navigation.navigate(screenId)}
                containerStyle={{
                    backgroundColor: 'transparent',
                    flexDirection: 'row',
                    alignItems: 'center'
                }}
            >
                <Image style={{
                    width: 30,
                    height: 30,
                    marginRight: 5
                }} source={{ uri: 'https://img.icons8.com/ultraviolet/40/000000/circled-left.png' }}/>
            </Badge>
        )
    }
};

export const WalletBadge = class Wallet extends Component {
    static propTypes = {
        wallet: PropTypes.object.isRequired,
        onClick: PropTypes.func
    };

    render() {
        const { onClick, wallet } = this.props;

        return (
            <Badge
                component={TouchableOpacity}
                onPress={onClick || defaultOnPress}
                containerStyle={{
                    backgroundColor: 'transparent',
                    flexDirection: 'row',
                    alignItems: 'center'
                }}
            >
                <Text style={[rootStyles.headerText, {
                    width: 400,
                    fontSize: 12,
                    textAlign: 'right'
                }]}>{`${wallet.address}`}</Text>
                <Image style={{
                    width: 30,
                    height: 30,
                    marginLeft: 5
                }} source={{ uri: 'https://img.icons8.com/ultraviolet/50/000000/wallet.png' }}/>
            </Badge>
        )
    }
};


export default class AppHeader extends Component {

    static propTypes = {
        rightBadge: PropTypes.object,
        leftBadge: PropTypes.object
    };

    render() {
        const { rightBadge, leftBadge } = this.props;
        return (
            <Header
                rightComponent={rightBadge || null}
                leftComponent={leftBadge || null}
                containerStyle={rootStyles.topBar}
            />
        )
    }
}

const rootStyles = StyleSheet.create(Style.Root);