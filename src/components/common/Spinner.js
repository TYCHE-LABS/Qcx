import React from 'react';
import { Text, ActivityIndicator, View, StyleSheet } from 'react-native';

const Spinner = ({
  childText
}) => {

  return (
    <View style={styles.indicatorContainer}>
      <ActivityIndicator size="large" color="#2895F9" />
      <Text style={styles.indicatorText}>
        {childText ? childText : 'Getting the latest data! Hold on!'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  indicatorContainer: {
    justifyContent: 'center',
    flexDirection: 'column',
    paddingTop: 64,
    backgroundColor: '#2C3039',
    flex: 1,
  },
  indicatorText: {
    color: '#2895F9',
    textAlign: 'center',
    fontSize: 20,
  },
});

export { Spinner };
