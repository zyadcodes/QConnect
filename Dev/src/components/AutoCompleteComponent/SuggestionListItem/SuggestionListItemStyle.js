import React from 'react'
import {StyleSheet} from 'react-native'
import {screenHeight, screenWidth} from 'config/dimensions'
import fontStyles from 'config/fontStyles'
import colors from 'config/colors'

export default styles = StyleSheet.create({
    container: {
      justifyContent: 'center',
      flex: 1,
      alignItems: 'center',
      height: 40,
      margin: 5,
    },
    card: {
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: 'black',
      shadowOpacity: 0.26,
      shadowOffset: { width: 0, height: 0.1 },
      shadowRadius: 1,
      elevation: 1,
      flex: 1,
      height: 50,
      margin: 5,
      borderRadius: 2,
      backgroundColor: 'white'
    }
  });