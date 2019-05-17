import React from 'react';
import { Container, Wrapper, StyledLink, Box, Section } from '../components/elements';
import Logo from '../components/logo';
import { IfAuth, IfNotAuth, IfAuthRedirectTo } from '../components/auth';
import { ROUTE_DASHBOARD } from '../constants';

// import {
//     FirebaseContext
// } from '../components/firebase';

const Home = () => (
    <IfAuthRedirectTo route={ROUTE_DASHBOARD}>
        {() => (
            <Container className='vertical-center'>
                <Wrapper>
                    <Logo className='big' url='/' />
                    <IfAuth>
                        <StyledLink to='/dashboard'>Dashboard</StyledLink>
                    </IfAuth>
                    <IfNotAuth>
                        <StyledLink to='/login'>Login</StyledLink>
                        <StyledLink to='/register'>Create account</StyledLink>
                    </IfNotAuth>
                </Wrapper>
            </Container>
        )}
    </IfAuthRedirectTo>
);

export default Home;
