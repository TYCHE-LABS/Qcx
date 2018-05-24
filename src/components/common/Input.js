import React from 'react';
import { TextInput, View, Dimensions } from 'react-native';
import { Text } from 'react-native-elements';

const SCREEN_WIDTH = Dimensions.get('window').width;

const Input = ({
  label,
  value,
  onChangeText,
  placeholder,
  containerStyleOveride,
  labelStyleOveride,
  inputStyleOveride,
  secureTextEntry,
  keyboardType,
}) => {
  const { inputStyle, labelStyle, containerStyle } = styles;

  return (
    <View style={[containerStyle, containerStyleOveride]}>
      <Text style={[labelStyle, labelStyleOveride]}>{label}</Text>
      <TextInput
        secureTextEntry={secureTextEntry}
        placeholder={placeholder}
        placeholderTextColor={'#86888F'}
        autoCorrect={false}
        style={[inputStyle, inputStyleOveride]}
        value={value}
        onChangeText={onChangeText}
        underlineColorAndroid={'#2C3039'}
        keyboardType={keyboardType}
      />
    </View>
  );
};

const styles = {
  containerStyle: {
    height: 40,
    width: SCREEN_WIDTH * 0.8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  labelStyle: {
    fontSize: 20,
    color: '#2895F9',
    //paddingLeft: 5,
  },
  inputStyle: {
    color: '#2895F9',
    //paddingLeft: 5,
    //paddingRight: 5,
    fontSize: 20,
  },
};

export { Input };
