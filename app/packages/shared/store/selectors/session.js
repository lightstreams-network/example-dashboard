
export const isSessionInitialized = (session) => {
    if (!session.token) {
        return false;
    }

    return true;
};

export const getSessionToken = (session) => {
    return session.token;
};

export const getSessionArtistToken = (session) => {
    return session.artistTokenSymbol;
};

export const getLethToken = (session) => {
    if (!isSessionInitialized(session)) {
        throw new Error('User is not initialized');
    }
    const { user } = session;
    return user.leth_token;
};

export const getEtherAddress = (session) => {
    if (!isSessionInitialized(session)) {
        throw new Error('User is not initialized');
    }
    const { user } = session;
    return user.eth_address;
};