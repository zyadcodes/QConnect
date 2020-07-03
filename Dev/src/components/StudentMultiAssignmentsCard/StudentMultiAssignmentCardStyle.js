import React from 'react'
import {StyleSheet} from 'react-native'
import {screenHeight, screenWidth} from 'config/dimensions'
import fontStyles from 'config/fontStyles'
import colors from 'config/colors'

//Styles that control the look of the card, and everything within it
export default styles = StyleSheet.create({
    cardStyle: {
      flexDirection: "row",
      marginRight: screenWidth * 0.017,
      minHeight: screenHeight * 0.112,
      alignItems: "center",
      marginLeft: screenWidth * 0.017,
      marginTop: screenHeight * 0.01,
      fontFamily: "Montserrat-Regular",
      shadowColor: colors.black,
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.2,
      shadowRadius: 1.41,
      elevation: 2,
    },
    removeStudentStyle: {
      flexDirection: "row",
      justifyContent: "center",
      marginRight: screenWidth * 0.05,
      flex: 1,
    },
    infoStyle: {
      flexDirection: "column",
      justifyContent: "center",
      fontFamily: "Montserrat-Regular",
      flex: 4,
    },
    profilePicStyle: {
      width: screenWidth * 0.12,
      height: screenWidth * 0.12,
      borderRadius: screenWidth * 0.06,
      marginLeft: screenWidth * 0.05,
    }
  });