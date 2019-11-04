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
  returnKeyType: PropTypes.string,
};

//'rgba(255, 255, 255, 0.4)'
const styles = StyleSheet.create({
  input: {
    backgroundColor: colors.lightGrey,
    width: screenWidth * 0.9,
    height: screenHeight * 0.06,
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
    width: 0.05 * screenHeight,
    height: 0.05 * screenHeight,
    left: 0.075 * screenWidth,
    top: 0.005 * screenHeight
  },
});
