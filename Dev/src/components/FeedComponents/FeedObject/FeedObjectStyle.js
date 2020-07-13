import {StyleSheet} from 'react-native'
import colors from 'config/colors'
import {screenHeight, screenWidth, screenScale, fontScale} from 'config/dimensions'
 
export default styles = StyleSheet.create({
    medallionStyle: {
      resizeMode: 'contain',
      width: 40,
      height: 40,
      position: 'relative',
      right: 20,
      bottom: 20
    },
    userName: {
      fontWeight: 'bold',
    //   marginLeft: props.isMadeByCurrentUser ? 0 : screenWidth / 45,
    //   marginRight: props.isMadeByCurrentUser ? screenWidth / 45 : 0,
      fontSize: fontScale * 16,
      color: colors.black
    },
    userNameCurrUser: {
        marginRight: screenWidth / 45
    },
    userNameOtherUser: {
        marginLeft: screenWidth / 45
    },
    hiddenReactionsScrollView: {
      height: screenHeight / 8,
      marginTop: 5,
      position: 'relative',
      left: '25%',
      padding: 3,
      alignSelf: 'center',
      borderWidth: 4,
      borderRadius: 5,
//       borderColor:
//         props.type === 'achievement' ? '#009500' : colors.primaryDark,
//       backgroundColor:
//        props.type === 'achievement' ? '#009500' : colors.primaryDark,
    },
    hiddenReactionsScrollViewDark: {
       borderColor: colors.primaryDark,
       backgroundColor: colors.primaryDark,
    },
    hiddenReactionsScrollViewLight: {
       borderColor: colors.darkishGreen,
       backgroundColor: colors.darkishGreen,
    },
    imageAndNameContainer: {
    //   flexDirection: props.isMadeByCurrentUser ? 'row-reverse' : 'row',
      marginLeft: screenWidth / 45,
      alignItems: 'center'
    },
    imageAndNameContainerRow: {
        flexDirection: 'row'
    },  
    imageAndNameContainerRowReverse: {
        flexDirection: 'row-reverse'
    },
    containerView: {
      flex: 1,
    //   alignSelf: props.isMadeByCurrentUser ? 'flex-end' : 'flex-start',
      flexDirection: 'column',
    //   alignItems: props.isMadeByCurrentUser ? 'flex-end' : 'flex-start',
      marginTop: 0,
      overflow: 'visible',
      marginBottom: screenHeight / 40
    },
    containerViewFlexStart: {
        alignItems: 'flex-start',
        alignSelf: 'flex-start'
    },
    containerViewFlexEnd: {
        alignItems: 'flex-end',
        alignSelf: 'flex-end'
    },
    assignmentContainer: {
      alignSelf: 'center',
      flex: 3,
      overflow: 'hidden',
      borderColor: colors.lightBrown,
      borderWidth: 2,
      marginTop: screenHeight / 163.2,
      width: screenWidth / 1.6
    },
    spinnerContainerStyle: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center'
    },
    contentText: {
      color: colors.lightBrown,
      fontWeight: 'bold',
      padding: screenScale * 2,
      fontSize: fontScale * 15
    },
    userImage: {
      width: screenScale * 18,
      height: screenScale * 18,
      resizeMode: 'contain'
    },
    newAssignmentText: {
      fontSize: fontScale * 16,
      color: colors.lightBrown,
      fontWeight: 'bold'
    },
    newAssignmentTextContainer: {
      flexDirection: 'row'
    },
    addReaction: {
      alignItems: 'center',
      justifyContent: 'center',
      width: screenScale * 8,
      height: screenScale * 8,
      borderWidth: 1,
    //   backgroundColor:
    //     props.type === 'achievement' '#00ff00' : colors.primaryLight,
    //   borderColor:
    //     props.type === 'achievement' ? '#00ff00' : colors.primaryLight,
      borderRadius: (screenScale * 8) / 2,
      position: 'relative',
      bottom: screenScale * 4,
      left: screenScale * 4
    },
    addReactionGreen: {
        backgroundColor: color.pureGreen,
        borderColor: colors.pureGreen
    },
    addReactionNormal: {
        backgroundColor: colors.primaryLight,
        borderColor: colors.primaryLight
    },
    reactionView: {
      alignItems: 'center',
      justifyContent: 'space-around',
      flexDirection: 'row',
      flex: 1,
    },
    reaction: {
      alignItems: 'center',
      width: screenScale * 16,
      height: screenScale * 8,
      borderWidth: 1,
    //   backgroundColor:
    //     props.type === 'achievement' ? '#00ff00' : colors.primaryLight,
    //   borderColor:
    //     props.type === 'achievement' ? '#00ff00' : colors.primaryLight,
      borderRadius: (screenScale * 8) / 2,
      alignSelf: 'flex-end',
      position: 'relative',
      bottom: screenScale * 4,
      left: screenScale * 4,
      paddingLeft: screenWidth / 200,
      paddingRight: screenWidth / 200,
      marginRight: screenWidth / 86
    },
    reactionNormal: {
        backgroundColor: colors.primaryLight,
        borderColor: colors.primaryLight
    },
    reactionGreen: {
        backgroundColor: colors.pureGreen,
        borderColor: colors.pureGreen
    },
    contentContainerView: {
    //   borderWidth: props.type === 'achievement' ? 4 : 2,
      marginTop: 0,
      //flex: 5,
    //   paddingBottom:
    //     props.type === 'assignment' ? screenHeight / 163.5 : 0,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 4,
    //   borderColor:
    //     props.type === 'achievement' ? '#009500' : colors.lightBrown,
      backgroundColor: colors.white,
    },
    contentContainerViewIsAssignment: {
        paddingBottom: screenHeight / 163.5
    },
    contentContainerViewThickBorder: {
        borderWidth: 4,
        borderColor: colors.darkishGreen
    },
    contentContainerViewThinBorder: {
        borderWidth: 2,
        borderColor: colors.lightBrown
    }
  });