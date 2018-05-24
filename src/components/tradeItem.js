import React from 'react';
import { StyleSheet, View, Alert, ScrollView } from 'react-native';
import { Card, Text, Button, ButtonGroup, Input } from 'react-native-elements';
import _ from 'lodash';
import PopupDialog, { SlideAnimation, DialogTitle } from 'react-native-popup-dialog';
import {
  isNumeric,
  buySellColorHelper,
  marketLimitColorHelper,
  cryptoTradeTotalCalculator,
} from '../components/common';

const BUTTONS = ['MARKET', 'LIMIT'];
const SLIDE_ANIMATION = new SlideAnimation({
  slideFrom: 'bottom',
});

export default class TradeItem extends React.Component {
  state = {
    selectedIndex: 0,
    amount: '',
    limitPrice: '',
    amountError: null,
    limitError: null,
    errorAlertShown: false,
  };

  componentWillReceiveProps = nextProps => {
    if (this.props.error !== nextProps.error) return this.setState({ errorAlertShown: false });
  };

  // case 0 limit, case 1 market
  updateButtonIndex = selectedIndex => {
    switch (selectedIndex) {
      case 0:
        return this.setState({ selectedIndex, limitPrice: '', limitError: null });
      case 1:
        return this.setState({ selectedIndex });
      default:
        return this.setState({ selectedIndex });
    }
  };

  validateAmount = amount => {
    if (amount === null || amount === undefined || amount === '' || !isNumeric(amount)) {
      this.amountInput.shake();
      return this.setState({ amountError: 'please enter a valid amount' });
    }
    return this.setState({ amountError: null });
  };

  validateLimit = limitPrice => {
    if (
      limitPrice === null ||
      limitPrice === undefined ||
      limitPrice === '' ||
      !isNumeric(limitPrice)
    ) {
      this.limitInput.shake();
      return this.setState({ limitError: 'Please enter a valid price limit' });
    }
    return this.setState({ limitError: null });
  };

  onConfirmPress = () => {
    const { amount, limitPrice, amountError, limitError, selectedIndex } = this.state;
    if (selectedIndex === 0) {
      this.validateAmount(amount);
      if (!amountError && amount !== '') return this.popupDialog.show();
    }

    if (selectedIndex === 1) {
      this.validateAmount(amount);
      this.validateLimit(limitPrice);
      if (!amountError && amount !== '' && limitPrice !== '' && !limitError) {
        return this.popupDialog.show();
      }
    }
  };

  onSubmitPress = () => {
    const crypto = this.props.crypto;
    const { amount, limitPrice, selectedIndex } = this.state;
    const orderType = selectedIndex ? `limit` : `market`;
    const buy = this.props.buy ? `buy` : `sell`;
    this.props.onSubmitPress({ crypto, amount, limitPrice, orderType, buy });
  };

  renderLimitInput = () => {
    const { fiat, color } = this.props.crypto;
    const selectedIndex = this.state.selectedIndex;
    if (selectedIndex === 1) return (
        <Input
          keyboardType="numeric"
          label={`Price in ${fiat}:`}
          placeholder="...desired price"
          placeholderTextColor="#86888F"
          labelStyle={marketLimitColorHelper(selectedIndex, 'color')}
          inputStyle={{ color }}
          onChangeText={limitPrice => this.setState({ limitPrice, limitError: null })}
          value={this.state.limitPrice}
          errorMessage={this.state.limitError}
          ref={input => (this.limitInput = input)}
          containerStyle={{ alignSelf: 'center', paddingTop: 10 }}
        />
      );
  };

  renderInput = selectedIndex => {
    const { coin, color } = this.props.crypto;
    return (
      <View>
        <Input
          keyboardType="numeric"
          label={`Amount ${coin}: `}
          placeholder={`e.g. 0.003 ${coin}`}
          placeholderTextColor="#86888F"
          labelStyle={marketLimitColorHelper(selectedIndex, 'color')}
          inputStyle={{ color }}
          onChangeText={amount => this.setState({ amount, amountError: null })}
          value={this.state.amount}
          errorMessage={this.state.amountError}
          ref={input => (this.amountInput = input)}
          containerStyle={{ alignSelf: 'center', paddingTop: 10 }}
        />
        {this.renderLimitInput()}
      </View>
    );
  };

  renderAlert = () => {
    if (this.props.error && !this.state.errorAlertShown) {
      return Alert.alert(
        'An error occured',
        `The response given back by quadriga was: \n "${
          this.props.error.message
        }", \n please try again`,
        [{ text: 'OK', onPress: () => this.setState({ errorAlertShown: true }) }]
      );
    }
  };

  render() {
    const { selectedIndex, amount, limitPrice } = this.state;
    const {
      buy,
      crypto: { coin, color, fiat, last },
      account,
    } = this.props;
    const lowerCaseCoin = coin.toLowerCase();
    const lowerCaseFiat = fiat.toLowerCase();
    const availableCoin = account.balance[lowerCaseCoin].available;
    const availableFiat = account.balance[lowerCaseFiat].available;
    return (
      <View style={{ flex: 1, backgroundColor: '#21252E' }}>
        <ScrollView style={styles.container}>
          <Card
            title={buy ? `BUY` : `SELL`}
            dividerStyle={marketLimitColorHelper(selectedIndex, 'backgroundColor')}
            titleStyle={[styles.titleStyle, buySellColorHelper(buy, 'color')]}
            containerStyle={[
              styles.cardStyle,
              buySellColorHelper(buy, 'borderLeftColor'),
              marketLimitColorHelper(selectedIndex, 'borderColor'),
            ]}>
            <Text style={[styles.textLabel, marketLimitColorHelper(selectedIndex, 'color')]}>
              Last traded
              <Text style={{ color }}> {coin} </Text>
              value:{'\n'}~${last}
            </Text>

            <ButtonGroup
              onPress={this.updateButtonIndex}
              selectedIndex={selectedIndex}
              buttons={BUTTONS}
              containerStyle={styles.btnGroupContainer}
              selectedButtonStyle={{ backgroundColor: '#20252B' }}
              selectedTextStyle={marketLimitColorHelper(selectedIndex, 'color')}
            />

            {this.renderInput(selectedIndex)}

            <View style={styles.itemRow}>
              <Text style={[styles.totalTextLabel, marketLimitColorHelper(selectedIndex, 'color')]}>
                Available {coin}:
              </Text>

              <Text style={[styles.totalDetailText, marketLimitColorHelper(selectedIndex, 'color')]}>
                {availableCoin}
              </Text>
            </View>

            <View style={styles.itemRow}>
              <Text style={[styles.totalTextLabel, marketLimitColorHelper(selectedIndex, 'color')]}>
                Available {fiat}:
              </Text>

              <Text style={[styles.totalDetailText, marketLimitColorHelper(selectedIndex, 'color')]}>
                {availableFiat}
              </Text>
            </View>

            <View style={[styles.itemRow, { paddingTop: 10 }]}>
              <Text style={[styles.totalTextLabel, buySellColorHelper(buy, 'color')]}>
                Estimated {buy ? `cost` : `total`}:
              </Text>

              <Text style={[styles.totalDetailText, { color }]}>
                {_.round(cryptoTradeTotalCalculator(amount, last, limitPrice).total, 5)} {fiat}
              </Text>
            </View>

            <Button
              title={buy ? `Confirm buy` : `Confirm sell`}
              buttonStyle={[styles.btnStyle, buySellColorHelper(buy, 'backgroundColor')]}
              onPress={this.onConfirmPress}
            />
          </Card>
          {this.renderAlert()}
        </ScrollView>
        <PopupDialog
          ref={popupDialog => {
            this.popupDialog = popupDialog;
          }}
          dialogAnimation={SLIDE_ANIMATION}
          dialogTitle={
            <DialogTitle
              title={`Please confirm ${buy ? 'buy order' : 'sell order'}`}
              titleStyle={[{ backgroundColor: '#2C3039' }, buySellColorHelper(buy, 'borderColor')]}
              titleTextStyle={{ color: '#2895F9' }}
            />
          }
          height={0.55}
          dialogStyle={{ backgroundColor: '#2C3039', bottom: -10 }}>
          <View style={{ justifyContent: 'space-around', flex: 1 }}>
            <Text style={styles.dialogText}>
              You are placing an {selectedIndex ? 'limit' : 'market'} order to{' '}
              {buy ? 'buy' : 'sell'} {amount} {coin} at a price of{' '}
              ~{selectedIndex ? limitPrice : last} {fiat}/{coin}.
              {'\n'}
              {'\n'}
              The total value of this order is
              ~{_.round(cryptoTradeTotalCalculator(amount, last, limitPrice).total, 5)} {fiat}
            </Text>

            <Button
              title="Submit trade"
              buttonStyle={[styles.btnStyle, buySellColorHelper(buy, 'backgroundColor')]}
              onPress={this.onSubmitPress}
            />
          </View>
        </PopupDialog>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#21252E',
  },
  titleStyle: {
    fontSize: 30,
    paddingTop: 10,
  },
  cardStyle: {
    flex: 1,
    padding: 0,
    backgroundColor: '#2C3039',
    justifyContent: 'space-between',
    borderLeftWidth: 4,
    marginBottom: 20,
    paddingBottom: 20,
  },
  btnGroupContainer: {
    borderColor: '#1B1D26',
    backgroundColor: '#2C3039',
  },
  inputContainer: {
    borderWidth: 1,
    borderRadius: 8,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10,
  },
  textLabel: {
    fontSize: 25,
    paddingTop: 20,
    paddingBottom: 20,
    textAlign: 'center',
    justifyContent: 'space-between',
  },
  totalTextLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    alignSelf: 'flex-start',
    paddingLeft: 20,
  },
  totalDetailText: {
    textAlign: 'right',
    fontSize: 18,
    alignSelf: 'center',
    paddingRight: 20,
  },
  btnStyle: {
    marginTop: 30,
    marginLeft: 10,
    marginRight: 10,
    borderColor: '#1B1D26',
    borderRadius: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 2,
    shadowOpacity: 0.6,
  },
  dialogText: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingRight: 10,
    paddingLeft: 10,
    color: '#2895F9',
  }
});
