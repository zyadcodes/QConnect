//This class will contain all of the font styles that should be used through out the app. The default size & fontFamily will be
//defined here.
import colors from './colors';
import { PixelRatio, Platform, StyleSheet } from 'react-native';

//The default font family that'll be used throughout the app
const fontFamily = (Platform.OS === "ios" ? "Arial" : "sans-serif-medium");

//Sets the base font that'll be used throughout the app based on the size of the screen
//Sets the font size
let baseFontSize = 16;
const pixelRatio = PixelRatio.get();
if (pixelRatio < 3) {
    baseFontSize = 14;
}

export default StyleSheet.create({

    smallTextStyleBlack: {
        fontFamily,
        fontSize: baseFontSize * 0.75,
        color: colors.black
    },

    smallTextStyleDarkGrey: {
        fontFamily,
        fontSize: baseFontSize * 0.75,
        color: colors.darkGrey
    },

    smallTextStylePrimaryDark: {
        fontFamily,
        fontSize: baseFontSize * 0.75,
        color: colors.primaryDark
    },

    mainTextStylePrimaryDark: {
        fontFamily,
        fontSize: baseFontSize,
        color: colors.primaryDark
    },

    mainTextStylePrimaryLight: {
        fontFamily,
        fontSize: baseFontSize,
        color: colors.primaryLight
    },

    mainTextStyleDarkGrey: {
        fontFamily,
        fontSize: baseFontSize,
        color: colors.darkGrey
    },

    mainTextStyleBlack: {
        fontFamily,
        fontSize: baseFontSize,
        color: colors.black
    },

    mainTextStyleGrey: {
        fontFamily,
        fontSize: baseFontSize,
        color: colors.grey
    },

    bigTextStyleBlack: {
        fontFamily,
        fontSize: baseFontSize * 1.25,
        color: colors.black
    },

    bigTextStyleDarkGrey: {
        fontFamily,
        fontSize: baseFontSize * 1.25,
        color: colors.darkGrey
    },

    bigTextStylePrimaryDark: {
        fontFamily,
        fontSize: baseFontSize * 1.25,
        color: colors.black
    },

    hugeTextStylePrimaryDark: {
        fontFamily,
        fontSize: baseFontSize * 1.875,
        color: colors.primaryDark
    }

});

