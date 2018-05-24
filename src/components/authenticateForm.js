import React from 'react';
import { StyleSheet, View, TouchableOpacity, Switch } from 'react-native';
import { Text, Button, Input, ListItem } from 'react-native-elements';
import Feather from 'react-native-vector-icons/Feather';
import { clientId, apiKey, secret } from './common';

export default class AuthenticateForm extends React.Component {
  state = {
    clientId: clientId ? clientId : '',
    apiKey: apiKey ? apiKey : '',
    secret: secret ? secret : '',
    saveAuth: false,
    idError: null,
    apiError: null,
    secretError: null,
  };

  onAuthPress = () => {
    const { clientId, apiKey, secret, saveAuth, idError, apiError, secretError } = this.state;
    this.validateClientId(clientId);
    this.validateApi(apiKey);
    this.validateSecret(secret);

    if (
      !idError &&
      !apiError &&
      !secretError &&
      clientId !== null &&
      apiKey !== null &&
      secret !== null
    ) {
      this.props.onAuthPress({ clientId, apiKey, secret, saveAuth });
    }
  };

  validateClientId = id => {
    if (id === null || id === undefined || id === '') {
      this.clientIdInput.shake(); //visual feedback
      return new Promise((resolve, reject) =>
        reject(this.setState({ idError: 'Client id is required' }))
      ).catch(err => console.log(err));
    }
    return this.setState({ idError: null });
  };

  validateApi = api => {
    if (api === null || api === undefined || api === '') {
      this.apiKeyInput.shake(); //visual feedback
      return new Promise((resolve, reject) =>
        reject(this.setState({ apiError: 'Api Key is required' }))
      ).catch(err => console.log(err));
    }
    return this.setState({ apiError: null });
  };

  validateSecret = secret => {
    if (secret === null || secret === undefined || secret === '') {
      this.secretInput.shake(); //visual feedback
      return new Promise((resolve, reject) =>
        reject(this.setState({ secretError: 'Api Secret is required' }))
      ).catch(err => console.log(err));
    }
    return this.setState({ secretError: null });
  };

  render() {
    return (
      <View style={styles.container}>
        <Feather name="user" size={80} color="#FF9900" style={{ alignSelf: 'center' }} />
        <Input
          secureTextEntry
          label="Client Id:"
          ref={input => (this.clientIdInput = input)}
          placeholder="e.g. 8888888"
          placeholderTextColor="#86888F"
          containerStyle={styles.inputContainer}
          labelStyle={styles.inputLabels}
          inputStyle={{ color: 'white' }}
          onChangeText={clientId => this.setState({ clientId, idError: null })}
          value={this.state.clientId}
          errorMessage={this.state.idError}
        />

        <Input
          secureTextEntry
          label="Api key:"
          ref={input => (this.apiKeyInput = input)}
          placeholder="your api key"
          placeholderTextColor="#86888F"
          containerStyle={styles.inputContainer}
          labelStyle={styles.inputLabels}
          inputStyle={{ color: 'white' }}
          onChangeText={apiKey => this.setState({ apiKey, apiError: null })}
          value={this.state.apiKey}
          errorMessage={this.state.apiError}
        />

        <Input
          secureTextEntry
          label="Secret:"
          ref={input => (this.secretInput = input)}
          placeholder="your api secret"
          placeholderTextColor="#86888F"
          containerStyle={styles.inputContainer}
          labelStyle={styles.inputLabels}
          inputStyle={{ color: 'white' }}
          onChangeText={secret => this.setState({ secret, secretError: null })}
          value={this.state.secret}
          errorMessage={this.state.secretError}
        />

        {/*<ListItem
          containerStyle={styles.listItem}
          title="Encrypt details & save on deivce?"
          titleStyle={{ color: 'white' }}
          subtitle={
            <TouchableOpacity>
              <Ionicons name="ios-help-circle-outline" size={25} color="#2895F9" />
            </TouchableOpacity>
          }
          rightElement={
            <Switch
              onValueChange={value => this.setState({ saveAuth: value })}
              value={this.state.saveAuth}
              onTintColor="#2895F9"
            />
          }
        />*/}

        <Text style={styles.text}>
          (You will be authenticated until your credentials are removed, we highly recommend having passlock or biometric authentication enabled on your device)
        </Text>

        <Button title="Authenticate" buttonStyle={styles.btn} onPress={this.onAuthPress} />

        <TouchableOpacity onPress={this.props.onCancelPress} style={styles.cancel}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2C3039',
    justifyContent: 'center',
    padding: 10,
  },
  inputContainer: {
    paddingLeft: 0,
    paddingRight: 0,
    alignSelf: 'center',
  },
  inputLabels: {
    color: '#2895F9'
  },
  listItem: {
   backgroundColor: '#2C3039',
  },
  btn: {
    marginTop: 15,
    marginBottom: 10,
    marginLeft: 12,
    marginRight: 12,
  },
  text: {
    color: 'white',
    textAlign: 'center',
    paddingBottom: 10,
    paddingTop: 20,
  },
  cancel: {
    alignItems: 'center',
    padding: 10,
  },
  cancelText: {
    fontSize: 18,
    color: '#2895F9',
  },

});
