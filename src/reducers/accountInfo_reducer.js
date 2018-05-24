import _ from 'lodash';
import {
  FETCH_ACC_BALANCE,
  FETCH_ACC_BALANCE_SUCCESS,
  FETCH_ACC_FEES_SUCCESS,
  FETCH_ACC_BALANCE_FAILED,
  FETCH_USER_TXN,
  FETCH_USER_TXN_SUCCESS,
  FETCH_USER_TXN_FAILED,
  FETCH_OPEN_ORDERS,
  FETCH_OPEN_ORDERS_SUCCESS,
  FETCH_OPEN_ORDERS_FAILED,
} from '../actions/types';

const INITIAL_STATE = {
  fetching: false,
  error: null,
  balance: {},
  fees: {},
  transactions: {},
  openOrders: {},
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    //user account balance
    case FETCH_ACC_BALANCE:
      return { ...state, fetching: true };

    case FETCH_ACC_BALANCE_SUCCESS:
      return { ...state, balance: action.payload, fetching: false };

    case FETCH_ACC_FEES_SUCCESS:
      return { ...state, fees: action.payload, fetching: false };

    case FETCH_ACC_BALANCE_FAILED:
      return {
        error: 'Sorry, failed to look up your account balance, please try again later',
        fetching: false,
      };

    //user transactions
    case FETCH_USER_TXN:
      return { ...state, fetching: true };

    case FETCH_USER_TXN_SUCCESS:
      return { ...state, transactions: action.payload, fetching: false };

    case FETCH_USER_TXN_FAILED:
      return {
        ...state,
        error: 'Sorry, failed to look up your transactions, please try again later',
        fetching: false,
      };

    //user open orders
    case FETCH_OPEN_ORDERS:
      return { ...state, fetching: true };
    case FETCH_OPEN_ORDERS_SUCCESS:
      return { ...state, openOrders: action.payload, fetching: false }
    case FETCH_OPEN_ORDERS_FAILED:
      return { ...state, fetching: false };


    default:
      return state;
  }
};
