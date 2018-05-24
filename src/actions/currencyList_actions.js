import axios from 'axios';
import qs from 'qs'; //query strings
import _ from 'lodash';
import { coinTitleTransformer } from '../components/common';
import {
  FETCH_COINS,
  FETCHING_COINS,
  FETCHING_COINS_SUCCESS,
  FETCHING_COINS_FAILED,
  FETCH_HISTORICAL_DATA,
  FETCH_HISTORICAL_DATA_SUCCESS,
  FETCH_HISTORICAL_DATA_FAILED,
} from './types';

//QuadrigaCX
const ROOT_URL = 'https://api.quadrigacx.com/v2/';
const CURRENT_TRADING_URL = `${ROOT_URL}ticker?book=`;

//CRYPTO_COMPARE
const CC_ROOT_URL = 'https://min-api.cryptocompare.com/data/';

//Crypto Compare url helper
const buildFetchUrl = (dateType, coin, fiat, limit) => {
  const cryptoCompareParams = {
    fsym: coin, //from symbol
    tsym: fiat, //to symbol
    e: 'quadrigacx', //name of exchange
    limit,
  };

  const params = qs.stringify({ ...cryptoCompareParams });

  if (dateType) return `${CC_ROOT_URL}${dateType}?${params}`;

  return `${CC_ROOT_URL}histominute?${params}`;
};

//fetching trading information based on the pair choosen
export const fetchCoin = pair => async dispatch => {
  dispatch({ type: FETCHING_COINS });

  try {
    //fetch current quadrigacx info
    const key = pair.key;
    const quadrigaUrl = `${CURRENT_TRADING_URL}${key}`;

    let response = await axios.get(quadrigaUrl);

    const coin = coinTitleTransformer(key).coin;
    const fiat = coinTitleTransformer(key).fiat;

    //assign in new keys
    response.data.pair = key;
    response.data.coin = coin;
    response.data.fiat = fiat;
    response.data.color = pair.color;

    //fetch historical data
    //CRYPTO COMPARE

    const cryptoCompareUrl = buildFetchUrl(null, coin, fiat);

    let historicalDataResponse = await axios.get(cryptoCompareUrl);

    const returnedData = historicalDataResponse.data.Data;

    //need to modify epoch time for Date
    const modifiedData = _.forEach(returnedData, (value, key) => {
      value.time = new Date(value.time * 1000);
    });

    //assign in data to response
    response.data.historicalData = modifiedData;

    const data = response.data;

    dispatch({ type: FETCHING_COINS_SUCCESS });
    dispatch({ type: FETCH_COINS, payload: data });

    //after dispatching coin data, call the callback to currencyList
    //callback();
  } catch(err) {
    console.log(err);
    dispatch({ type: FETCHING_COINS_FAILED });
  }
};

//fetch crypto compare data
export const fetchHistoricalData = pair => async dispatch => {
  dispatch({ type: FETCH_HISTORICAL_DATA });

  try {
    const coin = coinTitleTransformer(pair).coin;
    const fiat = coinTitleTransformer(pair).fiat;

    const hourUrl = buildFetchUrl('histohour', coin, fiat);
    const dayUrl = buildFetchUrl('histoday', coin, fiat, '365');

    const getHourData = hourUrl => {
      return axios.get(hourUrl);
    };
    const getDayData = dayUrl => {
      return axios.get(dayUrl);
    };

    axios.all([getHourData(hourUrl), getDayData(dayUrl)]).then(
      axios.spread((hour, day) => {
        const modifiedHour = _.forEach(hour.data.Data, (value, key) => {
          value.time = new Date(value.time * 1000);
        });

        const modifiedDay = _.forEach(day.data.Data, (value, key) => {
          value.time = new Date(value.time * 1000);
        });
        const data = {};
        data.hour = modifiedHour;
        data.day = modifiedDay;

        dispatch({ type: FETCH_HISTORICAL_DATA_SUCCESS, payload: data });
      })
    );
  } catch (err) {
    console.log(err);
    dispatch({ type: FETCH_HISTORICAL_DATA_FAILED });
  }
};
