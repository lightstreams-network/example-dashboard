import React, { useCallback } from 'react';
import {useDropzone} from 'react-dropzone';
import styled from 'styled-components';

const getColor = (props) => {
    if (props.isDragAccept) {
        return '#00e676';
    }
    if (props.isDragReject) {
        return '#ff1744';
    }
    if (props.isDragActive) {
        return '#2196f3';
    }
    return '#eeeeee';
};

const Container = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    border-width: 2px;
    border-radius: 2px;
    border-color: ${props => getColor(props)};
    border-style: dashed;
    background-color: #fafafa;
    color: #bdbdbd;
    outline: none;
    transition: border .24s ease-in-out;
`;

const Dropzone = ({ user, onAddFile }) => {
    const onDrop = useCallback(acceptedFiles => {
        const reader = new FileReader();

        reader.onabort = (err) => console.error(err);
        reader.onerror = (err) => console.error(err);
        reader.onload = () => {
            // Do whatever you want with the file contents
            console.log('File loaded file');
        };

        onAddFile(acceptedFiles[0]);
    }, []);

    const {
        acceptedFiles,
        getRootProps,
        getInputProps,
        isDragActive,
        isDragAccept,
        isDragReject
    } = useDropzone({ onDrop });

    const files = acceptedFiles.map(file => (
        <li key={file.path}>
            {file.path} - {file.size} bytes
        </li>
    ));

    return (
        <Container {...getRootProps({isDragActive, isDragAccept, isDragReject})}>
            <input {...getInputProps()} />
            <p>Drag and drop some files here, or click to select files</p>
            <aside>
                <h4>Files</h4>
                {files[0]}
            </aside>
        </Container>
    );
};

export default Dropzone;
