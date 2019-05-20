import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { ROUTE_LOGIN } from '../constants';
import { IfNotAuthRedirectTo } from '../components/auth';
import Logo from '../components/logo';
import CopyToClipboard from '../components/copy-to-clipboard';
import Dropzone from '../components/dropzone';
import FileList from '../components/file-list';

import {
    Container,
    Wrapper,
    StyledLink,
    H3,
    P,
    Flex,
    Box,
    Section,
    Input,
    Label,
    Button
} from '../components/elements';

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 15px 0;

    & a {
        display: block;
    }
`;

const StyledA = styled.a`
    color: var(--pink);
`;

const Dashboard = () => (
    <IfNotAuthRedirectTo route={ROUTE_LOGIN}>
        {({ user, token, balance, files, room, peers, messages,
            clearStorage, fetchWalletBalance, fetchItemList, uploadFile, broadcastMessage, grantAccess, getFileData
        }) => {
            const [hasLoadedBefore, setHasLoadedBefore] = useState(false);
            const [title, setTitle] = useState('');
            const [description, setDescription] = useState('');
            const [file, setFile] = useState(null);
            const [isUploading, setIsUploading] = useState(false);

            const refreshUser = () => {
                fetchWalletBalance({ token, ethAddress: user.ethAddress});
                fetchItemList({ token, ethAddress: user.ethAddress });
            };

            useEffect(() => {
                if (!hasLoadedBefore) {
                    setHasLoadedBefore(true);
                    fetchWalletBalance({ token, ethAddress: user.ethAddress });
                    fetchItemList({ token, ethAddress: user.ethAddress });
                }
            });

            return (
                <Container>
                    <Wrapper>
                        <Header className='w-100'>
                            <Logo className='big' url='/' />
                            <Flex>
                                <StyledLink onClick={(e) => {
                                    e.preventDefault();
                                    clearStorage();
                                }} to='/logout'>Logout
                                </StyledLink>
                            </Flex>
                        </Header>
                        <Box>
                            <Section>
                                <H3>Welcome!</H3>
                                <P>This page demonstrates how you can upload file to your smart vault.</P>
                            </Section>
                            <Section>
                                <H3>Peers ({peers.length + 1})</H3>
                                {peers.map(peer => <div key={peer}>{peer}</div>)}
                            </Section>
                            <Section>
                                <H3>Messages</H3>
                                {messages.map(message => <div key={message}>{message}</div>)}
                                <button
                                    type='submit'
                                    onClick={(e) => {
                                        e.preventDefault();
                                        broadcastMessage(room, (new Date()).toISOString());
                                    }}
                                >Broadcast time
                                </button>
                            </Section>

                            <Section>
                                <H3>Your Wallet</H3>
                                <CopyToClipboard initialText={user.ethAddress} />
                                <P>Please make sure you have the password for this address, as there is no other way to recover the account.</P>

                                <H3>Your Balance</H3>
                                <P>{parseFloat(balance).toFixed(2)} PHT</P>
                            </Section>
                            <Section>
                                <H3>Upload a new file</H3>
                                <br/>
                                <Label><span className='w-20'>Title:</span>
                                <Input className='w-30' type='text' onChange={(e) => setTitle(e.target.value)} value={title}/>
                                </Label>
                                <Label><span className='w-20'>Description:</span>
                                <Input className='w-50' type='text' onChange={(e) => setDescription(e.target.value)} value={description}/>
                                </Label>
                                <Dropzone user={user} onAddFile={(fileItem) => setFile(fileItem)} onFinish={refreshUser} />
                                <br />
                                <Button onClick={() => {
                                    setIsUploading(true);
                                    uploadFile({token, file, description, title}).finally(() => {
                                        setTitle('');
                                        setDescription('');
                                        setFile(null);
                                        setIsUploading(false);
                                    });
                                }} disabled={isUploading}> {isUploading ? 'Uploading' : 'Upload' } </Button>
                            </Section>
                            <Section>
                                <H3>Files</H3>
                                <FileList user={user} downloadFile={(itemId) => {
                                    getFileData({token, itemId, username: user.username });
                                }} grantAccess={grantAccess} files={files} />
                            </Section>
                            <Section>
                                <P><span className='em'>Are you a developer?</span> <StyledA href="https://docs.lightstreams.network">Check out the documentation</StyledA></P>
                            </Section>
                        </Box>

                    </Wrapper>
                </Container>
            );
        }}
    </IfNotAuthRedirectTo>
);

export default Dashboard;
