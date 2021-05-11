import React from 'react'
import {StyleSheet} from 'react-native'
import {screenHeight, screenWidth} from 'config/dimensions'
import fontStyles from 'config/fontStyles'
import colors from 'config/colors'

//Styles for the Teacher profile class
export default styles = StyleSheet.create({
    container: {
        backgroundColor: colors.white,
        width: screenWidth * 0.8,
        marginTop: screenHeight * 0.1,
        borderWidth: 1,
        borderRadius: 2,
        borderColor: colors.grey,
        borderBottomWidth: 1,
        shadowColor: colors.darkGrey,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 3,
        elevation: 2,
        marginLeft: 2,
        marginRight: 5,
        paddingRight: 5,
        paddingLeft: 1
    },
})