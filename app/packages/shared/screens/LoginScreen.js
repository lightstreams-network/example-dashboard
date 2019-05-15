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
import _ from 'lodash';

import { loginAction } from '../store/actions/session';

import Style from '../styles';
import MessageOverlay from "../components/Overlay/MessageOverlay";

class LoginScreen extends Component {

    state = { username: 'profile1', password: 'test123', errMsg: null, infoMsg: null, inputErrors: [''], isLoading: false };

    constructor(props) {
        super(props);
        const { navigation } = props;
        this.state.infoMsg = _.get(navigation.state, 'params.message', null);
    }

    componentDidUpdate() {

        if (this.props.session.token) {
            this.props.navigation.navigate('Home');
        }

        if (this.props.session.user && this.props.session.user.username
            && !this.state.username) {
            this.setState({
                username: this.props.session.user.username
            })
        }
    }

    static propTypes = {
        navigation: PropTypes.object.isRequired,
        session: PropTypes.object.isRequired,
        // loginAction: PropTypes.func.isRequired,
        dispatch: PropTypes.func.isRequired
    };

    validateLogin = () => {
        const { username, password } = this.state;
        const inputErrors = [];
        if (username.length < 6) {
            inputErrors.push('username');
        }

        if (password.length < 6) {
            inputErrors.push('password');
        }

        return inputErrors;
    };

    handleLogin = () => {
        const inputErrors = this.validateLogin();

        if (inputErrors.length > 0) {
            this.setState({
                inputErrors
            });
            return;
        }

        this.setState({
            isLoading: true,
        }, () => {
            const { username, password } = this.state;
            const { dispatch } = this.props;

            dispatch(loginAction(username, password))
                .then(() => {
                    this.setState({
                        isLoading: false,
                    });
                    this.props.navigation.navigate('Home');
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
        const { inputErrors, isLoading, errMsg, infoMsg } = this.state;

        return (
            <View style={styles.container}>
                <MessageOverlay visible={errMsg !== null || infoMsg !== null}
                                errorMsg={errMsg} infoMsg={infoMsg}
                                onClose={() => this.setState({ errMsg: null, infoMsg: null })}/>
                <View style={styles.formContainer} >
                    <Image style={styles.logo}
                           source={require('../assets/fanbase_logo_white_simple.png')}/>
                    <View style={inputErrors.indexOf('email') === -1 ? styles.inputContainer : styles.inputContainerError}>
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
                                   value={this.state.password}
                                   onChangeText={(password) => this.setState({ password })}/>
                    </View>

                    <View style={styles.actionContainer}>
                        {
                            isLoading
                                ? <ActivityIndicator size="large"/>
                                : [
                                    <TouchableHighlight key="login-button" style={[styles.buttonItem, styles.primaryButton]}
                                                        onPress={() => this.handleLogin()}>
                                        <Text style={styles.buttonText}>Log in</Text>
                                    </TouchableHighlight>,
                                    <TouchableHighlight key="register-button" style={styles.buttonItem}
                                                        onPress={() => this.props.navigation.navigate('SignUp')}>
                                        <Text style={styles.primaryLink}>Register</Text>
                                    </TouchableHighlight>
                                ]
                        }
                    </View>
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
    formContainer: {
        marginTop: 80,
        justifyContent: 'center',
        alignItems: 'center',
    },
    actionContainer: {
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
        width: 250,
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
    logo: {
        position: 'relative',
        top: '-50px',
        width: 120,
        height: 120,
        justifyContent: 'center'
    }
});

const mapStateToProps = (state) => {
    const { session } = state;
    return {
        session
    }
};

export default connect(mapStateToProps)(LoginScreen);