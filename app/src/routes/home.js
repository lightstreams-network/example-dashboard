import React from 'react';
import { Container, Wrapper, StyledLink } from '../components/elements';
import Logo from '../components/logo';
import { IfAuth, IfNotAuth, IfAuthRedirectTo } from '../components/auth';
import { ROUTE_DASHBOARD } from '../constants';


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
