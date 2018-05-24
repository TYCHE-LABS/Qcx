//Displays and controls crytpo details
//Actions: BUY, SELL, WITHDRAWL, DEPOSIT with animation

import React from 'react';
import { StyleSheet, View, Alert, Dimensions, ActivityIndicator } from 'react-native';
import { Card, Text, ButtonGroup } from 'react-native-elements';
import HeaderButtons from 'react-navigation-header-buttons';
import _ from 'lodash';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Swipeable from 'react-native-swipeable';
import { connect } from 'react-redux';
import * as actions from '../actions';
import ChartLine from '../components/chart_Line';
import ChartCandle from '../components/chart_Candle';
import {
  fiatColorSelector,
  changeColorSelector,
  priceChangeIconSelector,
} from '../components/common';

const SCREEN_WIDTH = Dimensions.get('window').width;
const BUTTONS = ['minutes', 'hours', 'days'];
const LEFT_CONTENT = (
  <View
    style={{
      //alignSelf: 'flex-end',
      flex: 1,
      width: SCREEN_WIDTH,
      backgroundColor: '#73E2A7',
      alignItems: 'flex-end',
      justifyContent: 'center',
    }}>
    <Text
      style={{
        fontSize: 35,
        paddingRight: 30,
        color: 'white',
      }}>
      Buy <Feather name={'log-in'} size={35} color="white" />
    </Text>
  </View>
);
const RIGHT_CONTENT = (
  <View
    style={{
      //alignSelf: 'flex-start',
      flex: 1,
      width: SCREEN_WIDTH,
      backgroundColor: '#FB3640',
      alignItems: 'flex-start',
      justifyContent: 'center',
    }}>
    <Text
      style={{
        fontSize: 35,
        paddingLeft: 30,
        color: 'white',
      }}>
      Sell <Feather name={'log-out'} size={35} color="white" />
    </Text>
  </View>
);

class CryptoDetail extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: `${navigation.state.params.crypto.coin}`,
    headerRight: (
      <HeaderButtons IconComponent={Ionicons} iconSize={25} color="#2895F9">
        <HeaderButtons.Item
          title="help"
          iconName="ios-help-circle-outline"
          onPress={() => console.warn('help pressed')}
        />
      </HeaderButtons>
    ),
  });

  state = {
    selectedIndex: 0,
  };

  componentWillMount() {
    const { pair } = this.props.navigation.state.params.crypto;
    //fetch the other histrical data
    this.props.fetchHistoricalData(pair);
  }

  _updateButtonIndex = selectedIndex => {
    switch (selectedIndex) {
      //minute
      case 0:
        return this.setState({ selectedIndex, maxPoints: 60 });
      //hour
      case 1:
        return this.setState({ selectedIndex, maxPoints: 18 });
      //day
      case 2:
        return this.setState({ selectedIndex, maxPoints: 90 });
      default:
        return this.setState({ selectedIndex, maxPoints: 60 });
    }
  };

  //needs buy tag, pair details,
  _onLeftSwipe = (crypto, user, account) => () => {
    this.props.navigation.navigate('tradingView', {
      crypto,
      user,
      account,
      buy: true,
    });
  };

  _onRightSwipe = (crypto, user, account) => () => {
    this.props.navigation.navigate('tradingView', {
      crypto,
      user,
      account,
      buy: false,
    });
  };

  renderTitle = (coin, fiat, last, color, historicalData) => {
    const arrayFirst = _.head(historicalData);
    const arrayLast = _.last(historicalData);
    const change = _.floor((arrayLast.close / arrayFirst.close - 1) * 100, 2);

    return (
      <View style={styles.titleContainer}>
        <View style={styles.subTitleContainerLeft}>
          <Text h3 style={{ color }}>
            {coin}
          </Text>
          <Text style={{ color: fiatColorSelector(fiat), fontSize: 18 }}>{fiat}</Text>
        </View>
        <View style={styles.colorght}>
          <Text h3 style={{ color: changeColorSelector(change) }}>
            ${last}
          </Text>

          <Text style={{ color: changeColorSelector(change), fontSize: 18, textAlign: 'right' }}>
            24hr: {change}%{' '}
            <Entypo
              name={priceChangeIconSelector(change)}
              size={16}
              color={changeColorSelector(change)}
            />
          </Text>
        </View>
      </View>
    );
  };

  chartSelector = (selectedIndex, maxPoints, crypto, hour, day) => {
    if (selectedIndex === 0) return <ChartLine crypto={crypto} maxPoints={maxPoints} />;
    if (selectedIndex !== 0 && this.props.historicalData.fetching)
      return (
        <View style={styles.indicatorContainer}>
          <ActivityIndicator size="large" color="#2895F9" />
          <Text style={styles.indicatorText}>Getting the latest data! Hold on!</Text>
        </View>
      );
    if (selectedIndex === 1)
      return (
        <ChartCandle
          crypto={crypto}
          maxPoints={maxPoints}
          data={hour}
          sliderMin={1}
          sliderMax={hour.length}
          dayTag={false}
        />
      );

    if (selectedIndex === 2)
      return (
        <ChartCandle
          crypto={crypto}
          maxPoints={maxPoints}
          data={day}
          sliderMin={1}
          sliderMax={day.length}
          dayTag
        />
      );
  };

  renderChart = () => {
    const crypto = this.props.navigation.state.params.crypto;
    const { coin, color, fiat, last, historicalData } = crypto;
    const { day, hour } = this.props.historicalData;
    const { selectedIndex, maxPoints } = this.state;

    return (
      <Card containerStyle={styles.container}>
        {this.renderTitle(coin, fiat, last, color, historicalData)}

        {this.chartSelector(selectedIndex, maxPoints, crypto, hour, day)}

        <ButtonGroup
          onPress={this._updateButtonIndex}
          selectedIndex={this.state.selectedIndex}
          buttons={BUTTONS}
          containerStyle={styles.btnGroupContainer}
          selectedButtonStyle={{ backgroundColor: '#20252B' }}
          selectedTextStyle={{ color }}
        />
      </Card>
    );
  };

  render() {
    const crypto = this.props.navigation.state.params.crypto;
    const { user, account } = this.props;
    const { coin, color, fiat, high, low, last, pair, historicalData } = crypto;

    return (
      <Swipeable
        style={{ flex: 1 }}
        leftContent={LEFT_CONTENT}
        onLeftActionRelease={this._onLeftSwipe(crypto, user, account)}
        leftActionActivationDistance={145}
        rightContent={RIGHT_CONTENT}
        onRightActionRelease={this._onRightSwipe(crypto, user, account)}
        rightActionActivationDistance={145}
        swipeStartMinDistance={130}
      >
      {this.renderChart()}
      </Swipeable>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 0,
    backgroundColor: '#21252E',
    borderColor: '#1B1D26',
  },

  titleContainer: {
    backgroundColor: '#21252E',
    borderColor: '#1B1D26',
    justifyContent: 'space-between',
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    paddingBottom: 5,
    marginBottom: 10,
  },
  subTitleContainerLeft: {
    alignItems: 'flex-start',
  },
  subTitleContainerRight: {
    alignItems: 'flex-end',
  },
  btnGroupContainer: {
    borderColor: '#1B1D26',
    backgroundColor: '#2C3039',
    borderRadius: 3,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 2,
    shadowOpacity: 0.6,
  },
  indicatorContainer: {
    justifyContent: 'center',
    flexDirection: 'column',
    paddingTop: 20,
    marginBottom: 10,
  },
  indicatorText: {
    color: '#2895F9',
    textAlign: 'center',
    fontSize: 20,
  },
});

const mapStateToProps = ({ historicalData, user, account }) => {
  return { historicalData, user, account };
};

export default connect(mapStateToProps, actions)(CryptoDetail);
