const { JWT_SECRET, FAUCET_PWD, FAUCET_ADDRESS } = process.env;

module.exports = {
    jwt: {
        secret: JWT_SECRET,
        options: {
            session: false
        }
    },
    faucet: {
        address: FAUCET_ADDRESS,
        pwd: FAUCET_PWD
    }
};
