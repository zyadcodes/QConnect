import React from 'react'
import {StyleSheet} from 'react-native'

//Styles for the Teacher profile class
export default styles = StyleSheet.create({
    container: {
      backgroundColor: colors.white,
    },
    textInput: {
      flex: 1,
      paddingLeft: 5,
      backgroundColor: colors.veryLightGrey,
      height: 40,
      borderRadius: 1
    },
    infoRow: {
      flexDirection: "row",
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingLeft: screenWidth * 0.025,
      height: screenHeight * 0.08,
      borderBottomColor: colors.grey,
      borderBottomWidth: 0.25
    },
  
    passwordRow: {
      flexDirection: "column",
      justifyContent: 'space-between',
      alignContent: "flex-start",
      paddingLeft: screenWidth * 0.025,
      height: screenHeight * 0.07,
      borderBottomColor: colors.grey,
      borderBottomWidth: 0.25
    },
    infoTextInput: {
      paddingLeft: screenWidth * 0.025,
      fontSize: 14,
      color: colors.darkGrey,
      flex: 1,
      alignSelf: 'stretch'
    },
  });