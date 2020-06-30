import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, TextInput, Image } from 'react-native';
import colors from 'config/colors';
import { screenHeight, screenWidth } from 'config/dimensions';
import styles from './UserInputStyle'

export default UserInput = (props) => {
    return (
      <View style={styles.inputWrapper}>
        <Image source={props.source} style={styles.inlineImg} />
        <TextInput
          style={styles.input}
          placeholder={props.placeholder}
          secureTextEntry={props.secureTextEntry}
          autoCorrect={false}
          autoCapitalize={props.autoCapitalize}
          returnKeyType={props.returnKeyType}
          placeholderTextColor={colors.darkishGrey}
          onChangeText={props.onChangeText}
          underlineColorAndroid="transparent"
        />
      </View>
    );
}

UserInput.propTypes = {
  source: PropTypes.number.isRequired,
  placeholder: PropTypes.string.isRequired,
  secureTextEntry: PropTypes.bool,
  autoCorrect: PropTypes.bool,
  autoCapitalize: PropTypes.string,
  returnKeyType: PropTypes.string,
};

