import _ from 'lodash';
import {
  FETCH_HISTORICAL_DATA,
  FETCH_HISTORICAL_DATA_SUCCESS,
  FETCH_HISTORICAL_DATA_FAILED,

  FETCH_PRICE_LIST,
  FETCH_PRICE_LIST_SUCCESS,
  FETCH_PRICE_LIST_FAILED,

  FETCH_CURRENCY_CONVERSION,
  FETCH_CURRENCY_CONVERSION_SUCCESS,
  FETCH_CURRENCY_CONVERSION_FAILED,
} from '../actions/types';

const INITIAL_STATE = {
  fetching: false,
  priceListFetching: false,
  currencyConversionFetching: false,
  error: null,
  priceValueList: {},
  usdRate: null,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FETCH_HISTORICAL_DATA:
      return { ...state, fetching: true };

    case FETCH_HISTORICAL_DATA_SUCCESS:
      return { ...state, ...action.payload, fetching: false };

    case FETCH_HISTORICAL_DATA_FAILED:
      return { ...state, error: 'Sorry, could not find coin data, please try again later', fetching: false };

    case FETCH_PRICE_LIST:
      return { ...state, priceListFetching: true };

    case FETCH_PRICE_LIST_SUCCESS:
      return { ...state, priceListFetching: false, priceValueList: action.payload };

    case FETCH_PRICE_LIST_FAILED:
      return { ...state, priceListFetching: false, error: 'There was an error connecting' };

    case FETCH_CURRENCY_CONVERSION:
      return { ...state, currencyConversionFetching: true };

    case FETCH_CURRENCY_CONVERSION_SUCCESS:
      return { ...state, currencyConversionFetching: false, usdRate: action.payload };

    case FETCH_CURRENCY_CONVERSION_FAILED:
      return { ...state, currencyConversionFetching: false, error: 'something was wrong fetching usd rate' };

    default:
      return state;
  }
};
