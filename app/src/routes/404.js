import React from 'react';
import { Container, Wrapper, Title, Paragraph, StyledLink } from '../components/elements';

const Home = () => (
    <Container>
        <Wrapper>
            <Title>
                <span role='img' aria-label='404'>🧶 </span>
                <span>404 Not Found</span>
                <span role='img' aria-label='404'> 🧶</span>
            </Title>

            <Paragraph>Sorry, we could not find the page you requested. <StyledLink to='/'>Try going back</StyledLink></Paragraph>
        </Wrapper>
    </Container>
);

export default Home;
