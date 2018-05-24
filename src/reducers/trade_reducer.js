import { CREATING_ORDER, CREATING_ORDER_SUCCESS, CREATING_ORDER_FAILED } from '../actions/types';

const INITIAL_STATE = {
  postingTrade: false,
  orderResponse: {},
  error: null,
};

export default (state = INITIAL_STATE, action) => {
  switch(action.type) {
    case CREATING_ORDER:
      return { ...INITIAL_STATE, postingTrade: true };
    case CREATING_ORDER_SUCCESS:
      return { ...INITIAL_STATE, orderResponse: action.payload };
    case CREATING_ORDER_FAILED:
      return { ...INITIAL_STATE, error: action.payload };
    default:
      return state;
  }
};
