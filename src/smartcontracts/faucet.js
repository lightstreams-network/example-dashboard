/**
 * User: ggarrido
 * Date: 11/04/19 17:06
 * Copyright 2019 (c) Lightstreams, Granada
 */


module.exports.requestFreeToken = async (web3, beneficiary) => {
  const { faucet: faucetSC } = smartContract;

  const FaucetContract = web3.eth.contract(faucetSC.abci);
  const Faucet = FaucetContract.at(faucetSC.address);

  try {
    return await Faucet.methods.requestTopUp(beneficiary, {
      from: auth.AUTHOR_ACC,
    });
  } catch(err) {
    console.error(error);
    return null;
  }
};