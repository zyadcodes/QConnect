import React from 'react'
import {StyleSheet} from 'react-native'
import {screenHeight, screenWidth} from 'config/dimensions'
import fontStyles from 'config/fontStyles'
import colors from 'config/colors'

//'rgba(255, 255, 255, 0.4)'
const styles = StyleSheet.create({
    input: {
      backgroundColor: colors.lightGrey,
      width: screenWidth * 0.9,
      height: 40,
      marginHorizontal: screenWidth * 0.06,
      paddingLeft: screenWidth * 0.11,
      borderRadius: screenWidth * 0.06,
      color: colors.darkGrey,
    },
    inputWrapper: {
      flex: 1,
    },
    inlineImg: {
      position: 'absolute',
      zIndex: 99,
      width: 30,
      height: 30,
      left: 0.075 * screenWidth,
      top: 0.005 * screenHeight
    },
  });

  export default styles