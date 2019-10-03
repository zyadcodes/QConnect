//This class will contain all of the font styles that should be used through out the app. The default size & fontFamily will be
//defined here.
import colors from './colors';
import { PixelRatio, Platform, StyleSheet } from 'react-native';

//The default font family that'll be used throughout the app
const fontFamily = (Platform.OS === "ios" ? "Arial" : "sans-serif-medium");

//Sets the base font that'll be used throughout the app based on the size of the screen
//Sets the font size
let bodyFont = 16;
const pixelRatio = PixelRatio.get();
if (pixelRatio < 3) {
    bodyFont = 14;
}

const bodyFontSmaller = bodyFont * 0.875;
const bodyFontBigger = bodyFont * 1.25;
const titleFont = bodyFont * 1.875;

export default StyleSheet.create({

    smallTextStyleBlack: {
        fontFamily,
        fontSize: bodyFontSmaller,
        color: colors.black
    },

    smallTextStyleDarkGrey: {
        fontFamily,
        fontSize: bodyFontSmaller,
        color: colors.darkGrey
    },

    smallTextStylePrimaryDark: {
        fontFamily,
        fontSize: bodyFontSmaller,
        color: colors.primaryDark
    },

    mainTextStylePrimaryDark: {
        fontFamily,
        fontSize: bodyFont,
        color: colors.primaryDark
    },

    mainTextStylePrimaryLight: {
        fontFamily,
        fontSize: bodyFont,
        color: colors.primaryLight
    },

    mainTextStyleDarkGrey: {
        fontFamily,
        fontSize: bodyFont,
        color: colors.darkGrey
    },

    mainTextStyleBlack: {
        fontFamily,
        fontSize: bodyFont,
        color: colors.black
    },

    mainTextStyleGrey: {
        fontFamily,
        fontSize: bodyFont,
        color: colors.grey
    },

    bigTextStyleBlack: {
        fontFamily,
        fontSize: bodyFontBigger,
        color: colors.black
    },

    bigTextStyleGreen: {
        fontFamily,
        fontSize: bodyFontBigger,
        color: colors.green
    },

    bigTextStyleDarkRed: {
        fontFamily,
        fontSize: bodyFontBigger,
        color: colors.darkRed
    },

    bigTextStyleDarkGrey: {
        fontFamily,
        fontSize: bodyFontBigger,
        color: colors.darkGrey
    },

    bigTextStylePrimaryDark: {
        fontFamily,
        fontSize: bodyFontBigger,
        color: colors.primaryDark
    },

    hugeTextStylePrimaryDark: {
        fontFamily,
        fontSize: titleFont,
        color: colors.primaryDark
    },

    hugeTextStylePrimaryLight: {
        fontFamily,
        fontSize: titleFont,
        color: colors.primaryLight
    },

    hugeTextStyleBlack: {
        fontFamily,
        fontSize: titleFont,
        color: colors.black
    },

    

});

