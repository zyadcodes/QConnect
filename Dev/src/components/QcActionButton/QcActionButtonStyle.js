import React from 'react'
import {StyleSheet} from 'react-native'
import {screenHeight, screenWidth} from 'config/dimensions'
import fontStyles from 'config/fontStyles'
import colors from 'config/colors'

export default styles = StyleSheet.create({
    buttonStyle: {
      marginHorizontal: 0.025 * screenWidth,
      marginVertical: 0.01 * screenHeight,
      paddingVertical: 0.01 * screenHeight,
      paddingHorizontal: 0.06 * screenWidth,
      borderRadius: 0.05 * screenWidth,
      backgroundColor: colors.primaryLight,
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
    },
  });