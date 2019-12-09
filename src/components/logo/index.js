import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const Logo = styled(
    ({ className, url }) => (
        <Link className={className} to={url}>
            <img src={require('../../img/logo@2x.png')} alt='Fanbase'/>
        </Link>
    )
)`
    &.big {
        width: 135px;
        height: 42px;
        margin-bottom: 40px;
    }

    & img {
        width: 100%;
    }
`;

Logo.propTypes = {
    url: PropTypes.string
};

Logo.defaultProps = {
    url: '/'
};

export default Logo;