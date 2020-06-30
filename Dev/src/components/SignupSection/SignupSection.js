import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import fontStyles from 'config/fontStyles';
import strings from '../../../config/strings';
import { screenWidth } from 'config/dimensions';
import styles from './SignupSectionStyle'

export default SignupSection = (props) => {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => { props.onCreateAccount(); }}>
          <Text style={fontStyles.mainTextStyleBlack}>{strings.CreateAccount}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => { props.onForgotPassword(); }}>
          <Text style={fontStyles.mainTextStyleBlack}>{strings.ForgotPasswordQuestion}</Text>
        </TouchableOpacity>
      </View>
    );
}

