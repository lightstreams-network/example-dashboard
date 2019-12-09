import React from 'react';
import styled from 'styled-components';
import { P } from '../elements';

const SocialShare = styled(
    ({ className }) => {
        return (
            <div className={className}>
                <P>Or share with:</P>
                <ul>
                    <li>
                        <a href='/#whatsapp'><img src={require('../../img/whatsapp.png')} alt="Share on WhatsApp"/></a>
                    </li>
                    <li>
                        <a href='/#facebook'><img src={require('../../img/facebook.png')} alt="Share on Facebook"/></a>
                    </li>
                    <li>
                        <a href='/#twitter'><img src={require('../../img/twitter.png')} alt="Share on Twitter"/></a>
                    </li>
                    <li>
                        <a href='/#linkedin'><img src={require('../../img/linkedin.png')} alt="Share on Linkedin"/></a>
                    </li>
                    <li>
                        <a href='/#email'><img src={require('../../img/email.png')} alt="Share via Email"/></a>
                    </li>
                </ul>
            </div>
        );
    }
)`
    display: flex;
    justify-content: space-between;
    padding-top: 25px;

    & ul {
        list-style-type: none;
        display: flex;
        flex-wrap: wrap;
        margin: 0;
    }

    & li a {
        background-color: #f5f5f5;
        padding: 15px;
        border-radius: 30px;
        display: inline-block;
    }
`;

export default SocialShare;
