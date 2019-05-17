import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const Container = styled.div`
    display: flex;
    justify-content: center;
    width: 100%;
    min-height: 100vh;
    font-family: 'Lato', sans-serif;
    background: #242e37;

    &.vertical-center {
        align-items: center;
    }
`;

export const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 992px;
`;

export const Title = styled.h1`
    color: #fff;
    font-size: 2.5rem;
    font-weight: 700;
    margin: 20px 0;
`;

export const Paragraph = styled.p`
    color: #fff;
    font-size: 1rem;
`;

export const StyledLink = styled(Link)`
    color: var(--pink);
`;

// export const Input = styled.input`
//     border: 1px solid #efefef;
//     padding: 20px;
// `;

// export const Button = styled.button`
//     background: #45ba82;
//     padding: 15px 30px;
//     border-radius: 5px;
//     border-right: 2px solid #2e7c56;
//     border-bottom: 2px solid #2e7c56;
//     text-align: center;
//     font-weight: 700;
//     color: #fff;
//     cursor: pointer;

//     &:active {
//         border-right: 2px solid transparent;
//         border-bottom: 2px solid transparent;
//     }

//     &:disabled {
//         background: #c1e8d5;
//         border-right: 2px solid transparent;
//         border-bottom: 2px solid transparent;
//         cursor: wait;
//     }
// `;

export const Flex = styled.div`
    display: flex;

    &.wrap {
        flex-wrap: wrap;
    }

`;

export const H2 = styled.h2`
    font-size: 32px;
    margin-bottom: 6px;

    &.tl {
        text-align: left;
    }
`;

export const H3 = styled.h3`
    font-size: 21px;
    color: var(--dark-purple);

    &.fw4 {
        font-weight: 400;
    }

    &.mb {
        margin-bottom: 6px;
    }
`;
export const H4 = styled.h4`
    font-size: 36px;
    color: #fff

    &.mv {
        margin: 10px 0;
    }
`;

export const P = styled.p`
    color: var(--dark-purple);
    margin: 15px 0;
    font-size: 19px;
    font-weight: ${props => props.bold ? '700' : '400'}

    & .thin {
        font-weight: 300;
    }

    & .em {
        font-weight: 700;
    }
`;

export const Span = styled.span`
    &.thin {
        font-weight: 300;
    }

    &.em {
        font-weight: 700;
    }
`;

export const Box = styled.div`
    background: #fff;
    box-shadow: 0 0 3px rgba(0, 0, 0, 0.32);
    border-radius: 6px;
`;

export const Section = styled.div`
    padding: 30px;
    border-bottom: 1px solid #f5f5f5;

    &.pt {
        padding: 45px 30px;
    }
`;

export const Label = styled.label`
    color: var(--dark-purple);
    font-size: 19px;
    font-weight: 700;
    margin-bottom: 19px;
    display: block;

    & span {
        display: inline-block;
        padding: 0 0 5px 30px;
    }
`;

export const Input = styled.input`
    border: 1px solid #312452;
    border-radius: 100px;
    padding: 15px 30px;
    width: 100%;
    margin-right: 10px
    font-size: 21px;
`;

export const Button = styled.button`
    border: 1px solid var(--green);
    background-color: var(--green);
    border-radius: 40px;
    padding: 15px 30px;
    width: 100%;
    font-size: 21px;
    cursor: pointer;

    &:disabled {
        cursor: auto;
    }
`;