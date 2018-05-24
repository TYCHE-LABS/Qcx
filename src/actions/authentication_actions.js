import Expo from 'expo';
import axios from 'axios';
import forge from 'node-forge';
import moment from 'moment';
import {
  AUTH_DETAIL_ENTERED,
  TESTING_AUTH_DETAILS,
  TESTING_AUTH_FAILED,
  USER_AUTHENTICATED,
  USER_NOT_AUTHENTICATED,
} from './types';

//constants
const URL = 'https://api.quadrigacx.com/v2/balance';
let HMAC = forge.hmac.create();

const testAuthDetails = async (dispatch, authDetails) => {
  dispatch({ type: TESTING_AUTH_DETAILS });
  const CLIENT = authDetails.clientId;
  const KEY = authDetails.apiKey; //api key
  const SECRET = authDetails.secret; //api secret

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

    let response = await axios.post(URL, params);

    if (response.status === 200 && !response.data.error) {
      dispatch({ type: USER_AUTHENTICATED });
    } else {
      const error = response.data.error;
      dispatch({ type: TESTING_AUTH_FAILED, payload: error });
    }
  } catch (err) {
    console.log(err);
    dispatch({ type: USER_NOT_AUTHENTICATED });
  }
};

export const saveAuthDetails = authDetails => dispatch => {
  //save details to user reducer
  dispatch({ type: AUTH_DETAIL_ENTERED, payload: authDetails });
  //test the auth credientials
  testAuthDetails(dispatch, authDetails);

  // //saving authentication details
  // if (authDetails.saveAuth) {
  //   //actiont o save the details to secure store
  //
  //   const storeDetails = Expo.SecureStore.setItemAsync(key, details);
  //
  //   return storeDetails.then(() => {
  //       console.log('saving details success');
  //       const result = Expo.SecureStore.getItemAsync(key);
  //       return result.then(result => {
  //         console.log('the result is', result);
  //       });
  //     })
  //     .catch(err => {
  //       console.log('the error saving the details were', err);
  //     });
  // }
};

//removing authentication
export const removeAuthDetails = () => dispatch => {
  dispatch({ type: USER_NOT_AUTHENTICATED });
};
