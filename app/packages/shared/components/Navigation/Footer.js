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
    Badge
} from 'react-native-elements'

import Style from '../../styles'

export const LightStreamsLogoBadge = class Wallet extends Component {
    static propTypes = {
    };

    render() {
        const { } = this.props;
        return (
            <Badge
                component={TouchableOpacity}
                containerStyle={{
                    backgroundColor: 'transparent',
                    flexDirection: 'row',
                    alignItems: 'center'
                }}
            >
                <Text style={rootStyles.headerText}>Powered by Lightstreams</Text>
            </Badge>
        )
    }
};

export default class AppFooter extends Component {

    static propTypes = {
        rightBadge: PropTypes.object,
        leftBadge: PropTypes.object
    };

    render() {
        const { rightBadge, leftBadge } = this.props;
        return (
            <View style={rootStyles.bottomBar}>
                <View style={rootStyles.barLeftBadge}>
                    {leftBadge || null}
                </View>
                <View style={rootStyles.barRightBadge}>
                    {rightBadge || null}
                </View>
            </View>
        )
    }
}


const rootStyles = StyleSheet.create(Style.Root);