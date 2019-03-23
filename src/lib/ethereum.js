
const decimalFactor = 10 ** 18;

// @TODO Use BigNumber libraries or replace by Web3js
module.exports.etherToWei = (ethAmount) => {
    return ethAmount * decimalFactor
};

module.exports.weiToEth = (weiAmount) => {
    return (weiAmount / decimalFactor).toFixed(2)
};