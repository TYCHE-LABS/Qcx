import {
  AUTH_DETAIL_ENTERED,
  TESTING_AUTH_DETAILS,
  TESTING_AUTH_FAILED,
  USER_NOT_AUTHENTICATED,
  USER_AUTHENTICATED,
} from '../actions/types';

const INITIAL_STATE = {
  userAuthed: false,
  userDetail: {},
  testing: false,
  error: null,
};

export default (state = INITIAL_STATE, action) => {
  console.log('action triggered', action); 
  switch (action.type) {
    case AUTH_DETAIL_ENTERED:
      return { ...INITIAL_STATE, userDetail: action.payload};

    case TESTING_AUTH_DETAILS:
      return { ...state, testing: true, error: null };

    case TESTING_AUTH_FAILED:
      return { ...INITIAL_STATE, error: action.payload };

    case USER_NOT_AUTHENTICATED:
      return INITIAL_STATE;

    case USER_AUTHENTICATED:
      return { ...state, userAuthed: true, testing: false, error: null };

    default:
      return state;
  }
};
