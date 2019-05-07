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
    Avatar,
} from 'react-native-elements'

import Style from '../../styles'

class ArtistContentItem extends Component {

    constructor(props) {
        super(props);
    }

    static propTypes = {
        item: PropTypes.object.isRequired,
        isTokenHolder: PropTypes.bool.isRequired,
        purchaseAction: PropTypes.func.isRequired,
        downloadAction: PropTypes.func.isRequired
    };

    renderDownloadOpts(item) {
        return (
            <View style={listStyles.cardBottomContainer}>
                <View style={listStyles.cardBottomSection}>
                    <Image style={listStyles.cardIcon}
                           source={{ uri: 'https://img.icons8.com/dusk/40/000000/download-from-cloud.png' }}/>
                    <Text style={[listStyles.cardSectionLabel, listStyles.downloadNow]}>Download</Text>
                </View>
            </View>
        )
    }

    renderPurchaseOpts(item) {
        return (
            <View style={listStyles.cardBottomContainer}>
                <View style={listStyles.cardBottomSection}>
                    <Image style={listStyles.cardIcon}
                           source={{ uri: 'https://img.icons8.com/ultraviolet/40/000000/add-tag.png' }}/>
                    <Text style={[listStyles.cardSectionLabel, listStyles.buyNow]}>Buy</Text>
                </View>
                <View style={listStyles.cardBottomSection}>
                    <Image style={listStyles.cardIcon}
                           source={{ uri: 'https://img.icons8.com/doodle/50/000000/coins.png' }}/>
                    <Text style={[listStyles.cardSectionLabel, listStyles.price]}>{item.price > 0 ? item.price : 'Free'}</Text>
                </View>
            </View>
        )
    }

    render() {
        const { item, isTokenHolder, purchaseAction, downloadAction } = this.props;
        return (
            <TouchableOpacity
                style={Platform.OS === "android" ? listStyles.cardAndroid : listStyles.card}
                onPress={() => item.is_unlock ? downloadAction(item) : purchaseAction(item)}>
                <View style={listStyles.cardHeader}>
                    <View>
                        <Text style={listStyles.title}>{item.name}</Text>
                    </View>
                </View>
                <Image style={listStyles.cardImage} source={{ uri: item.image_url }}/>
                <View style={listStyles.cardFooter}>
                    {item.is_unlock ? this.renderDownloadOpts(item) : this.renderPurchaseOpts(item)}
                </View>
            </TouchableOpacity>
        )
    }
}

export default class ArtistContentList extends Component {

    constructor(props) {
        super(props);
    }

    static propTypes = {
        items: PropTypes.array,
        isTokenHolder: PropTypes.bool.isRequired,
        purchaseAction: PropTypes.func.isRequired,
        downloadAction: PropTypes.func.isRequired
    };

    render() {
        const { items, isTokenHolder, purchaseAction, downloadAction } = this.props;

        if(!items) {
            return null;
        }

        return (
            <View style={listStyles.container}>
                {items.map((item, index) => <ArtistContentItem
                    item={item}
                    key={index}
                    isTokenHolder={isTokenHolder}
                    purchaseAction={purchaseAction}
                    downloadAction={downloadAction}
                />)}
            </View>
        )
    }
}

const listStyles = StyleSheet.create(Style.FlatList);