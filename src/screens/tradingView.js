import React from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';
import NotAuthed from '../components/notAuthed';
import TradeItem from '../components/tradeItem';

class TradingView extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: `${navigation.state.params.crypto.coin}`,
  });

  onSubmitPressed = orderDetails => {
    this.props.createOrder(orderDetails);
  };

  render() {
    const { buy, crypto, user, account } = this.props.navigation.state.params;

    if (!user.userAuthed) return <NotAuthed />;

    return (
      <TradeItem
        buy={buy}
        crypto={crypto}
        account={account}
        error={this.props.trade.error}
        onSubmitPress={this.onSubmitPressed}
      />
    );
  }
}

const mapStateToProps = ({ trade }) => {
  return { trade };
};

export default connect(mapStateToProps, actions)(TradingView);
