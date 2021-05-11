import React from 'react'
import {StyleSheet} from 'react-native'
import {screenHeight, screenWidth} from 'config/dimensions'
import fontStyles from 'config/fontStyles'
import colors from 'config/colors'

//Styles that control the look of the card, and everything within it
export default styles = StyleSheet.create({
    cardStyle: {
      marginTop: screenHeight * 0.00558,
      marginBottom: screenHeight * 0.00558,
      width: screenWidth * 0.67,
      borderBottomWidth: 1,
      borderBottomColor: colors.lightGrey,
    },
    avatarStyle: {
      backgroundColor: colors.primaryLight,
    }
});
  