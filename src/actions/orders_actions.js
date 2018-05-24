import axios from 'axios';
import _ from 'lodash';
import forge from 'node-forge';
import moment from 'moment';

import {
  FETCH_OPEN_ORDERS,
  FETCH_OPEN_ORDERS_SUCCESS,
  FETCH_OPEN_ORDERS_FAILED,
} from './types';

//QuadrigaCX
const ROOT_URL = 'https://api.quadrigacx.com/v2/';
// const ORDER_BOOK_URL = `${ROOT_URL}order_book`;
const OPEN_ORDERS_URL = `${ROOT_URL}open_orders`;
// const LOOKUP_URL = `${ROOT_URL}lookup_order`;
// const CANCEL_ORDER_URL = `${ROOT_URL}cancel_order`;

let HMAC = forge.hmac.create();

const ORDER_BOOKS = [
  'btc_cad',
  'btc_usd',
  'eth_cad',
  'eth_btc',
  'ltc_cad',
  'ltc_btc',
  'bch_cad',
  'bch_btc',
  'btg_cad',
  'btg_btc',
];

const paramsFactory = (key, nonce, signature, book) => {
  const params = {
    key,
    nonce,
    signature,
    book: book || 'btc_cad',
  };
  return params;
};

export const fetchOpenOrders = pair => async (dispatch, getState) => {
  dispatch({ type: FETCH_OPEN_ORDERS });

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

    const book = 'btc_cad';
    const params = paramsFactory(KEY, NONCE, hexResult);

    let { data } = await axios.post(OPEN_ORDERS_URL, params);

    console.log('the response from open orders are', data, typeof data);

    //assign in the order book
    //data[0].book = 'btc_cad';
    _.map(data, o => {
      o.book = book;
      return o;
    });

    console.log('the response from open orders are', data);

    dispatch({ type: FETCH_OPEN_ORDERS_SUCCESS, payload: data });
  } catch (err) {
    console.log('there was an error fetching open orders', err);
    dispatch({ type: FETCH_OPEN_ORDERS_FAILED });
  }
};
