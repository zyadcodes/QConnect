import React from 'react'
import {StyleSheet} from 'react-native'
import colors from 'config/colors'
import {screenHeight, screenWidth} from 'config/dimensions'
const styles = StyleSheet.create({
    topView: {
      flexDirection: 'column',
      backgroundColor: colors.veryLightGrey
    },
    profileInfoTop: {
      paddingHorizontal: screenWidth * 0.024,
      paddingTop: screenHeight * 0.015,
      flexDirection: 'row',
      height: screenHeight * 0.125,
      borderBottomColor: colors.lightGrey,
      borderBottomWidth: 1
    },
    profileInfoTopRight: {
      flexDirection: 'column',
      alignItems: 'flex-start',
      paddingLeft: screenWidth * 0.075,
      paddingBottom: screenHeight * 0.007
    },
    innerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.grey
    },
    optionContainer: {
      backgroundColor: colors.grey,
      height: screenHeight * 0.08,
      justifyContent: 'center',
      paddingLeft: screenWidth * 0.25
    },
    box: {
      width: screenWidth * 0.049,
      height: screenHeight * 0.03,
      marginRight: screenWidth * 0.024
    },
    profileInfoBottom: {
      flexDirection: 'row',
      paddingHorizontal: screenWidth * 0.024,
      borderBottomColor: colors.grey,
      borderBottomWidth: 1
    },
    profilePic: {
      width: screenHeight * 0.1,
      height: screenHeight * 0.1,
      borderRadius: (screenHeight * 0.1) / 2
    },
    currentAssignment: {
      justifyContent: 'flex-end',
      minHeight: 150,
      borderWidth: 0.5,
      borderColor: colors.grey,
      marginBottom: 5,
      shadowColor: colors.black,
      shadowOffset: {
        width: 0,
        height: 1
      },
      shadowOpacity: 0.2,
      shadowRadius: 1.41,
      elevation: 2
    },
    middleView: {
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: screenHeight * 0.0112
    },
    bottomView: {
      flex: 3,
      backgroundColor: colors.veryLightGrey
    },
    prevAssignmentCard: {
      flexDirection: 'column',
      paddingHorizontal: screenWidth * 0.008,
      paddingBottom: screenHeight * 0.019,
      marginBottom: screenHeight * 0.009,
      borderColor: colors.grey,
      borderWidth: screenHeight * 0.13 * 0.0066,
      backgroundColor: colors.white,
      shadowColor: colors.black,
      shadowOffset: {
        width: 0,
        height: 1
      },
      shadowOpacity: 0.2,
      shadowRadius: 1.41,
      elevation: 2
    },
    profileInfo: {
      flexDirection: 'column',
      backgroundColor: colors.white
    },
    corner: {
      borderColor: '#D0D0D0',
      borderWidth: 1,
      borderRadius: 3,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: screenWidth * 0.012,
      marginRight: screenWidth * 0.015,
      marginTop: screenHeight * 0.007
    },
    prevAssignments: {
      flexDirection: 'column',
      backgroundColor: colors.veryLightGrey,
      flex: 1
    },
    classesAttended: {
      paddingLeft: 5,
      paddingRight: 5,
    },
    classesMissed: {
      paddingRight: 5,
    },
    modal: {
      backgroundColor: colors.white,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      height: 300,
      width: screenWidth * 0.75,
      borderWidth: screenHeight * 0.003,
      borderRadius: screenHeight * 0.003,
      borderColor: colors.grey,
      shadowColor: colors.darkGrey,
      shadowOffset: { width: 0, height: screenHeight * 0.003 },
      shadowOpacity: 0.8,
      shadowRadius: screenHeight * 0.0045,
      elevation: screenHeight * 0.003
    },
    cardButtonStyle: {
      flex: 1,
      marginHorizontal: 5,
      backgroundColor: 'rgba(255,255,255,0.8)',
      height: 40,
      borderRadius: 2,
      justifyContent: "center",
      alignItems: "center"
    },
  });
  export default styles