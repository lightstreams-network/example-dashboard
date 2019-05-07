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
        email: '',
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
        const { email, password, repeatPassword } = this.state;
        const inputErrors = [];
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!re.test(String(email).toLowerCase())) {
            inputErrors.push('email');
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
            const { email, password } = this.state;
            dispatch(signUpAction(email, password))
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
                <View
                    style={inputErrors.indexOf('fullName') === -1 ? styles.inputContainer : styles.inputContainerError}>
                    <Image style={styles.textIcon}
                           source={{ uri: 'https://png.icons8.com/male-user/ultraviolet/50/3498db' }}/>
                    <TextInput style={styles.inputs}
                               placeholder="Full name"
                               keyboardType="email-address"
                               underlineColorAndroid='transparent'
                               value={this.state.fullName}
                               onChangeText={(fullName) => this.setState({ fullName })}/>
                </View>

                <View style={inputErrors.indexOf('email') === -1 ? styles.inputContainer : styles.inputContainerError}>
                    <Image style={styles.textIcon}
                           source={{ uri: 'https://png.icons8.com/message/ultraviolet/50/3498db' }}/>
                    <TextInput style={styles.inputs}
                               placeholder="Email"
                               keyboardType="email-address"
                               underlineColorAndroid='transparent'
                               value={this.state.email}
                               onChangeText={(email) => this.setState({ email })}/>
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
                                <TouchableHighlight style={[styles.buttonItem, styles.primaryButton]}
                                                    onPress={() => this.handleSignUp()}>
                                    <Text style={styles.buttonText}>Sign up</Text>
                                </TouchableHighlight>,
                                <TouchableHighlight style={styles.buttonItem}
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