import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-elements';
import _ from 'lodash';
import {
  coinTitleTransformer,
  tradeTypeHelper,
  tradeTypeColorHelper,
  fiatColorSelector,
  txnCoinHelper,
  Spinner,
} from '../components/common';

export default class OpenOrderItem extends React.Component {
  statusHelper = status => {
    switch (status) {
      case 0:
        return 'active';
      case 1:
        return 'partially filled';
    }
  };

  typeHelper = type => {
    switch (type) {
      case 0:
        return 'Buy';
      case 1:
        return 'Sell';
    }
  };

  render() {
    const { type, datetime, status, amount, price, book } = this.props.item;
    console.log('the props of open order items are', this.props); 
    return (
      <View style={[styles.container, { borderLeftColor: tradeTypeColorHelper(Number(type)) }]}>
        <View style={styles.titleContainer}>
          <Text
            style={[
              styles.title,
              {
                color: tradeTypeColorHelper(Number(type)),
                fontWeight: 'bold',
              },
            ]}>
            {this.typeHelper(Number(type))}
          </Text>
          <Text style={styles.subtitile}>{datetime}</Text>
        </View>

        <Text style={styles.status}>{this.statusHelper(Number(status))}</Text>

        <View style={styles.titleContainer}>
          <Text style={[styles.title, { textAlign: 'right' }]}>
            {_.round(amount, 8)}{' '}
            <Text style={{ color: fiatColorSelector(coinTitleTransformer(book).coin) }}>
              {coinTitleTransformer(book).coin}
            </Text>
          </Text>
          <Text style={styles.subtitile}>
            price: {_.round(price, 8)}{' '}
            <Text style={{ color: fiatColorSelector(coinTitleTransformer(book).fiat) }}>
              {coinTitleTransformer(book).fiat}
            </Text>
          </Text>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#21252E',
    borderLeftWidth: 4,
    paddingLeft: 10,
    paddingRight: 10,
    justifyContent: 'space-between',
    margin: 4,
    borderBottomWidth: 1,
    borderColor: '#1B1D26',
  },
  titleContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 18,
    justifyContent: 'space-between',
    color: 'white',
  },
  status: {
    alignSelf: 'center',
    color: 'white',
  },
  subtitile: {
    color: 'white',
    textAlign: 'right',
  },
});
