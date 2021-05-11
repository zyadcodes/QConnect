import React from 'react'
import {StyleSheet} from 'react-native'
import {screenHeight, screenWidth} from 'config/dimensions'
import fontStyles from 'config/fontStyles'
import colors from 'config/colors'

export default styles = StyleSheet.create({
    modal: {
        backgroundColor: colors.lightGrey,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        marginVertical: screenHeight * 0.03,
        borderWidth: 1,
        borderRadius: 2,
        borderColor: colors.grey,
        borderBottomWidth: 1,
        shadowColor: colors.darkGrey,
        shadowOffset: { width: 0, height: screenHeight * 0.0029 },
        shadowOpacity: 0.8,
        shadowRadius: screenHeight * 0.004,
        elevation: screenHeight * 0.003,
        marginHorizontal: screenWidth * 0.11,
        paddingHorizontal: 0.012 * screenWidth
    },
    inactiveAssignmentStyle: {
        borderRadius: screenWidth * 0.025,
    },
    spacer: {
        height: screenHeight * 0.01
    }
});