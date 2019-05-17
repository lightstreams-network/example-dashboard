import React from 'react';
import { connect } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import styled from 'styled-components';
import { fetchToken, getAuthenticatedUser, getAuthErrors } from '../../store/auth';
import { validateAccount, validatePassword } from '../../lib/validators';
import { Button, Label } from '../elements';

const isLogin = (url) => url.includes('login');

const StyledField = styled(Field)`
    border: 1px solid var(--silver);
    border-radius: 100px;
    padding: 15px 30px;
    width: 100%;
    font-size: 21px;
`;
const StyledErrorMessage = styled(ErrorMessage)`
    color: #ec4c47;
    padding-left: 30px;
`;

const Actions = styled.div`
    text-align: center;
`;

const LoginForm = ({ url, authErrors, handleSubmit }) => {
    const buttonText = 'Sign in';
    const buttonTextSubmitting = 'Signing in';

    return (
        <Formik
            initialValues={{ account: '', password: '' }}
            validate={values => ({ ...validateAccount(values), ...validatePassword(values) })}
            onSubmit={(values, { setSubmitting, setErrors }) => {
                handleSubmit(url, values)
                    .catch(err => {
                        setErrors({
                            account: err.message
                        });
                    })
                    .finally(() => {
                        setSubmitting(false);
                    });
            }}
        >
            {({ isSubmitting, setFieldValue }) => (
                <Form>
                    {isLogin(url) ?
                        <Label>
                            <span>Account address</span>
                            <StyledField
                                type='text'
                                name='account'
                                placeholder='0xBaB8D71E622CB455e6388e20DcE1A8B0F7E13c5A'
                                onChange={(e) => setFieldValue('account', e.target.value)}
                            />
                            <StyledErrorMessage name='account' component='div' />
                        </Label> : null
                    }
                    <Label>
                        <span>Password</span>
                        <StyledField type='password' name='password' placeholder='Your password' />
                        <StyledErrorMessage name='password' component='div' />
                    </Label>
                    <Actions>
                        <Button type='submit' disabled={ isSubmitting }>
                            {isSubmitting ? buttonTextSubmitting : buttonText}
                        </Button>
                    </Actions>
                </Form>
            )}
        </Formik>
    );
};

const mapStateToProps = (state) => {
    return {
        user: getAuthenticatedUser(state),
        authErrors: getAuthErrors(state)
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        handleSubmit(url, { account, password }) {
            return dispatch(fetchToken({ account, password }));
        }
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LoginForm);

