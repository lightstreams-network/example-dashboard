import React, { Fragment, useState, useRef } from 'react';
import copy from 'copy-to-clipboard';
import PropTypes from 'prop-types';
import {
    Button,
    Input,
    Flex
} from '../elements';

const CopyToClipboard = ({ initialText }) => {
    const [text] = useState(initialText);
    const [textCopied, setTextCopied] = useState(false);
    const inputRef = useRef(null);

    return (
        <Fragment>
            <Flex>
                <Input className='w-80' ref={inputRef} onFocus={(e) => {
                    e.target.select();
                }} value={text} readOnly />
                <Button
                    className='w-20'
                    onClick={() => {
                        inputRef.current.focus();
                        copy(text);
                        setTextCopied(true);
                        setTimeout(() => {
                            setTextCopied(false);
                        }, 300);
                    }}
                    disabled={ textCopied }>{textCopied ? 'Copied' : 'Copy'}
                </Button>
            </Flex>
        </Fragment>
    );
};

CopyToClipboard.propTypes = {
    initialText: PropTypes.string
};

CopyToClipboard.defaultProps = {
    initialText: null
};

export default CopyToClipboard;
