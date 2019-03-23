const { JWT_SECRET, AUTHOR_ACC_PWD, AUTHOR_ACC_PWD } = process.env;

module.exports = {
    jwt: {
        secret: JWT_SECRET,
        options: {
            session: false
        }
    },
    faucet: {
        address: AUTHOR_ACC_PWD,
        pwd: AUTHOR_ACC_PWD
    }
};
