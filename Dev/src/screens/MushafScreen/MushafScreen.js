//Screen which will provide all of the possible settings for the user to click on
import React from 'react';
import { View, Text, StyleSheet, } from 'react-native';
import colors from 'config/colors';
import strings from 'config/strings';
import QcParentScreen from "screens/QcParentScreen";
import FirebaseFunctions from 'config/FirebaseFunctions';
import QCView from 'components/QCView';
import screenStyle from 'config/screenStyle';
import Page from './Components/Page';

export default class MushafScreen extends QcParentScreen {
    
    //Sets the screen for firebase analytics
    componentDidMount() {
        FirebaseFunctions.setCurrentScreen("All Settings Screen", "AllSettingsScreen");
    }

    render() {
        return (
            <QCView style={screenStyle.container}>
                <Page />
            </QCView>
        )
    }
}

const styles = StyleSheet.create({
    ayahLine: { 

    },
    ayahText: {
        padding: 5,
        textAlign: 'right', 
        fontFamily: 'me_quran', 
        fontSize: 30, 
        color: colors.darkGrey
    }
})