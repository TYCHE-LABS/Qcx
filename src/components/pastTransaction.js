import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-elements';
import {
  tradeTypeHelper,
  tradeTypeColorHelper,
  fiatColorSelector,
  txnCoinHelper,
} from '../components/common';

export default class PastTransactionItem extends React.Component {
  subTitle = item => {
    if (item.type === 0 || item.type === 1) {
      const coin = txnCoinHelper(item);
      return (
        <View style={styles.titleContainer}>
          <Text style={styles.subtitile}>{item.datetime}</Text>
          <Text style={styles.subtitile}>{item[coin]}</Text>
        </View>
      );
    }

    if (item.type === 2) {
      const key = txnCoinHelper(item);
      const coin = key.coin.toLowerCase();
      return (
        <View style={styles.titleContainer}>
          <Text style={styles.subtitile}>{item.datetime}</Text>
          <Text style={styles.subtitile}>{item[coin]}</Text>
        </View>
      );
    }
  };

  rightTitle = item => {
    if (item.type === 0 || item.type === 1) {
      const key = txnCoinHelper(item);
      return (
        <Text style={[styles.title, { color: fiatColorSelector(key.toUpperCase()) }]}>
          {key.toUpperCase()}
        </Text>
      );
    }

    if (item.type === 2) {
      const key = txnCoinHelper(item);
      return (
        <Text style={[styles.title, { color: fiatColorSelector(key.coin) }]}>
          {key.coin} : {key.fiat}
        </Text>
      );
    }
  };

  render() {
    if (this.props.item.error)
      return (
        <Text style={styles.noDataLabel}>
          {' '}
          Ops something went wrong, failed to load transaction data{' '}
        </Text>
      );

    const item = this.props.item;
    const type = item.type;

    return (
      <View style={[styles.itemContainer, { borderLeftColor: tradeTypeColorHelper(type) }]}>
        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: tradeTypeColorHelper(type) }]}>
            {tradeTypeHelper(type)}
          </Text>
          {this.rightTitle(item)}
        </View>
        {this.subTitle(item)}
        {item.rate ? <Text style={styles.subtitile}>Rate: ${item.rate}</Text> : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  itemContainer: {
    backgroundColor: '#21252E',
    borderLeftWidth: 4,
    paddingLeft: 10,
    paddingRight: 10,
    justifyContent: 'space-around',
    margin: 4,
    borderBottomWidth: 1,
    borderColor: '#1B1D26',
  },
  noDataLabel: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    justifyContent: 'space-between',
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  subtitile: {
    color: 'white',
    textAlign: 'right',
  },
});
