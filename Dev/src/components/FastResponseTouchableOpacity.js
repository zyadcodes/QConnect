import React, { Component } from 'react';
import { Animated, View } from 'react-native';

export default class FastResponseTouchableOpacity extends Component {
  opacity = new Animated.Value(1.0);

  animateTouchStart() {
    Animated.timing(this.opacity, {
      toValue: 0.2,
      duration: 50
    }).start();
  }
  animateTouchEnd() {
    Animated.timing(this.opacity, {
      toValue: 1.0,
      duration: 50
    }).start();
  }
  render() {
    return (
      <View
        onTouchStart={() => {
          if (!this.props.disabled) {
            this.props.onPress();
            this.animateTouchStart();
          }
        }}
        onTouchEnd={() => {
          if (!this.props.disabled) {
            this.animateTouchEnd();
          }
        }}
      >
        <Animated.View
          style={[
            this.props.style,
            { opacity: this.props.disabled ? 0.3 : this.opacity },
          ]}
        >
          {this.props.children}
        </Animated.View>
      </View>
    );
  }
}
