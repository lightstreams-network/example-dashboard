export const getArtistWallet = (wallet, artistTokenSymbol) => {
    const artistWallet = wallet
        ? wallet.tokens.find(token => token.symbol === artistTokenSymbol)
        : null;

    if (artistWallet) {
        return artistWallet;
    }

    return {
        balance: 0,
        symbol: artistTokenSymbol
    }
};