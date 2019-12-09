import styled from 'styled-components';

const Pill = styled.button`
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    background-color: #fff;
    margin: 5px;
    box-shadow: 0 0 3px rgba(0, 0, 0, 0.32);
    outline: 0;

    &.green {
        background-color: #3affc9;
    }

    &:active {
        box-shadow: none;
    }

    &:active,
    &:focus,
    &::-moz-focus-inner {
        outline: 0;
        border: 0;
    }

    &.small {
        width: 34px;
        height: 34px;
    }
`;

export default Pill;