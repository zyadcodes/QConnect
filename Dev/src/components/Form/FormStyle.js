import React from 'react'
import {StyleSheet} from 'react-native'
import {screenHeight, screenWidth} from 'config/dimensions'
import fontStyles from 'config/fontStyles'
import colors from 'config/colors'

export default styles = StyleSheet.create({
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
    standardView: {
        flex: 1
    }
  });