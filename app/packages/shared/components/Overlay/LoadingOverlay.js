import React, { Component } from "react";
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    Button,
    TouchableHighlight,
    Image,
    ActivityIndicator,
    Alert
} from 'react-native';
import PropTypes from 'prop-types';

import {
    Overlay,
} from 'react-native-elements'

import Style from "../../styles";

class LoadingOverlay extends Component {
    static propTypes = {
        visible: PropTypes.bool.isRequired
    };

    render() {
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
                        <Text>Loading</Text>
                        <ActivityIndicator size="large"/>
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
    }
});

export default LoadingOverlay;
