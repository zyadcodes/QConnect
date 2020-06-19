export default styles = StyleSheet.create({
    modalStyle: {
      backgroundColor: colors.white,
      alignItems: 'center',
      justifyContent: 'center',
      height: screenHeight * 0.707,
      flexDirection: 'column',
      marginTop: screenHeight * 0.15,
      borderWidth: 1,
      borderRadius: 2,
      borderColor: colors.grey,
      borderBottomWidth: 1,
      shadowColor: colors.darkGrey,
      shadowOffset: { width: 0, height: 0.003 * screenHeight },
      shadowOpacity: 0.8,
      shadowRadius: 3,
      elevation: 0.003 * screenHeight,
      marginHorizontal: screenWidth * 0.05,
    },
    textInputStyle: {
      backgroundColor: colors.lightGrey,
      alignItems: 'center',
      justifyContent: 'center',
      borderColor: colors.grey,
      borderWidth: 1 / PixelRatio.get(),
      borderRadius: 5,
      height: 30,
      paddingHorizontal: 3,
      marginRight: 5,
      marginTop: 5,
      paddingVertical: 0
    },
    corner: {
      borderColor: colors.grey,
      borderWidth: 1 / PixelRatio.get(),
      borderRadius: 5,
      height: 30,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 3,
      marginRight: 5,
      marginTop: 5,
    },
    container: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginHorizontal: 0.036 * screenWidth,
      width: screenWidth * 0.9,
    },
    text: {
      fontSize: 16,
      textAlign: 'center'
    },
    minusText: {
      fontSize: 10,
      color: colors.white,
    },
  });
  