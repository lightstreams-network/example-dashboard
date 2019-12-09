import React from 'react';
import Logo from '../components/logo';
import LoginForm from '../components/form/login';
import { Container, Wrapper, StyledLink, Box, Section } from '../components/elements';
import { IfAuthRedirectTo } from '../components/auth';
import { ROUTE_DASHBOARD, ROUTE_REGISTER } from '../constants/routes';

const Login = () => (
    <IfAuthRedirectTo route={ROUTE_DASHBOARD}>
        {() => (
            <Container className='vertical-center'>
                <Wrapper>
                    <Logo className='big' url='/' />
                    <Box className='w-50'>
                        <Section className='pt'>
                            <LoginForm url='/login' />
                        </Section>
                    </Box>
                    <StyledLink to={ROUTE_REGISTER}>Don\'t have an account? Create it</StyledLink>
                </Wrapper>
            </Container>
        )}
    </IfAuthRedirectTo>
);

export default Login;
