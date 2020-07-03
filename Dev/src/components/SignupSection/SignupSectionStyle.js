import React from 'react'
import {StyleSheet} from 'react-native'
import {screenHeight, screenWidth} from 'config/dimensions'
import fontStyles from 'config/fontStyles'
import colors from 'config/colors'

export default styles = StyleSheet.create({
    container: {
      flex: 1,
      width: screenWidth,
      alignItems: 'flex-start',
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
  });