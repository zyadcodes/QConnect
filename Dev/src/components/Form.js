import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Image } from 'react-native';
import UserInput from 'components/UserInput';
import usernameImg from '../screens/images/username.png';
import passwordImg from '../screens/images/password.png';
import eyeImg from '../screens/images/eye_black.png';
import { screenHeight, screenWidth } from 'config/dimensions';
import strings from "config/strings";

export default class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showPass: true,
      press: false,
    };
    this.showPass = this.showPass.bind(this);
  }

  showPass() {
    this.state.press === false
      ? this.setState({ showPass: false, press: true })
      : this.setState({ showPass: true, press: false });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{ flex: 1 }}>
          <UserInput
            source={usernameImg}
            placeholder={strings.emailPlaceHolder}
            accessibilityLabel="Email"
            autoCapitalize={'none'}
            returnKeyType={'done'}
            autoCorrect={false}
            onChangeText={this.props.onUserNameChange}
          />
        </View>
        <View style={{ flex: 1 }}>
          <UserInput
            source={passwordImg}
            secureTextEntry={this.state.showPass}
            accessibilityLabel="Password"
            placeholder="Password"
            returnKeyType={'done'}
            autoCapitalize={'none'}
            autoCorrect={false}
            onChangeText={this.props.onPwChange}
          />
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.btnEye}
            onPress={this.showPass}
          >
            <Image
              source={eyeImg}
              resizeMode="contain"
              style={styles.iconEye}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center'
  },
  btnEye: {
    top: 0.009 * screenHeight,
    position: 'absolute',
    right: 0.07 * screenWidth,
  },
  iconEye: {
    width: 30,
    height: 25,
    tintColor: 'rgba(0,0,0,0.2)'
  },
});
