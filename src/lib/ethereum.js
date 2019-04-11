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
  'kether': '1000000000000000000000',
  'grand': '1000000000000000000000',
  'einstein': '1000000000000000000000',
  'mether': '1000000000000000000000000',
  'gether': '1000000000000000000000000000',
  'tether': '1000000000000000000000000000000'
};

const getValueOfUnit = function(unit) {
  unit = unit ? unit.toLowerCase() : 'ether';
  var unitValue = unitMap[unit];
  if (unitValue === undefined) {
    throw new Error(globalFuncs.errorMsgs[4] + JSON.stringify(unitMap, null, 2));
  }
  return new BigNumber(unitValue, 10);
};

module.exports.toWei = (number, unit) => {
  var returnValue = new BigNumber(this.toWei(number, unit)).div(getValueOfUnit('ether'));
  return returnValue.toString(10);
};

module.exports.toEth = (number, unit) => {
  var returnValue = new BigNumber(String(number)).times(getValueOfUnit(unit));
  return returnValue.toString(10);
};
