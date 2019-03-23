const { JWT_SECRET, SHELVES_SC_ADD, FAUCET_SC_ADD } = process.env;

module.exports = {
  provider: 'localhost:8545',
  faucetSCAddr: FAUCET_SC_ADD,
  shelvesSCAddr: SHELVES_SC_ADD,
};
