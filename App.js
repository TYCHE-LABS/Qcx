import React from 'react';
import { StyleSheet, View } from 'react-native';
import { StackNavigator, TabNavigator } from 'react-navigation';
import { Provider } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Sentry from 'sentry-expo';
import { PersistGate } from 'redux-persist/es/integration/react';
import configureStore from './src/store';

import CurrencyList from './src/screens/currencyList';
import CurrencyPicker from './src/screens/currencyPicker';
import CryptoDetail from './src/screens/cryptoDetail';
import TradingView from './src/screens/tradingView';

import Trades from './src/screens/trades';
import Wallet from './src/screens/wallet';
import Settings from './src/screens/settings';
import { sentryLink } from './src/components/common';

// Remove this once Sentry is correctly setup.
Sentry.enableInExpoDevelopment = true;

Sentry.config(sentryLink).install();

export default class App extends React.Component {
  render() {
    const { persistor, store } = configureStore();

    const MainNavigator = TabNavigator(
      {
        // welcome: { screen: WelcomeScreen },
        main: {
          screen: TabNavigator(
            {
              Market: {
                screen: StackNavigator(
                  {
                    currencyList: { screen: CurrencyList },
                    currencyPicker: { screen: CurrencyPicker },
                    cryptoDetail: { screen: CryptoDetail },
                    tradingView: { screen: TradingView },
                  },
                  {
                    initialRouteName: 'currencyList',
                    navigationOptions: {
                      headerStyle: {
                        backgroundColor: '#20252B',
                        borderBottomColor: '#1B1D26',
                      },
                      headerTintColor: '#2895F9',
                      headerTitleStyle: {
                        fontWeight: 'bold',
                        color: 'white',
                      },
                    },
                  }
                ),
              },
              Trades: { screen: Trades },
              Wallet: { screen: Wallet },
              Settings: {
                screen: StackNavigator(
                  {
                    //review: { screen: ReviewScreen },
                    settings: { screen: Settings },
                  },
                  {
                    initialRouteName: 'settings',
                    navigationOptions: {
                      headerStyle: {
                        backgroundColor: '#20252B',
                        borderBottomColor: '#1B1D26',
                      },
                      headerTintColor: '#2895F9',
                      headerTitleStyle: {
                        fontWeight: 'bold',
                        color: 'white',
                      },
                    },
                  }
                )
              }
            },
            {
              tabBarPosition: 'bottom',
              swipeEnabled: false,
              animationEnabled: true,
              lazyLoad: true,
              tabBarOptions: {
                labelStyle: { fontSize: 12 },
                activeTintColor: '#2895F9',
                inactiveTintColor: '#86888F',
                style: {
                  backgroundColor: '#20252B',
                },
                indicatorStyle: {
                  backgroundColor: '#2895F9',
                }
              },
              navigationOptions: ({ navigation }) => ({
                tabBarIcon: ({ focused, tintColor }) => {
                  const { routeName } = navigation.state;
                  let iconName;
                  if (routeName === 'Market') {
                    iconName = `ios-stats${focused ? '' : '-outline'}`;
                  } else if (routeName === 'Trades') {
                    iconName = `ios-book${focused ? '' : '-outline'}`;
                  } else if (routeName === 'Wallet') {
                    iconName = `ios-key${focused ? '' : '-outline'}`;
                  } else if (routeName === 'Settings') {
                    iconName = `ios-cog${focused ? '' : '-outline'}`;
                  }
                  return <Ionicons name={iconName} size={25} color={tintColor} />;
                },
              }),
            }
          ),
        },
      },
      {
        navigationOptions: {
          tabBarVisible: false,
        },
        tabBarPosition: 'bottom',
        lazy: true,
      }
    );

    return (
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <View style={styles.container}>
            <MainNavigator />
          </View>
        </PersistGate>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
