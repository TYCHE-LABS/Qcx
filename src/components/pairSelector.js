import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

const CRYPTO_PAIRS = [
  { key: 'btc_cad', text: 'BTC : CAD', color: '#FF9900' },
  { key: 'btc_usd', text: 'BTC : USD', color: '#FF9900' },
  { key: 'eth_cad', text: 'ETH : CAD', color: '#2895F9' },
  { key: 'eth_btc', text: 'ETH : BTC', color: '#2895F9' },
  { key: 'ltc_cad', text: 'LTC : CAD', color: '#b8b8b8' },
  { key: 'ltc_btc', text: 'LTC : BTC', color: '#b8b8b8' },
  { key: 'bch_cad', text: 'BCH : CAD', color: '#478558' },
  { key: 'bch_btc', text: 'BCH : BTC', color: '#478558' },
  { key: 'btg_cad', text: 'BTG : CAD', color: '#EBA808' },
  { key: 'btg_btc', text: 'BTG : BTC', color: '#EBA808' },
];

export default class PairSelector extends React.Component {
  static navigationOptions = {
    title: 'Pick a pair',
  };

  renderItem() {
    return CRYPTO_PAIRS.map((pair, index) => {
      return (
        <TouchableOpacity
          key={pair.key}
          style={[styles.pairStyle, { backgroundColor: pair.color }]}
          onPress={() => {
            this.props.onComplete(pair);
          }}>
          <Text style={styles.pairText}>{pair.text}</Text>
        </TouchableOpacity>
      );
    });
  }

  render() {
    return <View style={styles.container}>{this.renderItem()}</View>;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2C3039',
  },
  pairStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 8,
    borderRadius: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 2,
    shadowOpacity: 0.6,
  },
  pairText: {
    fontSize: 25,
    color: 'white',
    textAlign: 'center',
  },
  buttonStyle: {
    backgroundColor: '#0288D1',
    marginTop: 15,
  },
});
