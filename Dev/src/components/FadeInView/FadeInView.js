import React, { useEffect, useState } from 'react';
import { Animated } from 'react-native';
import { useSelector } from 'react-redux';

export default FadeInView = (props) => {
  const [fadeAnim, setFadeAnim] = useState(new Animated.Value(0))  // Initial value for opacity: 0

  useEffect(() => {
    Animated.timing(                  // Animate over time
      fadeAnim,            // The animated value to drive
      {
        toValue: 1,                   // Animate to opacity: 1 (opaque)
        duration: 6000,              // Make it take a while
        useNativeDriver: true
      }
    ).start();                        // Starts the animation
  }, [])

    return (
      <Animated.View                 // Special animatable View
        style={{
          ...props.style,
          opacity: fadeAnim,         // Bind opacity to animated value
          useNativeDriver: true
        }}
      >
        {props.children}
      </Animated.View>
    );
}