import React from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';

import PairSelector from '../components/pairSelector';

class CurrencyPicker extends React.Component {
  static navigationOptions = {
    title: 'Pick a pair',
  };

  onPairSelected = pair => {
    this.props.fetchCoin(pair);

    this.props.navigation.goBack();
  };

  render() {
    return <PairSelector onComplete={this.onPairSelected} />;
  }
}

export default connect(null, actions)(CurrencyPicker);
