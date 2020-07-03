import React from 'react'
import {StyleSheet} from 'react-native'
import {screenHeight, screenWidth} from 'config/dimensions'
import fontStyles from 'config/fontStyles'
import colors from 'config/colors'

export default styles = StyleSheet.create({
    container: {
        height: screenHeight * 0.125,
        backgroundColor: colors.white,
        borderBottomWidth: 0.25,
        borderBottomColor: colors.black,
    },
    entireTopView: {
        height: screenHeight * 0.095,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    topLeftView: {
        flex: 1.,
        paddingTop: screenHeight * 0.035,
        paddingBottom: screenHeight * 0.01
    },
    topMiddleView: {
        justifyContent: 'center',
        alignSelf: 'center',
        alignItems: 'center',
        flex: 10,
        paddingTop: screenHeight * 0.035,
        paddingBottom: screenHeight * 0.01
    },
    topRightView: {
        flex: 1.5,
        justifyContent: 'center',
        paddingTop: screenHeight * 0.035,
        paddingBottom: screenHeight * 0.01
    },
    profilePic: {
        width: screenHeight * 0.060,
        height: screenHeight * 0.060,
        borderRadius: screenHeight * 0.09,
    },
    picContainer: {
        paddingTop: 0 - screenHeight * .02,
        //width: screenHeight *.03,
        //height: screenHeight *.03,
        alignItems: 'center',
    },
    updateImage: {
        paddingLeft: screenWidth * 0.01
    }

});