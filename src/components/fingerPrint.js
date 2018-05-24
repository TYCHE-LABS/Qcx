import React from 'react';
import { StyleSheet, View, TouchableOpacity, Switch } from 'react-native';
import { Text, Button } from 'react-native-elements';
import Expo from 'expo';
import { connect } from 'react-redux';
import * as actions from '../actions';

class FingerPrint extends React.Component {
  state = {
    FPAvailable: false,
    FPEnrolled: false,
    Authenticated: false,
    AuthCounter: 0,
    error: null,
  }
  componentWillMount() {
    Expo.Fingerprint.hasHardwareAsync().then(available => {
      this.setState({ FPAvailable: available });
      Expo.Fingerprint.isEnrolledAsync().then(enrolled => {
        this.setState({ FPEnrolled: enrolled });
      });
    });
    console.log('the state', this.state );
  }

  componentDidUpdate() {
    console.log('the state', this.state);
    const { FPAvailable, FPEnrolled, Authenticated, AuthCounter } = this.state;
    if (FPAvailable && FPEnrolled && !Authenticated && AuthCounter <= 2) {
      //authenticate user via finger print
      Expo.Fingerprint.authenticateAsync('Please scan your finger print to authenticate')
      .then(auth => {
          console.log('the result from auth is', auth);
          this.setState({
            Authenticated: auth.success,
            error: auth.error,
            AuthCounter: AuthCounter + 1,
          });
          if (auth.success) {
            //update redux

          }
        })
        .catch(error => console.log('the error is', error));
    }
    //authenticate via passcode
  }


  componentWillReceiveState(nextState) {
    console.log('nextState', nextState);
  }

  render() {
    return <View />;
  }
}

export default connect(null, actions)(FingerPrint);
