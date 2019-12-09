import React from 'react';
import { connect } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import styled from 'styled-components';
import { login, getAuthenticatedUser, getAuthErrors } from '../../store/auth';
import { validateAccount, validatePassword } from '../../lib/validators';
import { Button, Label } from '../elements';
import get from 'lodash.get';

const StyledField = styled(Field)`
    border: 1px solid var(--silver);
    border-radius: 100px;
    padding: 15px 30px;
    width: 100%;
    margin-bottom: 5px;
    font-size: 21px;
`;
const StyledErrorMessage = styled(ErrorMessage)`
    color: #ec4c47;
    padding-left: 30px;
`;

const Actions = styled.div`
    text-align: center;
`;

const LoginForm = ({ user, authErrors, handleSubmit }) => {
    const buttonText = 'Sign in';
    const buttonTextSubmitting = 'Signing in';

    return (
        <Formik
            initialValues={{ username: get(user, ['username'], null) , password: '', server: '' }}
            validate={values => ({ ...validateAccount(values), ...validatePassword(values) })}
            onSubmit={(values, { setSubmitting, setErrors }) => {
                handleSubmit(values)
                    .catch(err => {
                        setErrors({
                            server: err.message
                        });
                    })
                    .finally(() => {
                        setSubmitting(false);
                    });
            }}
        >
            {({ isSubmitting, setFieldValue }) => (
                <Form>
                    <Label>
                        <span>Username</span>
                        <StyledField
                            type='text'
                            name='username'
                            placeholder='your username'
                            onChange={(e) => setFieldValue('username', e.target.value)}
                        />
                        <StyledErrorMessage name='username' component='div' />
                    </Label>
                    <Label>
                        <span>Password</span>
                        <StyledField type='password' name='password' placeholder='Your password' />
                        <StyledErrorMessage name='password' component='div' />
                    </Label>
                    <Actions>
                        <Button type='submit' disabled={ isSubmitting }>
                            {isSubmitting ? buttonTextSubmitting : buttonText}
                        </Button>
                        <StyledErrorMessage name='server' component='div'/>
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
        handleSubmit({ username, password }) {
            return dispatch(login({ username, password }));
        }
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LoginForm);

