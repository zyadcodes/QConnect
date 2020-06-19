import React, { Component, useState, useEffect } from 'react';
import { screenWidth, screenHeight } from 'config/dimensions';
import { StyleSheet, TouchableOpacity, Text, Animated, Easing, ActivityIndicator, View } from 'react-native';
import colors from 'config/colors';
import fontStyles from 'config/fontStyles';
import styles from './ButtonSubmitStyles'

const MARGIN = screenWidth * 0.15;

export default ButtonSubmit = (props) => {

  const [isLoading, setIsLoading] = useState(false)

  buttonAnimated = new Animated.Value(0);
  growAnimated = new Animated.Value(0);
  _onPress = _onPress.bind(this);
  _isMounted = false;

  useEffect(() => {
    _isMounted = true;
    return () => {
      _onGrow();
      _isMounted = false;
    }
  }, [])

  const _onPress = () => {
    props.onSubmit();
    if (isLoading) return;

    if (_isMounted) {
      setIsLoading(true)
    }

    Animated.timing(buttonAnimated, {
      toValue: 1,
      duration: 200,
      easing: Easing.linear,
    }).start();

    setTimeout(() => {
      _onGrow();
    }, 2000);

    setTimeout(() => {
      // Actions.secondScreen();
      if (_isMounted) {
        setIsLoading(false);
      }
      buttonAnimated.setValue(0);
      growAnimated.setValue(0);
    }, 2300);
  }

  const _onGrow = () => {
    Animated.timing(growAnimated, {
      toValue: 1,
      duration: 200,
      easing: Easing.linear,
    }).start();
  }

    const changeWidth = buttonAnimated.interpolate({
      inputRange: [0, 1],
      outputRange: [screenWidth - MARGIN, MARGIN],
    });
    const changeScale = growAnimated.interpolate({
      inputRange: [0, 1],
      outputRange: [1, MARGIN],
    });

    return (
      <View style={[styles.container, props.style]}>
        <Animated.View style={{ width: changeWidth, backgroundColor: 'transparent' }}>
          <TouchableOpacity
            style={styles.button}
            onPress={_onPress}
            activeOpacity={1}>
            {isLoading ? (
              <ActivityIndicator size="small" color={colors.white} />
            ) : (
                <Text style={fontStyles.mainTextStylePrimaryDark}>{props.text}</Text>
              )}
          </TouchableOpacity>
          <Animated.View
            style={[styles.circle, { transform: [{ scale: changeScale }] }]}
          />

        </Animated.View>
      </View>
    );
}
