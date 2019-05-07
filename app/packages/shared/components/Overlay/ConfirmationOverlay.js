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
        onReject: PropTypes.func,
        onAccept: PropTypes.func,
        msg: PropTypes.string,
        visible: PropTypes.bool.isRequired
    };

    render() {
        const { onAccept, onReject } = this.props;

        return (
            <View style={[rootStyles.overlay, { top: window.pageYOffset }]}>
                <Overlay
                    isVisible={this.props.visible}
                    overlayStyle={{
                        maxWidth: 400,
                        maxHeight: 400
                    }}
                >
                    <View style={styles.container}>
                        <View style={styles.textContainer}>
                            <Image style={styles.icon}
                                   source={{ uri: 'https://img.icons8.com/bubbles/40/000000/ginger-man-question-mark.png' }}/>
                            <Text style={styles.infoText}> {this.props.msg} </Text>
                        </View>
                        <TouchableHighlight style={[styles.buttonContainer, styles.acceptButton]}
                                            onPress={onAccept || (() => {})}>
                            <Text style={styles.signUpText}>Accept</Text>
                        </TouchableHighlight>
                        <TouchableHighlight style={[styles.buttonContainer, styles.cancelButton]}
                                            onPress={onReject || (() => {})}>
                            <Text style={styles.signUpText}>Cancel</Text>
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
        width: 250,
        marginBottom: 40,
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
        width: 250,
        borderRadius: 30,
    },
    acceptButton: {
        backgroundColor: Style.Palette.DarkBlue,
        marginBottom: 20,
    },
    cancelButton: {
        backgroundColor: Style.Palette.ErrorRed,
    }
});

export default MessageOverlay;
