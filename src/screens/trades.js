import React from 'react';
import { StyleSheet, View, FlatList, RefreshControl } from 'react-native';
import { Text, ButtonGroup } from 'react-native-elements';
import _ from 'lodash';
import { connect } from 'react-redux';
import * as actions from '../actions';
import PastTransactionItem from '../components/pastTransaction';
import OpenOrderItem from '../components/openOrderItem';
import NotAuthed from '../components/notAuthed';
import { Spinner } from '../components/common';

const BUTTONS = ['Open  Orders', 'Past Transactions'];

class Trades extends React.Component {
  static navigationOptions = {
    title: 'Trades',
  };

  state = {
    refreshing: false,
    selectedIndex: 0,
  };

  updateIndex = selectedIndex => {
    this.setState({ selectedIndex });
  };

  componentWillMount() {
    console.log('the props are', this.props);
    //only fetch if user is authed
    if (this.props.user.userAuthed) {
      this.props.fetchOpenOrders();
      //delay fetching transactions for 0.5 second, to avoid quadriga nonce issue
      _.delay(() => {
        this.props.fetchUserTransactions();
      }, 250);
    }
  }

  componentWillReceiveProps(nextProps) {
    console.log('the next props are', nextProps); 

    if (
      this.props.user.userAuthed !== nextProps.user.userAuthed &&
      nextProps.user.userAuthed === true
    ) {
      //fetch details
      this.props.fetchOpenOrders();
      _.delay(() => {
        this.props.fetchUserTransactions();
      }, 250);
    }
  }

  onRefreshOpenOrders = () => {
    this.setState({ refreshing: true });
    this.props.fetchOpenOrders();
    this.setState({ refreshing: false });
  };

  onRefreshUserTxns = () => {
    this.setState({ refreshing: true });
    this.props.fetchUserTransactions();
    this.setState({ refreshing: false });
  };

  renderOpenOrders() {
    if (_.isEmpty(this.props.openOrders)) return <Text style={styles.noDataLabel}>No open orders to display</Text>;
    return (
      <FlatList
        data={_.map(this.props.openOrders, (value, key) => {
          return { ...value, key };
        })}
        renderItem={this.renderOpenOrdersItem}
        keyExtractor={this.keyExtractor}
        style={{ flex: 1 }}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.onRefreshOpenOrders}
            color={['#FF9900', '#EBA808', '#43DF9C', '#2895F9', '#86888F']} //INDICATOR COLOR FOR ANDROID
            tintColor={'#2895F9'} //spinner color for ios
            title="updating your orders!"
            titleColor={'#2895F9'}
          />
        }
      />
    );
  }

  renderOpenOrdersItem = ({ item }) => {
    return <OpenOrderItem item={item} />;
  };

  renderPastTrades = () => {
    if (_.isEmpty(this.props.transactions)) return <Text style={styles.noDataLabel}>No transactions to display</Text>;

    return (
      <FlatList
        data={_.map(this.props.transactions, (value, key) => {
          return { ...value, key };
        })}
        renderItem={this.renderPastTradeItem}
        keyExtractor={this.keyExtractor}
        style={{ flex: 1 }}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.onRefreshUserTxns}
            color={['#FF9900', '#EBA808', '#43DF9C', '#2895F9', '#86888F']} //INDICATOR COLOR FOR ANDROID
            tintColor={'#2895F9'} //spinner color for ios
            title="updating your trades data!"
            titleColor={'#2895F9'}
          />
        }
      />
    );
  };

  renderPastTradeItem = ({ item }) => {
    return <PastTransactionItem item={item} />;
  };

  renderLists = () => {
    if (this.state.selectedIndex === 0) {
      return (
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>Open orders</Text>
          {this.renderOpenOrders()}
        </View>
      );
    }

    if (this.state.selectedIndex === 1) {
      return (
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>Past trades</Text>
          {this.renderPastTrades()}
        </View>
      );
    }
  };

  keyExtractor = (item, index) => index.toString();

  render() {
    if (!this.props.user.userAuthed) return <NotAuthed />;
    if (this.props.fetching) return <Spinner />;

    const { selectedIndex } = this.state;
    return (
      <View style={styles.container}>
        <ButtonGroup
          onPress={this.updateIndex}
          selectedIndex={selectedIndex}
          buttons={BUTTONS}
          containerStyle={styles.buttonGroup}
          selectedButtonStyle={{ backgroundColor: '#20252B' }}
          selectedTextStyle={{ color: '#2895F9' }}
          textStyle={{ color: 'white' }}
        />
        {this.renderLists()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 64,
    paddingBottom: 8,
    backgroundColor: '#2C3039',
    //justifyContent: 'space-between',
  },
  buttonGroup: {
    borderColor: '#1B1D26',
    backgroundColor: '#2C3039',
  },
  label: {
    color: '#2895F9',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 8,
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

const mapStateToProps = ({ account, user }) => {
  const { transactions, fetching, openOrders } = account;
  return { transactions, fetching, openOrders, user };
};

export default connect(mapStateToProps, actions)(Trades);
