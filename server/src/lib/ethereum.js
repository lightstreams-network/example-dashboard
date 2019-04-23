const BigNumber = require('bignumber.js');

const unitMap = {
  'wei': '1',
  'kwei': '1000',
  'ada': '1000',
  'femtoether': '1000',
  'mwei': '1000000',
  'babbage': '1000000',
  'picoether': '1000000',
  'gwei': '1000000000',
  'shannon': '1000000000',
  'nanoether': '1000000000',
  'nano': '1000000000',
  'szabo': '1000000000000',
  'microether': '1000000000000',
  'micro': '1000000000000',
  'finney': '1000000000000000',
  'milliether': '1000000000000000',
  'milli': '1000000000000000',
  'ether': '1000000000000000000',
  'pht': '1000000000000000000',
  'kether': '1000000000000000000000',
  'grand': '1000000000000000000000',
  'einstein': '1000000000000000000000',
  'mether': '1000000000000000000000000',
  'gether': '1000000000000000000000000000',
  'tether': '1000000000000000000000000000000'
};

module.exports.getValueOfUnit = (unit) => {
  unit = unit ? unit.toLowerCase() : 'pht';
  const unitValue = unitMap[unit];
  if (unitValue === undefined) {
    throw new Error(globalFuncs.errorMsgs[4] + JSON.stringify(unitMap, null, 2));
  }
  return new BigNumber(unitValue, 10);
};

module.exports.weiToPht = (number) => {
  return this.toPht(number, 'wei');
};
module.exports.phtToWei = (number) => {
  return this.toWei(number, 'pht');
};

module.exports.toWei = (number, unit) => {
  const returnValue = new BigNumber(String(number)).times(this.getValueOfUnit(unit));
  return returnValue.toString(10);
};

module.exports.toPht = function(number, unit) {
  const returnValue = new BigNumber(this.toWei(number, unit)).div(this.getValueOfUnit('pht'));
  return returnValue.toString(10);
};
