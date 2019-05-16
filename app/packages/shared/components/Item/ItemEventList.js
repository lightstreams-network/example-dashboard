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

class ProfileContentItem extends Component {

    constructor(props) {
        super(props);
    }

    static propTypes = {
        item: PropTypes.object.isRequired,
        isOwner: PropTypes.bool.isRequired,
        requestAccessAction: PropTypes.func.isRequired,
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
        const { item, isOwner, requestAccessAction, downloadAction } = this.props;
        return (
            <TouchableOpacity
                style={Platform.OS === "android" ? listStyles.cardAndroid : listStyles.card}
                onPress={() => isOwner ? downloadAction(item) : requestAccessAction(item)}>
                <View style={listStyles.cardHeader}>
                    <View>
                        <Text style={listStyles.title}>{item.title}</Text>
                        <Text style={listStyles.description}>{item.description}</Text>
                    </View>
                </View>
                <View style={listStyles.cardFooter}>
                    {isOwner ? this.renderDownloadOpts(item) : this.renderPurchaseOpts(item)}
                </View>
            </TouchableOpacity>
        )
    }
}

export default class ItemEventList extends Component {

    constructor(props) {
        super(props);
    }

    static propTypes = {
        items: PropTypes.array,
        isOwner: PropTypes.bool.isRequired,
        requestAccessAction: PropTypes.func.isRequired,
        downloadAction: PropTypes.func.isRequired
    };

    render() {
        const { items, isOwner, requestAccessAction, downloadAction } = this.props;

        if(!items) {
            return null;
        }

        return (
            <View style={listStyles.container}>
                {items.map((item, index) => <ProfileContentItem
                    item={item}
                    key={index}
                    isOwner={isOwner}
                    requestAccessAction={requestAccessAction}
                    downloadAction={downloadAction}
                />)}
            </View>
        )
    }
}

const listStyles = StyleSheet.create(Style.FlatList);