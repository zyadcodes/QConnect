import React, { Component, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Image } from 'react-native';
import UserInput from 'components/UserInput/UserInput';
import usernameImg from '../../screens/images/username.png';
import passwordImg from '../../screens/images/password.png';
import eyeImg from '../../screens/images/eye_black.png';
import { screenHeight, screenWidth } from 'config/dimensions';
import strings from "config/strings";
import styles from './FormStyle'

export default Form = (props) => {
  const [showPass, setShowPass] = useState(true)
  const [press, setPress] = useState(false)

  const shouldShowPass = () => {
    press === false
      ? setShowPassAndPress(false, true)
      : setShowPassAndPress(true, false)
  }

  const setShowPassAndPress = (showPass, press) => {
    setShowPass(showPass)
    setPress(press)
  }

    return (
      <View style={styles.container}>
        <View style={styles.standardView}>
          <UserInput
            source={usernameImg}
            placeholder={strings.emailPlaceHolder}
            autoCapitalize={'none'}
            returnKeyType={'done'}
            autoCorrect={false}
            onChangeText={props.onUserNameChange}
          />
        </View>
        <View style={styles.standardView}>
          <UserInput
            source={passwordImg}
            secureTextEntry={showPass}
            placeholder="Password"
            returnKeyType={'done'}
            autoCapitalize={'none'}
            autoCorrect={false}
            onChangeText={props.onPwChange}
          />
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.btnEye}
            onPress={() => shouldShowPass()}
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

