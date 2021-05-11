import React from 'react'
import {StyleSheet} from 'react-native'
import {screenHeight, screenWidth} from 'config/dimensions'
import fontStyles from 'config/fontStyles'
import colors from 'config/colors'

export default styles = StyleSheet.create({
    imageStyle: {
        height: 0.088 * screenHeight,
        width: 0.088 * screenHeight,
        marginLeft: screenWidth * 0.036,
        marginTop: 0.022 * screenHeight,
        paddingHorizontal: 0.022 * screenWidth,
        paddingVertical: screenHeight * 0.022,
        borderRadius: 0.044 * screenHeight,
    },
});