import React from 'react';
import { Text, Platform } from 'react-native';

const MyAppText = ({
  children,
  style,
  selectable,
  accessible,
  ellipsizeMode,
  numberOfLines,
  onLongPress,
  testID,
  selectionColor,
  adjustsFontSizeToFit,
  suppressHighlighting,
}) => {
  const { textStyle } = styles;

  return (
    <Text
      style={[textStyle, style]}
      selectable={selectable}
      accessible={accessible}
      ellipsizeMode={ellipsizeMode}
      numberOfLines={numberOfLines}
      onLongPress={onLongPress}
      testID={testID}
      selectionColor={selectionColor}
      adjustsFontSizeToFit={adjustsFontSizeToFit}
      suppressHighlighting={suppressHighlighting}
      allowFontScaling={false}
      minimumFontScale={0.01}>
      {children}
    </Text>
  );
};

const styles = {
  textStyle: {
    //alignSelf: 'center',
    color: '#2895F9',
    fontSize: 18,

    ...Platform.select({
      ios: {
        fontFamily: 'HelveticaNeue-Thin',
      },
      android: {
        fontFamily: 'sans-serif-thin',
      },
    }),
  },
};

export { MyAppText };
