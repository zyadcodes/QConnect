//This class will contain all of the font styles that should be used through out the app. The default size & fontFamily will be
//defined here.
import colors from './colors';
import { PixelRatio, Platform, StyleSheet } from 'react-native';

//The default font family that'll be used throughout the app
const fontFamily = 'Montserrat-Regular'; //(Platform.OS === "ios" ? "Arial" : "sans-serif-medium");

//Sets the base font that'll be used throughout the app based on the size of the screen
//Sets the font size
let bodyFont = 14;
const pixelRatio = PixelRatio.get();

export default StyleSheet.create({

    smallTextStyleBlack: {
        fontFamily,
        fontSize: bodyFontSmaller,
        color: colors.darkGrey
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
        fontSize: bodyFont,
        color: colors.darkGrey
    },

    mainTextStyleGrey: {
        fontFamily,
        fontSize: baseFontSize,
        color: colors.grey
    },

    mainTextStyleGreen: {
        fontFamily,
        fontSize: bodyFont,
        color: colors.darkGreen
    },

    mainTextStyleDarkRed: {
        fontFamily,
        fontSize: bodyFont,
        color: colors.darkRed
    },

    bigTextStyleBlack: {
        fontFamily,
        fontSize: bodyFontBigger,
        color: colors.darkGrey
    },

    bigTextStyleGreen: {
        fontFamily,
        fontSize: bodyFontBigger,
        color: colors.darkGreen
    },

    bigTextStyleDarkRed: {
        fontFamily,
        fontSize: bodyFontBigger,
        color: colors.darkRed
    },

    bigTextStyleDarkGrey: {
        fontFamily,
        fontSize: baseFontSize * 1.25,
        color: colors.darkGrey
    },

    bigTextStyleDarkestGrey: {
        fontFamily,
        fontSize: bodyFontBigger,
        color: colors.darkestGrey
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

