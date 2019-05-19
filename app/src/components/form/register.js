import React from 'react';
import { connect } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import styled from 'styled-components';
import { createUser, getAuthenticatedUser, getAuthErrors } from '../../store/auth';
import { validatePassword } from '../../lib/validators';
import { Button, Label } from '../elements';

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

const RegisterForm = ({ url, authErrors, handleSubmit }) => {
    const buttonText = 'Create account';
    const buttonTextSubmitting = 'Creating account';

    return (
        <Formik
            initialValues={{ password: '' }}
            validate={values => validatePassword(values)}
            onSubmit={(values, { setSubmitting, setErrors }) => {
                handleSubmit(url, values)
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
            {({ isSubmitting }) => (
                <Form>
                    <Label>
                        <span>Your username</span>
                        <StyledField type='text' name='username' placeholder='Your username'/>
                        <StyledErrorMessage name='username' component='div'/>
                    </Label>
                    <Label>
                        <span>Your Password</span>
                        <StyledField type='password' name='password' placeholder='Your password' />
                        <StyledErrorMessage name='password' component='div' />
                    </Label>
                    <Label>
                        <span>Repeat Password</span>
                        <StyledField type='password' name='password2' placeholder='Repeat password'/>
                        <StyledErrorMessage name='password2' component='div'/>
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
        handleSubmit(url, { username, password }) {
            return dispatch(createUser({ username, password }));
        }
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(RegisterForm);

