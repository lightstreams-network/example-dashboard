
export const isSessionInitialized = (session) => {
    if (!session.token) {
        return false;
    }

    return true;
};

export const getSessionToken = (session) => {
  if (!isSessionInitialized(session)) {
    throw new Error('User is not initialized');
  }
    return session.token;
};

export const getSessionUsername = (session) => {
  if (!isSessionInitialized(session)) {
    throw new Error('User is not initialized');
  }
  const { user } = session;
  return user.username;
};

export const getEtherAddress = (session) => {
    if (!isSessionInitialized(session)) {
        throw new Error('User is not initialized');
    }
    const { user } = session;
    return user.ethAddress;
};