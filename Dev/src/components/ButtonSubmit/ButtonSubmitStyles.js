import React from 'react'
import {StyleSheet} from 'react-native'
import {screenHeight, screenWidth} from 'config/dimensions'
import fontStyles from 'config/fontStyles'
import colors from 'config/colors'

export default styles = StyleSheet.create({
    container: {
      marginTop: 0.03 * screenHeight,
      alignItems: 'center',
      justifyContent: 'flex-start',
      backgroundColor: 'transparent',
    },
    button: {
      alignItems: 'center',
      alignSelf: 'stretch',
      justifyContent: 'center',
      backgroundColor: colors.primaryLight,
      height: screenHeight * 0.05,
      borderRadius: 20,
      zIndex: 10,
    },
    circle: {
      height: screenHeight * 0.05,
      width: MARGIN,
      marginTop: -0.05 * screenHeight,
      borderWidth: 1,
      borderColor: colors.primaryLight,
      borderRadius: 100,
      alignSelf: 'center',
      zIndex: 9,
      backgroundColor: colors.primaryLight,
    },
    image: {
      width: 0.06 * screenWidth,
      height: screenHeight * 0.04,
    },
  });
  