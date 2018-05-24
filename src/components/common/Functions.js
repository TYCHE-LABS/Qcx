import _ from 'lodash';

//coin string spliter
export const coinTitleTransformer = str => {
  const stringArray = str.split('_');
  const coin = stringArray[0].toString().toUpperCase();
  const fiat = stringArray[1].toString().toUpperCase();

  return { coin, fiat };
};

//fiat color helper
export const fiatColorSelector = fiat => {
  if (fiat === 'CAD') return '#FB3640';
  if (fiat === 'USD') return '#85bb65';
  if (fiat === 'BTC') return '#FF9900';
  if (fiat === 'ETH') return '#2895F9';
  if (fiat === 'LTC') return '#b8b8b8';
  if (fiat === 'BCH') return '#478558';
  if (fiat === 'BTG') return '#EBA808';
};

export const changeColorSelector = change => {
  if (change > 0) return '#73E2A7';
  if (change < 0) return '#FB3640';
  return 'white';
};

export const priceChangeIconSelector = change => {
  if (change > 0) return 'chevron-thin-up';
  if (change < 0) return 'chevron-thin-down';
  return null;
};

export const buySellColorHelper = (buySellTag, key) => {
  return buySellTag ? { [key]: '#73E2A7' } : { [key]: '#FB3640' };
};

//selecting limit or market order border color
export const marketLimitColorHelper = (selectedIndex, key) => {
  //market
  if (selectedIndex === 0) return { [key]: '#F9C80E' };
  //limit
  if (selectedIndex === 1) return { [key]: '#60E1E0' };
};

//take amount of crypto, price (market), limit price, spit out total
//as well as % difference from current market price
export const cryptoTradeTotalCalculator = (amount, price, desiredPrice) => {
  const total = desiredPrice ? amount * desiredPrice : amount * price;
  const percentDifference = (desiredPrice / price - 1) * 100;

  return { total, percentDifference };
};

//displaying numerical digits for wallet
export const numbersDisplay = number => {
  return _.round(number, 8);
};

//value calculator
export const valueCalculator = (ticker, amount, price, usdConversion) => {
  if (!price) return 0;
  if (ticker === 'CAD') return _.round(amount * 1, 2);
  if (ticker === 'USD') return _.round(amount * usdConversion, 2);
  return _.round(amount * price[ticker].CAD, 2);
};

//calculate total value
export const totalValueCalculator = (tickers, price, usdConversion) => {
  if (!price) return 0;
  let totalValue = 0;
  _.map(tickers, (value, key) => {
    if (key === 'usd') return (totalValue += Number(value.balance * usdConversion));
    if (key === 'cad') {
      return (totalValue += Number(value.balance));
    }

    const capitalKey = key.toUpperCase();
    const calculatedValue = Number(value.balance * price[capitalKey].CAD);
    return (totalValue += calculatedValue);
  });
  return _.round(totalValue, 2);
};

//trade type helper
export const tradeTypeHelper = type => {
  switch (type) {
    case 0:
      return 'Deposit';
    case 1:
      return 'Withdrawal';
    case 2:
      return 'Trade';
  }
};

//trade type color helper
export const tradeTypeColorHelper = type => {
  switch (type) {
    case 0:
      return '#73E2A7';
    case 1:
      return '#FB3640';
    case 2:
      return '#2895F9';
  }
};

//transaction hisotry result txnCoinHelper
export const txnCoinHelper = transaction => {
  //if type 0 or 1 (withdrawl or deposit)
  if (transaction.type === 0 || transaction.type === 1) {
    const item = _.omit(transaction, ['datetime', 'fee', 'method', 'type', 'key']);
    const keyArray = Object.keys(item);
    return keyArray[0].toString();
  }

  //if type 2: trade
  if (transaction.type === 2) {
    const item = _.omit(transaction, ['datetime', 'fee', 'id', 'order_id', 'rate', 'type']);
    const keyArray = Object.keys(item);

    const pair = _.find(keyArray, key => {
      if (key.length > 4) return key;
    });

    const keys = coinTitleTransformer(pair);
    return keys;
  }
};

//number validator
export const isNumeric = n => {
  return !isNaN(parseFloat(n)) && isFinite(n);
};
