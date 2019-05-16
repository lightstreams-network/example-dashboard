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

class UploadFileOverlay extends Component {
  state = {
    title: null,
    description: null,
    file: null
  };

  static propTypes = {
    onReady: PropTypes.func,
    onClose: PropTypes.func,
    visible: PropTypes.bool.isRequired,
    message: PropTypes.string
  };

  readyAction = () => {
    // UPLOAD FILE
    this.props.onReady();
  };

  render() {
    const { message } = this.props;
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
            {
              message
                ? <View style={styles.textContainer}>
                  <Image style={styles.msgIcon}
                         source={{ uri: 'https://img.icons8.com/bubbles/40/000000/ginger-man-question-mark.png' }}/>
                  <Text style={styles.msgText}> {message} </Text>
                </View> : null
            }
            <View style={styles.inputContainer}>
              <TextInput style={styles.inputs}
                         placeholder="Title"
                         autoFocus={true}
                         underlineColorAndroid='transparent'
                         onChangeText={(title) => this.setState({ title })}/>
            </View>
            <View style={styles.inputContainer}>
              <TextInput style={styles.inputs}
                         placeholder="Description"
                         autoFocus={true}
                         underlineColorAndroid='transparent'
                         onChangeText={(description) => this.setState({ description })}/>
            </View>
            <View style={styles.inputContainer}>
              <TextInput style={styles.inputs}
                         placeholder="File"
                         autoFocus={true}
                         underlineColorAndroid='transparent'
                         onChangeText={(file) => this.setState({ file })}/>
            </View>

            <TouchableHighlight style={[styles.buttonContainer, styles.acceptButton]}
                                onPress={() => this.readyAction()}>
              <Text style={styles.signUpText}>Upload</Text>
            </TouchableHighlight>
            <TouchableHighlight style={[styles.buttonContainer, styles.cancelButton]}
                                onPress={() => this.props.onClose()}>
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
    borderRadius: 30,
    width: 250,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  msgText: {},
  msgIcon: {
    width: 55,
    height: 55,
    marginLeft: 15,
    justifyContent: 'center'
  },
  inputContainer: {
    borderBottomColor: '#F5FCFF',
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    borderBottomWidth: 1,
    width: 250,
    height: 45,
    marginBottom: 30,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputs: {
    height: 45,
    marginLeft: 20,
    borderBottomColor: '#FFFFFF',
    flex: 1,
  },
  inputIcon: {
    width: 30,
    height: 30,
    marginLeft: 15,
    justifyContent: 'center'
  },
  buttonContainer: {
    height: 45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    width: 250,
    borderRadius: 30,
  },
  acceptButton: {
    backgroundColor: Style.Palette.DarkBlue,
  },
  cancelButton: {
    backgroundColor: Style.Palette.DarkGray,
  },
  signUpText: {
    color: 'white',
  }
});

export default UploadFileOverlay;
