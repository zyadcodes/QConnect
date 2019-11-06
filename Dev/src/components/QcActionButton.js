import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import colors from 'config/colors'
import FontLoadingComponent from 'components/FontLoadingComponent'
import fontStyles from 'config/fontStyles';
import { screenHeight, screenWidth } from 'config/dimensions';

class QcActionButton extends FontLoadingComponent {

  onButtonPress() {

    this.props.onPress();

  }

  render() {
    const { text, disabled, style, textStyle } = this.props;
    return (
      <TouchableOpacity disabled={disabled ? disabled : false} style={[styles.buttonStyle, style]}
        onPress={() => this.onButtonPress()}>
        <Text style={textStyle? textStyle: fontStyles.mainTextStylePrimaryDark}>{text}</Text>
      </TouchableOpacity>
    );
  }
}

QcActionButton.propTypes = {
  text: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  screen: PropTypes.string,
  style: PropTypes.object,
};


const styles = StyleSheet.create({
  buttonStyle: {
    marginHorizontal: 0.025 * screenWidth,
    marginVertical: 0.01 * screenHeight,
    paddingVertical: 0.01 * screenHeight,
    paddingHorizontal: 0.06 * screenWidth,
    borderRadius: 0.05 * screenWidth,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
});

export default QcActionButton;