
const decimalFactor = 10 ** 18;

module.exports.etherToWei = (ethAmount) => {
    return ethAmount * decimalFactor
};

module.exports.weiToEth = (weiAmount) => {
    return (weiAmount / decimalFactor).toFixed(2)
};