import React from 'react';
import styled from 'styled-components';

const ProgressBar = styled(
    ({ className }) => (
        <div className={className} />
    )
)`
    background: #f6f2ef;
    border-radius: 40px;
    height: 40px;
    width: 100%;

    &:after {
        content: '';
        display: block;
        background: #855bf2;
        width: ${props => props.width || '10'}%;
        height: 100%;
        border-radius: 40px 0 0 40px;
    }

`;

export default ProgressBar;
