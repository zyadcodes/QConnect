import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, TextInput, Image } from 'react-native';
import colors from 'config/colors';
import { screenHeight, screenWidth } from 'config/dimensions';


export default class UserInput extends Component {
  render() {
    return (
      <View style={styles.inputWrapper}>
        <Image source={this.props.source} style={styles.inlineImg} />
        <TextInput
          style={styles.input}
          accessibilityLabel={this.props.accessibilityLabel}
          placeholder={this.props.placeholder}
          secureTextEntry={this.props.secureTextEntry}
          autoCorrect={false}
          autoCapitalize={this.props.autoCapitalize}
          returnKeyType={this.props.returnKeyType}
          placeholderTextColor={colors.darkishGrey}
          onChangeText={this.props.onChangeText}
          underlineColorAndroid="transparent"
        />
      </View>
    );
  }
}

UserInput.propTypes = {
  source: PropTypes.number.isRequired,
  placeholder: PropTypes.string.isRequired,
  secureTextEntry: PropTypes.bool,
  autoCorrect: PropTypes.bool,
  autoCapitalize: PropTypes.string,
  accessibilityLabel: PropTypes.string,
  returnKeyType: PropTypes.string,
};

//'rgba(255, 255, 255, 0.4)'
const styles = StyleSheet.create({
  input: {
    backgroundColor: colors.lightGrey,
    width: screenWidth * 0.9,
    height: 40,
    marginHorizontal: screenWidth * 0.06,
    paddingLeft: screenWidth * 0.11,
    borderRadius: screenWidth * 0.06,
    color: colors.darkGrey,
  },
  inputWrapper: {
    flex: 1,
  },
  inlineImg: {
    position: 'absolute',
    zIndex: 99,
    width: 30,
    height: 30,
    left: 0.075 * screenWidth,
    top: 0.005 * screenHeight
  },
});
