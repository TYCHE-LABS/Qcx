import axios from 'axios';
import qs from 'qs'; //query strings
import forge from 'node-forge';
import moment from 'moment';
import _ from 'lodash';
import { alphaAdvantageKey } from '../components/common';
import {
  FETCH_ACC_BALANCE,
  FETCH_ACC_BALANCE_SUCCESS,
  FETCH_ACC_FEES_SUCCESS,
  FETCH_ACC_BALANCE_FAILED,
  FETCH_PRICE_LIST,
  FETCH_PRICE_LIST_SUCCESS,
  FETCH_PRICE_LIST_FAILED,
  FETCH_CURRENCY_CONVERSION,
  FETCH_CURRENCY_CONVERSION_SUCCESS,
  FETCH_CURRENCY_CONVERSION_FAILED,
  FETCH_USER_TXN,
  FETCH_USER_TXN_SUCCESS,
  FETCH_USER_TXN_FAILED,
} from './types';

//constants
const ROOT_URL = 'https://api.quadrigacx.com/v2/';
const BALANCE_URL = `${ROOT_URL}balance`;
const USER_TXN_URL = `${ROOT_URL}user_transactions`;
let HMAC = forge.hmac.create();

export const fetchAccountBalance = () => async (dispatch, getState) => {
  dispatch({ type: FETCH_ACC_BALANCE });

  const { user } = getState();
  //if not authed, exit function
  if (!user.userAuthed) return;

  const CLIENT = user.userDetail.clientId;
  const KEY = user.userDetail.apiKey; //api key
  const SECRET = user.userDetail.secret; //api secret

  try {
    const NONCE = moment().valueOf();
    const message = `${NONCE}${CLIENT}${KEY}`;

    await HMAC.start('sha256', SECRET);
    await HMAC.update(message);
    const hexResult = await HMAC.digest().toHex();

    const params = {
      key: KEY,
      nonce: NONCE,
      signature: hexResult,
    };

    let response = await axios.post(BALANCE_URL, params);

    const fees = _.pick(response.data, ['fee', 'fees']);
    const withOutFees = _.omit(response.data, ['fee', 'fees']);

    const data = {};
    _.map(withOutFees, (value, key) => {
      const splitKey = key.split('_');
      const coin = splitKey[0];
      const detail = splitKey[1];

      if (!data[coin]) {
        data[coin] = { [detail]: value };
      } else {
        _.merge(data[coin], { [detail]: value });
      }
    });
    delete data.xau;
    delete data.etc;

    dispatch({ type: FETCH_ACC_BALANCE_SUCCESS, payload: data });
    dispatch({ type: FETCH_ACC_FEES_SUCCESS, payload: fees });
  } catch(err) {
    console.log(err);
    dispatch({ type: FETCH_ACC_BALANCE_FAILED });
  }
};

export const updateValue = () => async dispatch => {
  dispatch({ type: FETCH_PRICE_LIST });

  try {  //Crypto Compare url helper
    const CC_ROOT_URL = 'https://min-api.cryptocompare.com/data/';
    const cryptoCompareParams = {
      fsyms: 'BTC,ETH,LTC,BCH,BTG', //from symbol
      tsyms: 'CAD', //to symbol
      e: 'quadrigacx', //name of exchange
    };

    const params = qs.stringify({ ...cryptoCompareParams });

    const url = `${CC_ROOT_URL}pricemulti?${params}`;

    let { data } = await axios.get(url);

    dispatch({ type: FETCH_PRICE_LIST_SUCCESS, payload: data });
  } catch(err) {
    console.log(err);
    dispatch({ type: FETCH_PRICE_LIST_FAILED });
  }
};

export const fetchCurrencyConversion = () => async dispatch => {
  dispatch({ type: FETCH_CURRENCY_CONVERSION });

  try {
    const url = `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=CAD&to_currency=USD&apikey=${alphaAdvantageKey}`
    const { data } = await axios.get(url);
    const response = data['Realtime Currency Exchange Rate'];
    const rate = response['5. Exchange Rate'];
    console.log('the response is', rate);
    dispatch({ type: FETCH_CURRENCY_CONVERSION_SUCCESS, payload: Number(rate) });
  } catch(err) {
    console.log('there was an error', err);
    dispatch({ type: FETCH_CURRENCY_CONVERSION_FAILED });
  }
};

export const fetchUserTransactions = () => async (dispatch, getState) => {
  dispatch({ type: FETCH_USER_TXN });

  const { user } = getState();
  //if not authed, exit function
  if (!user.userAuthed) return;

  const CLIENT = user.userDetail.clientId;
  const KEY = user.userDetail.apiKey; //api key
  const SECRET = user.userDetail.secret; //api secret

  try {
    const NONCE = moment().valueOf();
    const message = `${NONCE}${CLIENT}${KEY}`;

    await HMAC.start('sha256', SECRET);
    await HMAC.update(message);
    const hexResult = await HMAC.digest().toHex();

    const params = {
      key: KEY,
      nonce: NONCE,
      signature: hexResult,
    };

    let { data } = await axios.post(USER_TXN_URL, params);

    console.log('the response is', data);
    dispatch({ type: FETCH_USER_TXN_SUCCESS, payload: data });

  } catch(err) {
    console.log('there was an error fetching user txns', err);
    dispatch({ type: FETCH_USER_TXN_FAILED });
  }
};
