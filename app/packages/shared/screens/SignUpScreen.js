import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    Button,
    TouchableHighlight,
    Image,
    ActivityIndicator
} from 'react-native';

import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { signUpAction } from '../store/actions/session';

import Style from '../styles'
import MessageOverlay from "../components/Overlay/MessageOverlay";

class SignUpScreen extends Component {

    state = {
        fullName: '',
        username: '',
        password: '',
        errMsg:  null,
        repeatPassword: '',
        inputErrors: [''],
        isLoading: false
    };

    static propTypes = {
        navigation: PropTypes.object.isRequired,
        session: PropTypes.object.isRequired,
        dispatch: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
    }

    componentDidUpdate() {
        const { session } = this.props;
        if (session.token) {
            this.props.navigation.navigate('Home');
        }
    }

    validateSignUp = () => {
        const { username, password, repeatPassword } = this.state;
        const inputErrors = [];
        if (username.length < 4) {
            inputErrors.push('username');
        }

        if (password.length < 6) {
            inputErrors.push('password');
        }

        if (password !== repeatPassword) {
            inputErrors.push('repeatPassword');
        }

        return inputErrors;
    };

    handleSignUp = () => {
        const inputErrors = this.validateSignUp();

        if (inputErrors.length > 0) {
            this.setState({
                inputErrors
            });
            return;
        }

        this.setState({
            isLoading: true,
            inputErrors: []
        }, () => {
            const { dispatch } = this.props;
            const { username, password } = this.state;
            dispatch(signUpAction(username, password))
                .then(() => {
                    this.setState({
                        isLoading: false,
                    });
                    this.props.navigation.navigate('Login', {
                        message: 'Thanks for signing up'
                    });
                })
                .catch((err) => {
                    this.setState({
                        errMsg: err.message,
                        isLoading: false,
                    });
                })
        });
    };

    render() {
        const { inputErrors, isLoading, errMsg } = this.state;

        return (
            <View style={styles.container}>
                <MessageOverlay visible={errMsg !== null} errorMsg={errMsg}
                                    onClose={() => this.setState({ errMsg: null })}/>

                <View style={inputErrors.indexOf('username') === -1 ? styles.inputContainer : styles.inputContainerError}>
                    <Image style={styles.textIcon}
                           source={{ uri: 'https://img.icons8.com/color/48/000000/manager.png' }}/>
                    <TextInput style={styles.inputs}
                               placeholder="Username"
                               underlineColorAndroid='transparent'
                               value={this.state.username}
                               onChangeText={(username) => this.setState({ username: username })}/>
                </View>

                <View
                    style={inputErrors.indexOf('password') === -1 ? styles.inputContainer : styles.inputContainerError}>
                    <Image style={styles.textIcon}
                           source={{ uri: 'https://png.icons8.com/key-2/ultraviolet/50/3498db' }}/>
                    <TextInput style={styles.inputs}
                               placeholder="Password"
                               secureTextEntry={true}
                               underlineColorAndroid='transparent'
                               onChangeText={(password) => this.setState({ password })}/>
                </View>

                <View
                    style={inputErrors.indexOf('repeatPassword') === -1 ? styles.inputContainer : styles.inputContainerError}>
                    <Image style={styles.textIcon}
                           source={{ uri: 'https://img.icons8.com/ultraviolet/50/000000/lock.png' }}/>
                    <TextInput style={styles.inputs}
                               placeholder="Repeat password"
                               secureTextEntry={true}
                               underlineColorAndroid='transparent'
                               onChangeText={(password) => this.setState({ repeatPassword: password })}/>
                </View>

                <View style={styles.actionContainer}>
                    {
                        isLoading
                            ? <ActivityIndicator size="large"/>
                            : [
                                <TouchableHighlight key="sign-up" style={[styles.buttonItem, styles.primaryButton]}
                                                    onPress={() => this.handleSignUp()}>
                                    <Text style={styles.buttonText}>Sign up</Text>
                                </TouchableHighlight>,
                                <TouchableHighlight key="already-an-account" style={styles.buttonItem}
                                                    onPress={() => this.props.navigation.navigate('Login')}>
                                    <Text style={styles.primaryLink}>I already have an account</Text>
                                </TouchableHighlight>
                            ]
                    }
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    ...Style.Form,
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Style.Palette.DarkGray,
    },
    primaryLink: {
        ...Style.Form.primaryLink,
        color: Style.Palette.DarkBlue
    },
    buttonText: {
        ...Style.Form.buttonText,
        color: Style.Palette.BrokenWhite
    },
    primaryButton: {
        ...Style.Form.primaryButton,
        backgroundColor: Style.Palette.DarkBlue
    },
    actionContainer: {
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        width: 250,
    }
});

const mapStateToProps = (state) => {
    const { session } = state;
    return { session }
};

export default connect(mapStateToProps)(SignUpScreen);