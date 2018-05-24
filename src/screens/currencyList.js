import React from 'react';
import { StyleSheet, View, ScrollView, RefreshControl, ActivityIndicator } from 'react-native';
import { Text } from 'react-native-elements';
import HeaderButtons from 'react-navigation-header-buttons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import _ from 'lodash';
import { connect } from 'react-redux';
import * as actions from '../actions';
import CurrencyItem from '../components/currencyItem';

const NO_TOKEN_SELECTED_TEXT = `You have no coins to display,
add one by clicking the "+" button on the top right corner`;

class CurrencyList extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Market',
    headerRight: (
      <HeaderButtons IconComponent={Ionicons} iconSize={25} color="#2895F9">
        <HeaderButtons.Item
          title="add"
          iconName="ios-add-circle-outline"
          onPress={() => {
            navigation.navigate('currencyPicker');
          }}
        />
      </HeaderButtons>
    ),
  });

  //es 7 state declaration
  state = {
    refreshing: false,
  };

  onRefresh = () => {
    if (_.isEmpty(this.props.currency)) return this.setState({ refreshing: false });

    this.setState({ refreshing: true });

    //massage the object to be passed into fetch coin
    const newPair = _.map(this.props.currency, (key, index) => {
      return { pair: { key: key.pair, color: key.color } };
    });
    //for each coin, fetch the updates
    _.forEach(newPair, (item, index) => {
      //update the stats of that pair
      this.props.fetchCoin(item.pair).then(() => {
        //update refreshing state after each pair is refreshed
        this.setState({ refreshing: false });
      });
    });
  };

  renderIndicator() {
    if (this.props.fetchingStatus.fetching && !this.state.refreshing)
      return (
        <View style={styles.indicatorContainer}>
          <ActivityIndicator size="large" color="#2895F9" />
          <Text style={styles.indicatorText}>looking for your coin</Text>
        </View>
      );
  }

  renderItem() {
    const currency = this.props.currency;

    if (!_.isEmpty(currency)) {
      return <CurrencyItem data={currency} navigation={this.props.navigation} />;
    }
    return <Text style={styles.noTokenText}>{NO_TOKEN_SELECTED_TEXT}</Text>;
  }

  render() {
    return (
      <ScrollView
        style={styles.scrollContainer}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.onRefresh}
            color={['#FF9900', '#EBA808', '#43DF9C', '#2895F9', '#86888F']} //INDICATOR COLOR FOR ANDROID
            tintColor={'#2895F9'} //spinner color for ios
            title="updating your coins!"
            titleColor={'#2895F9'}
          />
        }>
        {this.renderIndicator()}
        {this.renderItem()}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: '#2C3039',
  },

  indicatorContainer: {
    justifyContent: 'center',
    flexDirection: 'column',
    paddingTop: 20,
  },

  indicatorText: {
    color: '#2895F9',
    textAlign: 'center',
  },

  noTokenText: {
    textAlign: 'center',
    color: '#2895F9',
    fontSize: 18,
    padding: 20,
  },
});

const mapStateToProps = ({ currency, fetchingStatus }) => {
  return { currency, fetchingStatus };
};

export default connect(mapStateToProps, actions)(CurrencyList);
