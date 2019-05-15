
export const isSessionInitialized = (session) => {
    if (!session.token) {
        return false;
    }

    return true;
};

export const getSessionToken = (session) => {
    return session.token;
};

export const getEtherAddress = (session) => {
    if (!isSessionInitialized(session)) {
        throw new Error('User is not initialized');
    }
    const { user } = session;
    return user.ethAddress;
};