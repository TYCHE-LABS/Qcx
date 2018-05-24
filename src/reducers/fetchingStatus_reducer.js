import _ from 'lodash';
import { FETCHING_COINS, FETCHING_COINS_SUCCESS, FETCHING_COINS_FAILED } from '../actions/types';

const INITIAL_STATE = {
  fetching: false,
  error: null,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FETCHING_COINS:
      return { fetching: true };

    case FETCHING_COINS_SUCCESS:
      return INITIAL_STATE;

    case FETCHING_COINS_FAILED:
      return { error: 'Ops something went wrong, please try agian', fetching: false };

    default:
      return state;
  }
};
