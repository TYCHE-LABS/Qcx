import _ from 'lodash';
import { FETCH_COINS } from '../actions/types';

export default (state = [], action) => {
  //console.log('actions: ', action);
  switch (action.type) {
    case FETCH_COINS:
      //return only unique combinations
      return _.uniqBy([action.payload, ...state], 'pair');

    default:
      return state;
  }
};
