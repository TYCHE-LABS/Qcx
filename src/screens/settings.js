import React from 'react';
import { StyleSheet, View, Modal, Alert } from 'react-native';
import { Text, Button, ListItem } from 'react-native-elements';
import { connect } from 'react-redux';
import _ from 'lodash'
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as actions from '../actions';
import AuthenticateForm from '../components/authenticateForm';
import { Spinner } from '../components/common';

class Settings extends React.Component {
  static navigationOptions = {
    title: 'Settings',
  };

  state = {
    isVisible: false,
  };

  onAuthPressed = authDetails => {
    this.setState({ isVisible: false });
    this.props.saveAuthDetails(authDetails);
  };

  onCancelPress = () => {
    this.setState({ isVisible: false });
  };

  componentWillReceiveProps(nextProps) {
    //no longer testing, and error msg present
    if (nextProps.user.error !== this.props.user.error && nextProps.user.error) {
      Alert.alert(
        'Oops, something went wrong',
        `${nextProps.user.error.message}`,
        [
          {
            text: 'Try again',
            onPress: () => this.props.removeAuthDetails(),
          },
        ],
        { cancelable: false }
      );
    }
  }

  renderAuthenticationForm = () => {
    if (this.props.user.testing) return <Spinner childText="Verifying with Quadriga..."/>;

    if (!this.props.user.userAuthed) {
      return (
        <View style={styles.authContainer}>
          <Feather name="user" size={80} color="#FF9900" style={{ alignSelf: 'center' }} />
          <Text style={styles.unAuthedText}>
            Add your Quadriga Api details to submit trades, access your trading data, wallet,
            transactions and so much more!
          </Text>
          <Button
            title="Add Authentication Details"
            onPress={() => {
              this.setState({ isVisible: true });
            }}
          />
        </View>
      );
    }
    return (
      <View style={styles.authContainer}>
        <Text h4 style={styles.authedText}>
          <Feather name="user-check" size={80} color="#73E2A7" />
          {'\n'}
          Authenticated
        </Text>

        <Button
          title="Remove Authentication Details"
          onPress={() => this.props.removeAuthDetails()}
          buttonStyle={{ backgroundColor: '#FB3640' }}
        />
      </View>
    );
  };

  render() {
    console.log('this.props.user', this.props.user)
    return (
      <View style={styles.container}>
        {this.renderAuthenticationForm()}

        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.isVisible}
          onRequestClose={() => this.setState({ isVisible: false })}>
          <AuthenticateForm onAuthPress={this.onAuthPressed} onCancelPress={this.onCancelPress}/>
        </Modal>
{/*
        <ListItem
          containerStyle={styles.listItem}
          title="Security"
          titleStyle={{ color: '#73E2A7' }}
          rightElement={<Ionicons name="ios-key-outline" size={40} color="#73E2A7" />}
          onPress={() => {console.log('list item presd')}}
        />

        <ListItem
          containerStyle={styles.listItem}
          title="Beer Tip"
          titleStyle={{ color: '#FF9900' }}
          rightElement={<Ionicons name="ios-beer-outline" size={40} color="#FF9900" />}
          onPress={() => {console.log('list item presd')}}
        />

        <ListItem
          containerStyle={styles.listItem}
          title="About & Contact"
          titleStyle={{ color: '#2895F9' }}
          rightElement={<Ionicons name="ios-at-outline" size={40} color="#2895F9" />}
          onPress={() => {console.log('list item presd')}}
        />

        <ListItem
          containerStyle={styles.listItem}
          title="Rate QCX"
          titleStyle={{ color: '#FB3640' }}
          rightElement={<Ionicons name="ios-heart" size={40} color="#FB3640" />}
          onPress={() => {console.log('list item presd')}}
        />
*/}
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
  },
  authContainer: {
    padding: 8,
    //alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  unAuthedText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 22,
    padding: 20,
  },
  authedText: {
    color: '#73E2A7',
    textAlign: 'center',
    marginBottom: 20,
  },
  listItem: {
     backgroundColor: '#21252E',
     borderBottomWidth: 1,
     borderColor: '#1B1D26',
    marginBottom: 4,
  },
});

const mapStateToProps = ({ user }) => {
  return { user };
};

export default connect(mapStateToProps, actions)(Settings);
