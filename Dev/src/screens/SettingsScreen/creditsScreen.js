//This will be the credits screen
import React from 'react';
import { View, StyleSheet, Text, ScrollView, Linking } from 'react-native';
import colors from 'config/colors';
import strings from 'config/strings';
import QcParentScreen from "screens/QcParentScreen";
import FirebaseFunctions from 'config/FirebaseFunctions';
import QCView from 'components/QCView';
import screenStyle from 'config/screenStyle';
import fontStyles from 'config/fontStyles';
import { screenWidth, screenHeight } from 'config/dimensions';

export default class CreditsScreen extends QcParentScreen {

    componentDidMount() {

        FirebaseFunctions.setCurrentScreen("Credits Screen", "CreditsScreen");

    }

    render() {

        return (
            <QCView style={screenStyle.container}>
                <ScrollView style={styles.creditsContainer} contentContainerStyle={{}}>
                    <Text style={fontStyles.mainTextStyleBlack}>{strings.FirstScreenImageCredits}</Text>
                    <Text style={fontStyles.mainTextStylePrimaryDark} onPress={() => {
                        Linking.openURL('https://www.freepik.com/free-photos-vectors/computer')
                    }} >{strings.AvatarCredits}</Text>
                </ScrollView>
            </QCView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        backgroundColor: colors.lightGrey,
        flex: 1,
        alignItems: 'center',
    },
    creditsContainer: {
        flexDirection: 'column',
        width: screenWidth * 0.9,
        backgroundColor: colors.white,
        borderRadius: screenHeight * 0.03,
        paddingLeft: screenWidth * 0.036,
        paddingRight: screenWidth * 0.036,
        paddingTop: screenHeight * 0.022,
        paddingBottom: screenHeight * 0.022,
        marginLeft: screenWidth * 0.05,
        marginRight: screenWidth * 0.05,
        marginTop: screenHeight * 0.03,
        marginBottom: screenHeight * 0.03
    }
});
