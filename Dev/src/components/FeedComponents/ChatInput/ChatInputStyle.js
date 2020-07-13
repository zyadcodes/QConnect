import {StyleSheet} from 'react-native'
import colors from 'config/colors'
import {screenWidth} from 'config/dimensionn'

export default styles = StyleSheet.create({
    sendBtn: {
      paddingVertical: 1,
      paddingHorizontal: 5,
      borderWidth: 5,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.primaryLight,
      borderColor: colors.primaryLight,
      borderRadius: 10,
    },
    commentingContainer: {
      alignItems: 'flex-end',
      flexDirection: 'row',
      justifyContent: 'space-around',
      backgroundColor: '#f7f7f9'
    },
    commentingTextInput: {
      borderWidth: 2,
      borderRadius: 10,
      height: '70%',
      flexWrap: 'wrap',
      marginLeft: screenWidth / 15,
      borderColor: colors.primaryDark,
      width: screenWidth / 1.75
    },
  });