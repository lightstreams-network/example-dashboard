import React, { Component } from "react";
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    Button,
    TouchableHighlight,
    Image,
    Alert
} from 'react-native';
import PropTypes from 'prop-types';

import {
    Overlay,
} from 'react-native-elements'

import Style from '../../styles';

class MessageOverlay extends Component {

    static propTypes = {
        onClose: PropTypes.func,
        errorMsg: PropTypes.string,
        infoMsg: PropTypes.string,
        visible: PropTypes.bool.isRequired
    };

    render() {
        return (
            <View style={[rootStyles.overlay, { top: window.pageYOffset }]}>
                <Overlay
                    onBackdropPress={() => this.props.onClose()}
                    isVisible={this.props.visible}
                    overlayStyle={{
                        maxHeight: 400
                    }}
                >
                    <View style={styles.container}>
                        {
                            this.props.errorMsg
                                ? <View style={styles.textContainer}>
                                    <Image style={styles.icon}
                                           source={{ uri: 'https://img.icons8.com/bubbles/100/000000/delete-male-user.png' }}/>
                                    <Text style={styles.errText}> {this.props.errorMsg} </Text>
                                </View> : null
                        }
                        {
                            this.props.infoMsg
                                ? <View style={styles.textContainer}>
                                    <Image style={styles.icon}
                                           source={{ uri: 'https://img.icons8.com/bubbles/100/000000/about-me-female.png' }}/>
                                    <Text style={styles.infoText}> {this.props.infoMsg} </Text>
                                </View>
                                : null
                        }
                        <TouchableHighlight style={[styles.buttonContainer, styles.acceptButton]}
                                            onPress={() => this.props.onClose()}>
                            <Text style={styles.signUpText}>Accept</Text>
                        </TouchableHighlight>
                    </View>
                </Overlay>
            </View>
        );
    }
}

const rootStyles = StyleSheet.create(Style.Root);
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Style.Palette.LightBlue,
    },
    textContainer: {
        borderBottomColor: '#F5FCFF',
        backgroundColor: '#FFFFFF',
        borderRadius: 30,
        borderBottomWidth: 1,
        minWidth: 250,
        maxWidth: '90%',
        marginBottom: 40,
        marginLeft: 10,
        marginRight: 10,
        paddingRight: 10,
        overflowX: 'auto',
        flexDirection: 'row',
        alignItems: 'center',
    },
    errText: {},
    infoText: {},
    icon: {
        width: 55,
        height: 55,
        marginLeft: 15,
        justifyContent: 'center'
    },
    buttonContainer: {
        height: 45,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30,
        marginBottom: 20,
        width: 250,
        borderRadius: 30,
    },
    acceptButton: {
        backgroundColor: Style.Palette.DarkBlue,
    }
});

export default MessageOverlay;
