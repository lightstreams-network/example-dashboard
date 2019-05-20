import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { ROUTE_LOGIN } from '../constants';
import { IfNotAuthRedirectTo } from '../components/auth';
import Logo from '../components/logo';
import CopyToClipboard from '../components/copy-to-clipboard';
import Dropzone from '../components/dropzone';
import FileList from '../components/file-list';
import PendingList from '../components/pending-list';
import UserFileList from '../components/user-file-list';

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
    Select,
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
        {({
              user, token, balance, files,
              clearStorage, fetchWalletBalance, fetchItemList, uploadFile, fetchUserItemList, grantAccess, revokeAccess,
              requestAccess, getFileData
          }) => {
            const [hasLoadedBefore, setHasLoadedBefore] = useState(false);
            const [title, setTitle] = useState('');
            const [description, setDescription] = useState('');
            const [file, setFile] = useState(null);
            const [grantUsername, setGrantUsername] = useState('');
            const [fromUsername, setFromUsername] = useState('');
            const [fromUserFiles, setFromUserFiles] = useState([]);
            const [grantFileId, setGrantFileId] = useState(null);
            const [isUploading, setIsUploading] = useState(false);
            const [isGranting, setIsGranting] = useState(false);
            const [isFetchingUser, setIsFetchingUser] = useState(false);

            const refreshUser = () => {
                fetchWalletBalance({ token });
                fetchItemList({ token });
            };

            useEffect(() => {
                if (!hasLoadedBefore) {
                    setHasLoadedBefore(true);
                    fetchWalletBalance({ token });
                    fetchItemList({ token, ethAddress: user.ethAddress });
                }
            });

            return (
                <Container>
                    <Wrapper>
                        <Header className='w-100'>
                            <Logo className='big' url='/'/>
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
                                <H3>Welcome {user.username}!</H3>
                                <P>This page demonstrates how you can upload file to your smart vault.</P>
                            </Section>
                            <Section>
                                <H3>Your Wallet</H3>
                                <CopyToClipboard initialText={user.ethAddress}/>
                                <P>Please make sure you have the password for this address, as there is no other way to
                                    recover the account.</P>

                                <H3>Your Balance</H3>
                                <P>{parseFloat(balance).toFixed(2)} PHT</P>
                            </Section>
                            <Section>
                                <H3>Grant Access</H3>
                                <Label>
                                    <span className='w-20'>Username:</span>
                                    <Input className='w-30' type='text'
                                           onChange={(e) => setGrantUsername(e.target.value)}
                                           value={grantUsername}/>
                                </Label>
                                <Label>
                                    <span className='w-20'>File:</span>
                                    <Select className='w-50' onChange={(e) => setGrantFileId(e.target.value)}>
                                        <option value=''>Select a file</option>
                                        {
                                            Object.values(files).map(fileItem => {
                                                return <option
                                                    value={fileItem.id}>{fileItem.id} - {fileItem.title}</option>;
                                            })
                                        }
                                    </Select>
                                </Label>
                                <Button onClick={() => {
                                    setIsGranting(true);
                                    grantAccess({
                                        token,
                                        itemId: grantFileId,
                                        toUsername: grantUsername
                                    }).finally(() => {
                                        setGrantUsername('');
                                        setGrantFileId(null);
                                        setIsGranting(false);
                                    });
                                }} disabled={isGranting}> {isGranting ? 'Granting' : 'Grant'} </Button>
                            </Section>
                            <Section>
                                <H3>Upload a new file</H3>
                                <br/>
                                <Label><span className='w-20'>Title:</span>
                                    <Input className='w-30' type='text' onChange={(e) => setTitle(e.target.value)}
                                           value={title}/>
                                </Label>
                                <Label><span className='w-20'>Description:</span>
                                    <Input className='w-50' type='text' onChange={(e) => setDescription(e.target.value)}
                                           value={description}/>
                                </Label>
                                <Dropzone user={user} onAddFile={(fileItem) => setFile(fileItem)}
                                          onFinish={refreshUser}/>
                                <br/>
                                <Button onClick={() => {
                                    setIsUploading(true);
                                    uploadFile({ token, file, description, title }).finally(() => {
                                        setTitle('');
                                        setDescription('');
                                        setFile(null);
                                        setIsUploading(false);
                                    });
                                }} disabled={isUploading}> {isUploading ? 'Uploading' : 'Upload'} </Button>
                            </Section>
                            <Section>
                                <H3>Pending requests</H3>
                                <PendingList
                                    user={user}
                                    onAccept={({ itemId, username }) => {
                                        grantAccess({ token, itemId, toUsername: username });
                                    }}
                                    onReject={({ itemId, username }) => {
                                        revokeAccess({ token, itemId, toUsername: username });
                                    }}
                                    requests={Object.values(files).reduce((acum, fileItem) => {
                                        const pendingPerUser = fileItem.events.reduce((acum2, e) => {
                                            if (e.status === 'pending') {
                                                acum2[e.from] = e;
                                                acum2[e.from].item_id = fileItem.id;
                                            } else if (typeof acum2[e.to] !== 'undefined') {
                                                delete acum2[e.to];
                                            }
                                            return acum2;
                                        }, {});
                                        return acum.concat(Object.values(pendingPerUser));
                                    }, [])}/>
                            </Section>
                            <Section>
                                <H3>My Files</H3>
                                <FileList user={user} downloadFile={(itemId) => {
                                    getFileData({ token, itemId, username: user.username });
                                }} revokeAccess={({ itemId, username }) => {
                                    revokeAccess({ token, itemId, toUsername: username });
                                }} files={files}/>
                            </Section>
                            <Section>
                                <H3>Other user files</H3>
                                <Label>
                                    <span className='w-20'>Username:</span>
                                    <Input className='w-30' type='text'
                                           onChange={(e) => setFromUsername(e.target.value)}
                                           value={fromUsername}/>
                                </Label>
                                <Button onClick={() => {
                                    setIsFetchingUser(true);
                                    fetchUserItemList({ token, username: fromUsername })
                                        .then(res => {
                                            setFromUserFiles(res.data);
                                        }).finally(() => {
                                            setIsFetchingUser(false);
                                        });
                                }} disabled={isFetchingUser}> {isFetchingUser ? 'Fetching' : 'Fetch'} </Button>
                                <UserFileList user={user} downloadFile={(itemId) => {
                                    getFileData({ token, itemId, username: fromUsername });
                                }} requestAccess={(itemId) => {
                                    requestAccess({ token, itemId, toUsername: fromUsername });
                                }} files={fromUserFiles}/>
                            </Section>
                            <Section>
                                <P><span className='em'>Are you a developer?</span> <StyledA
                                    href="https://docs.lightstreams.network">Check out the documentation</StyledA></P>
                            </Section>
                        </Box>

                    </Wrapper>
                </Container>
            );
        }}
    </IfNotAuthRedirectTo>
);

export default Dashboard;
