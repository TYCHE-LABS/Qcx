import React from 'react';
import { StyleSheet, View, TouchableOpacity, Dimensions } from 'react-native';
import { Card, Text } from 'react-native-elements';
import _ from 'lodash';
import { VictoryChart, VictoryAxis, VictoryLine } from 'victory-native';
import { fiatColorSelector } from './common';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default class CurrencyItem extends React.Component {
  onItemPress = crypto => () => {
    this.props.navigation.navigate('cryptoDetail', {
      crypto,
    });
  };
  renderSymbol = fiat => {
    if (fiat === 'CAD' || fiat === 'USD') return '$';
  }

  renderItem() {
    return this.props.data.map((crypto, index) => {
      //defaults to showing one hour as the default fetch is by minutes
      const chartData = crypto.historicalData;
      const data = _.takeRight(chartData, 60);
      const { fiat, coin, last, color } = crypto;

      return (
        <TouchableOpacity onPress={this.onItemPress(crypto)} key={index}>
          <Card containerStyle={[styles.container, { borderLeftColor: color }]}>
            <View style={styles.titleView}>
              <Text style={[styles.titleText, { color }]}>{coin}</Text>
              <Text style={[styles.titleText, { color }]}>
                {this.renderSymbol(fiat)}
                {last}
              </Text>
            </View>

            <Text style={[styles.fiatText, { color: fiatColorSelector(fiat) }]}>{fiat}</Text>

            <View pointerEvents="none">
              <VictoryChart
                width={SCREEN_WIDTH * 0.95}
                height={150}
                scale={{ x: 'time' }}
                padding={chartStyle.containerPadding}>
                <VictoryAxis
                  padding={0}
                  tickCount={4}
                  style={chartStyle.axis}
                  fixLabelOverlap
                  tickFormat={t => {
                    const date = new Date(t);
                    return `${date.getHours()}:${(date.getMinutes() < 10 ? '0' : '') +
                      date.getMinutes()}`;
                  }}
                />

                <VictoryAxis
                  padding={0}
                  style={chartStyle.axis}
                  dependentAxis
                  tickCount={3}
                  tickFormat={t => {
                    return t > 1 ? `${_.round(t)}` : `${_.round(t, 5)}`;
                  }}
                />

                <VictoryLine
                  style={{ data: { stroke: color } }}
                  interpolation="cardinal"
                  data={data}
                  x="time"
                  y="close"
                  animate={{ duration: 3000, onLoad: { duration: 1500 } }}
                />
              </VictoryChart>
            </View>
          </Card>
        </TouchableOpacity>
      );
    });
  }

  render() {
    return <View>{this.renderItem()}</View>;
  }
}

const styles = StyleSheet.create({
  container: {
    borderLeftWidth: 4,
    backgroundColor: '#21252E',
    borderColor: '#1B1D26',
    margin: 8,
    paddingLeft: 2,
  },
  titleView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 8,
  },
  titleText: {
    fontSize: 18,
    padding: 6,
  },
  fiatText: {
    fontSize: 14,
    paddingLeft: 15,
  },
});

const chartStyle = {
  containerPadding: { top: 8, bottom: 25, left: 50, right: 22 },
  axis: { axis: { stroke: 'white' }, tickLabels: { fill: 'white', padding: 5 } },
};
