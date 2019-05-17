import React from 'react';
import styled from 'styled-components';

const StyledModal = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width:100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);

    &.display-block {
        display: block;
    }

    &.display-none {
        display: none;
    }

    & .modal-main {
        position:fixed;
        background: white;
        width: 80%;
        height: auto;
        top:50%;
        left:50%;
        transform: translate(-50%,-50%);
    }
`;

export default ({ handleClose, show, children }) => {
    const showHideClassname = show ? 'modal display-block' : 'modal display-none';
    return (
        <StyledModal className={showHideClassname}>
            <section className='modal-main'>
                {children}
                <button onClick={handleClose}>close</button>
            </section>
        </StyledModal>
    );
};

