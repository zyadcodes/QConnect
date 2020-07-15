import {StyleSheet} from 'react-native'
import colors from 'config/colors'
import {screenHeight, screenWidth, fontScale} from 'config/dimensions'

export default styles = StyleSheet.create({
    assignmentContainer: {
      alignSelf: 'center',
      height: screenHeight / 6,
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
    newAssignmentText: {
      fontSize: fontScale * 16,
      color: colors.lightBrown,
      flexWrap: 'nowrap',
      fontWeight: 'bold'
    },
  });