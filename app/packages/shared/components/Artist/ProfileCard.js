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

export default class ArtistCard extends Component {
    constructor(props) {
        super(props);
    }

    static propTypes = {
        artist: PropTypes.object.isRequired,
        artistWallet: PropTypes.object.isRequired,
        navigation: PropTypes.object.isRequired,
        onWalletClick: PropTypes.func
    };

    render() {
        const { artist, artistWallet, onWalletClick } = this.props;
        return (
            <View style={artistStyles.wrapperArtistProfile}>
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
                            containerStyle={artistStyles.avatar}
                        />
                        <Text style={artistStyles.artistLabel}>{artist.name}</Text>
                    </View>
                    <View style={{
                        flexWrap: "wrap",
                    }}>
                        <View style={artistStyles.walletBox}>
                            <TouchableOpacity onPress={onWalletClick || (() => {})}>
                                <Image style={artistStyles.walletIcon}
                                       source={{ uri: 'https://img.icons8.com/ultraviolet/96/000000/crowdfunding.png' }}/>
                            </TouchableOpacity>
                            <Text style={artistStyles.walletText}>{`${artistWallet.balance} ${artistWallet.symbol}`}</Text>
                        </View>
                        <Button
                            buttonStyle={artistStyles.primaryButton}
                            onPress={() => this.props.navigation.navigate("Badges")}
                            title='BUY'
                        />
                    </View>
                </View>
            </View>
        )
    }
}

const artistStyles = StyleSheet.create(Style.Artist);