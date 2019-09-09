import React, { Component } from 'react';
import Dimensions from 'Dimensions';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import colors from 'config/colors';

export default class SignupSection extends Component {

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => { this.props.onCreateAccount(); }}>
          <Text style={styles.text}>Create Account</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => { this.props.onForgotPassword(); }}>
          <Text style={styles.text}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const DEVICE_WIDTH = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    marginTop: 5,
    flex: 1,
    width: DEVICE_WIDTH,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  text: {
    color: colors.black,
    backgroundColor: 'transparent',
  },
});
