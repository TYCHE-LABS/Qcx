import { combineReducers } from 'redux';

import currency from './currencyList_reducer';
import fetchingStatus from './fetchingStatus_reducer';
import historicalData from './coinData_reducer';
import account from './accountInfo_reducer';
import trade from './trade_reducer';
import user from './user_reducer';

export default ({
  currency,
  fetchingStatus,
  historicalData,
  trade,
  account,
  user,
});
