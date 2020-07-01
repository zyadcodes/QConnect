import React from 'react'
import {StyleSheet} from 'react-native'

export default style = StyleSheet.create({
    container: {
      flexDirection: 'column',
      justifyContent: 'flex-start',
      width: screenWidth * 0.9,
      height: screenHeight * 0.9
    },
    input: {
      fontSize: 22,
      borderBottomWidth: 1,
    },
    flatList: {},
    inputDefaultStyle: {
      height: screenHeight * 0.08,
      marginVertical: screenHeight * 0.01,
      color: colors.darkGrey,
      backgroundColor: colors.black,
      borderBottomColor: colors.darkGrey,
      borderBottomWidth: 1,
      textAlign: "right",
      paddingTop: 10,
    },
    itemTextStyle: fontStyles.bigTextStylePrimaryDark,
  });