import {StyleSheet} from 'react-native'
import colors from 'config/colors'
import {screenHeight, screenScale, screenWidth} from 'config/dimensions'

export default styles = StyleSheet.create({
    threadActionBtn: {
      flexDirection: 'row',
      backgroundColor: colors.primaryLight,
      borderColor: colors.primaryLight,
      borderWidth: 2,
      width: screenWidth / 2.7,
      borderRadius: screenWidth / 2,
      alignItems: 'center',
      justifyContent: 'space-around',
      paddingLeft: screenWidth / 150,
      paddingRight: screenWidth / 150,
    },
    commentingTextInput: {
      width: 100,
      height: 30
    },
    commentingContainer: {
      backgroundColor: '#0000ff'
    },
    btnTxt: {
      paddingLeft: screenWidth / 40,
      paddingRight: screenWidth / 40
    },
    userImage: {
      width: screenScale * 14,
      height: screenScale * 14,
      marginLeft: screenWidth / 45,
      resizeMode: 'contain'
    },
    userNameAndComment: {
      alignContent: 'space-around',
      marginLeft: screenWidth / 45,
      overflow: 'visible'
    },
    commentContainer: {
      width: screenWidth / 2,
      marginTop: screenHeight / 100,
      flexDirection: 'row',
      overflow: 'visible'
    }
  });