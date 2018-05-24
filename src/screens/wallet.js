import React from 'react';
import { StyleSheet, View, FlatList, RefreshControl } from 'react-native';
import { Text, ListItem } from 'react-native-elements';
import _ from 'lodash';
import { connect } from 'react-redux';
import * as actions from '../actions';
import {
  fiatColorSelector,
  numbersDisplay,
  valueCalculator,
  totalValueCalculator,
  Spinner,
} from '../components/common';
import NotAuthed from '../components/notAuthed';

class Wallet extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Wallet',
  });

  state = {
    refreshing: false,
    totalValue: 0,
    lastTotalValue: 0,
    // bookValue: 0, //need txn data
    // marketValue: 0, //need txn data
    // realizedGains: 0, //need txn data
    // unrealizedGains: 0, //need txn data
  };

  componentWillMount() {
    // console.log('the props on this page are', this.props);
    this.props.updateValue();
    this.props.fetchAccountBalance();
    this.props.fetchCurrencyConversion();

  }

  componentWillReceiveProps(nextProps) {
    // console.log('the next props are', nextProps);

    if (
      this.props.user.userAuthed !== nextProps.user.userAuthed &&
      nextProps.user.userAuthed === true
    ) {
      //fetch details
      this.props.fetchAccountBalance();
    }
  }

    renderValueSection = () => {
    const {
      account: { balance },
      priceValueList,
      usdRate,
    } = this.props;

    const totalValue = totalValueCalculator(balance, priceValueList, usdRate) || 0;
    return (
      <View style={styles.valueSectionContainer}>
        <Text h2 style={styles.titleText}>
          ${totalValue}
        </Text>
        <Text style={styles.changeText}>
          CAD
        </Text>
        {/*        <Text h4 style={styles.changeText}>over all % change </Text>
                <Divider />

                <View style={{ flexDirection: 'row' }}>
                  <View style={{ alignItems: 'flex-start', flex: 0.5, paddingLeft: 8 }}>
                    <Text>Cost </Text>
                    <Text>Value </Text>
                  </View>

                  <View style={{ flex: 0.5, paddingRight: 8 }}>
                    <Text>realized gain/loss</Text>
                    <Text>unrealized gain/loss</Text>
                  </View>

                </View>
        */}
      </View>
    );
  };

  renderWallets = ({ item }) => {
    const { key, available, reserved, balance } = item;
    const { priceValueList, usdRate } = this.props;
    const capitalKey = key.toUpperCase();
    return (
      <ListItem
        hideChevron
        containerStyle={styles.itemContainer}
        title={capitalKey}
        titleStyle={{ color: fiatColorSelector(capitalKey), fontWeight: 'bold' }}
        rightTitle={`Value: $${valueCalculator(capitalKey, balance, priceValueList, usdRate)}`}
        rightTitleStyle={[{ color: fiatColorSelector(capitalKey) }, styles.rightTitle]}
        subtitle={
          <View style={styles.subtitleView}>
            <Text style={styles.subtitleText}>
              Available: {numbersDisplay(available)}
              {`\n`}
              Reserved: {numbersDisplay(reserved)}
              {`\n`}
              Balance: {numbersDisplay(balance)}
            </Text>
          </View>
        }
      />
    );
  };

  onRefresh = () => {
    this.setState({ refreshing: true });
    this.props.fetchAccountBalance();
    this.setState({ refreshing: false });
  };

  renderList = () => {
    return (
      <FlatList
        data={_.map(this.props.account.balance, (value, key) => {
          return { ...value, key };
        })}
        renderItem={this.renderWallets}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.onRefresh}
            color={['#FF9900', '#EBA808', '#43DF9C', '#2895F9', '#86888F']} //INDICATOR COLOR FOR ANDROID
            tintColor={'#2895F9'} //spinner color for ios
            title="updating your wallet data!"
            titleColor={'#2895F9'}
          />
        }
      />
    );
  };

  render() {
    const {
      account: { fetching, balance },
      priceValueList,
      priceListFetching,
      currencyConversionFetching,
      user
    } = this.props;

    if (!user.userAuthed) return <NotAuthed />;

    if (fetching || priceListFetching || currencyConversionFetching) return <Spinner />;

    if (_.isEmpty(balance) || _.isEmpty(priceValueList)) {
      return (
        <View style={styles.indicatorContainer}>
          <Text style={styles.indicatorText}>You have no transaction data</Text>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        {this.renderValueSection()}
        {this.renderList()}
      </View>
    );
  }
}

const mapStateToProps = ({ account, historicalData, user }) => {
  const { priceValueList, usdRate, priceListFetching, currencyConversionFetching } = historicalData;
  return { account, priceValueList, usdRate, priceListFetching, currencyConversionFetching, user };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 64,
    paddingBottom: 8,
    backgroundColor: '#2C3039',
  },
  valueSectionContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 0.15,
  },
  itemContainer: {
    backgroundColor: '#21252E',
    borderColor: '#1B1D26',
    marginLeft: 8,
    marginRight: 8,
    marginBottom: 5,
  },
  titleText: {
    color: 'white',
  },
  changeText: {
    color: 'white',
  },
  subtitleView: {
    flexDirection: 'row',
    paddingLeft: 10,
    paddingTop: 8,
  },
  subtitleText: {
    fontSize: 16,
    color: 'white',
  },
  rightTitle: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 18,
  },
});

export default connect(mapStateToProps, actions)(Wallet);
