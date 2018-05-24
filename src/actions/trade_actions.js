import forge from 'node-forge';
import axios from 'axios';
import _ from 'lodash';
import moment from 'moment';

import {
  CREATING_ORDER,
  CREATING_ORDER_SUCCESS,
  CREATING_ORDER_FAILED,
} from './types';


const ROOT_URL = 'https://api.quadrigacx.com/v2/';
const BUY_URL = `${ROOT_URL}buy`;
const SELL_URL = `${ROOT_URL}sell`;
let HMAC = forge.hmac.create();

const paramsFactory = (key, nonce, signature, amount, book) => {
  const params = {
    key,
    nonce,
    signature,
    amount,
    book: book || 'btc_cad',
  };
  return params;
};


export const createOrder = orderDetails => async (dispatch, getState) => {
  dispatch({ type: CREATING_ORDER });
  const { user } = getState();
  //if not authed, exit function
  if (!user.userAuthed) return;

  const CLIENT = user.userDetail.clientId;
  const KEY = user.userDetail.apiKey; //api key
  const SECRET = user.userDetail.secret; //api secret

  try {
    const NONCE = moment().valueOf(); //the 300 is an arbitrary number to increase randomness of the nonce so that it doesn't conflict with other api calls
    const message = `${NONCE}${CLIENT}${KEY}`;

    await HMAC.start('sha256', SECRET);
    await HMAC.update(message);
    const hexResult = await HMAC.digest().toHex();

    const params = {
      key: KEY,
      nonce: NONCE,
      signature: hexResult,
      amount: orderDetails.amount,
      price: orderDetails.limitPrice,
    };

    if (orderDetails.buy === 'buy') {
      //submit buy order
      let { data } = await axios.post(BUY_URL, params);
      console.log('the response of buy is', data);
      if (data.error) return dispatch({ type: CREATING_ORDER_FAILED, payload: data.error });
      return dispatch({ type: CREATING_ORDER_SUCCESS, payload: data });
    }

    if (orderDetails.buy === 'sell') {
      //submit buy order
      let { data } = await axios.post(SELL_URL, params);
      console.log('the response of sell is', data);
      if (data.error) return dispatch({ type: CREATING_ORDER_FAILED, payload: data.error });
      return dispatch({ type: CREATING_ORDER_SUCCESS, payload: data });
    }

  } catch (err) {
    console.log('there was an error posting new trade', err);
    dispatch({ type: CREATING_ORDER_FAILED });
  }
};
