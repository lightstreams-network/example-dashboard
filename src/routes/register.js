import React from 'react';
import RegisterForm from '../components/form/register';
import {
    Container,
    Wrapper,
    StyledLink,
    Box,
    Section
} from '../components/elements';
import Logo from '../components/logo';
import { IfAuthRedirectTo } from '../components/auth';
import { ROUTE_DASHBOARD } from '../constants';

const Register = () => (
    <IfAuthRedirectTo route={ROUTE_DASHBOARD}>
        {() => (
            <Container className='vertical-center'>
                <Wrapper>
                    <Logo className='big' url='/' />
                    <Box className='w-50'>
                        <Section className='pt'>
                            <RegisterForm url='/register' />
                        </Section>
                    </Box>
                    <StyledLink to='/login'>Already have an account? Login</StyledLink>
                    <StyledLink to='/'>Back</StyledLink>
                </Wrapper>
            </Container>
        )}
    </IfAuthRedirectTo>
);

export default Register;
