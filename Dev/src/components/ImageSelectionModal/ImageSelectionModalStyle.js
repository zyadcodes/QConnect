import React from 'react'
import {StyleSheet} from 'react-native'
import {screenHeight, screenWidth} from 'config/dimensions'
import fontStyles from 'config/fontStyles'
import colors from 'config/colors'

//Styles for the Teacher profile class
export default styles = StyleSheet.create({
    container: {
        backgroundColor: colors.white,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        marginTop: 0.044 * screenHeight,
        borderWidth: 1,
        borderRadius: 2,
        borderColor: colors.grey,
        borderBottomWidth: 1,
        shadowColor: colors.darkGrey,
        shadowOffset: { width: 0, height: 0.002 * screenHeight },
        shadowOpacity: 0.8,
        shadowRadius: 3,
        elevation: 0.003 * screenHeight,
        marginHorizontal: screenWidth * 0.012,
        paddingHorizontal: 0.036 * screenWidth
    },
});