import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    Button
} from 'react-native';

import {
    Avatar,
} from 'react-native-elements'


import Style from '../../styles'

export default class ItemCard extends Component {
    constructor(props) {
        super(props);
    }

    static propTypes = {
        profile: PropTypes.object.isRequired,
        wallet: PropTypes.object.isRequired,
        navigation: PropTypes.object.isRequired,
        onWalletClick: PropTypes.func
    };

    render() {
        const { profile, wallet, onWalletClick } = this.props;
        return (
            <View style={profileStyles.wrapperArtistProfile}>
                <View style={{
                    flexDirection: "row",
                }}>
                    <View style={{
                        flexWrap: "wrap",
                    }}>
                        <Avatar
                            rounded
                            size={200}
                            source={{ uri: "https://bootdey.com/img/Content/avatar/avatar6.png" }}
                            onPress={() => console.log("Works!")}
                            activeOpacity={0.7}
                            containerStyle={profileStyles.avatar}
                        />
                        <Text style={profileStyles.usernameLabel}>{profile.name}</Text>
                    </View>
                    <View style={{
                        flexWrap: "wrap",
                    }}>
                        <View style={profileStyles.walletBox}>
                            <TouchableOpacity onPress={onWalletClick || (() => {})}>
                                <Image style={profileStyles.walletIcon}
                                       source={{ uri: 'https://img.icons8.com/ultraviolet/96/000000/crowdfunding.png' }}/>
                            </TouchableOpacity>
                            <Text style={profileStyles.walletText}>{`${wallet.balance.toFixed(2)} PHT`}</Text>
                        </View>
                        <Button
                            buttonStyle={profileStyles.primaryButton}
                            onPress={() => this.props.navigation.navigate("Badges")}
                            title='Upload'
                        />
                    </View>
                </View>
            </View>
        )
    }
}

const profileStyles = StyleSheet.create(Style.Profile);