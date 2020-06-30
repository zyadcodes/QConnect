import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import colors from 'config/colors'
import FontLoadingComponent from 'components/FontLoadingComponent'
import fontStyles from 'config/fontStyles';
import { screenHeight, screenWidth } from 'config/dimensions';
import styles from './QcActionButtonStyle'

const QcActionButton = (props) => {

  const onButtonPress = () => {
    props.onPress();
  }

    const { text, disabled, style, textStyle } = props;
    return (
      <TouchableOpacity disabled={disabled ? disabled : false} style={[styles.buttonStyle, style]}
        onPress={() => onButtonPress()}>
        <Text style={textStyle? textStyle: fontStyles.mainTextStylePrimaryDark}>{text}</Text>
      </TouchableOpacity>
    );
}

QcActionButton.propTypes = {
  text: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  screen: PropTypes.string,
  style: PropTypes.object,
};

export default QcActionButton;