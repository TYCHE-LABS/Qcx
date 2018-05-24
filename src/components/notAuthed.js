import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-elements';
import Feather from 'react-native-vector-icons/Feather';
import { withNavigation } from 'react-navigation';

class NotAuthed extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Feather name="user-x" size={80} color="#FB3640" style={{ alignSelf: 'center' }} />
        <Text style={styles.text}>
          You are not authorized, please fill in your api details to see your data, conduct trades, and much more!
        </Text>
        <Button
          title="Add Authentication Details"
          onPress={() => {
            this.props.navigation.navigate('Settings');
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 64,
    padding: 8,
    backgroundColor: '#2C3039',
    justifyContent: 'center',
    flex: 1,
  },
  text: {
    textAlign: 'center',
    color: 'white',
    fontSize: 22,
    padding: 20,
  },
});

export default withNavigation(NotAuthed);
