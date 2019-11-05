import React, { Component } from 'react';
import { Text, StyleSheet, View, TextInput } from 'react-native';
import QCView from 'components/QCView';
import strings from 'config/strings';
import colors from 'config/colors';
import QcActionButton from 'components/QcActionButton';
import { Alert } from 'react-native';
import FirebaseFunctions from 'config/FirebaseFunctions';
import screenStyle from 'config/screenStyle';
import fontStyles from 'config/fontStyles';
import { screenHeight, screenWidth } from 'config/dimensions';

class ForgotPassword extends Component {

    //Sets the screen for firebase analytics
    componentDidMount() {

        FirebaseFunctions.setCurrentScreen("Forgot Password", "ForgotPassword");

    }

    state = {
        emailText: "",
        verificationCode: "",
        disabled: true
    }

    render() {
        return (
            <QCView style={[screenStyle.container, {
                alignItems: 'center'
            }]}>
                <View style={{ flex: 1 }}></View>
                <View style={{ flex: 0.5, alignSelf: 'flex-start', justifyContent: 'flex-end' }}>
                    <View style={{ flexDirection: 'row', flex: 1, alignSelf: 'flex-end' }}>
                        <View style={{ flex: 0.135 }}>

                        </View>
                        <View style={{ flex: 1, alignItems: 'flex-start' }}>
                            <Text style={fontStyles.mainTextStylePrimaryDark}>{strings.PleaseEnterYourEmailAddress}</Text>
                        </View>
                    </View>
                </View>
                <View style={{ flex: 1, justifyContent: 'flex-start' }}>
                    <TextInput
                        style={styles.textInputStyle}
                        returnKeyType={"done"}
                        blurOnSubmit={true}
                        autoCorrect={false}
                        placeholder={strings.emailPlaceHolder}
                        placeholderColor={colors.black}
                        value={this.state.emailText}
                        onChangeText={(text) => { this.setState({ emailText: text }) }}
                        autoCapitalize="none" />
                </View>
                <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                    <QcActionButton
                        text={strings.Submit}
                        disabled={false}
                        onPress={() => {
                            if (this.state.emailText == "") {
                                Alert.alert(strings.EmailErrorHeader, strings.PleaseEnterYourEmailAddress)
                            }
                            else {
                                let emailText = this.state.emailText
                                emailText = emailText.trim()
                                FirebaseFunctions.sendForgotPasswordCode(emailText);
                                Alert.alert(strings.EmailSent, strings.CheckEmail, [
                                    {
                                        text: strings.Ok,
                                        onPress: () => { this.props.navigation.goBack() },
                                        style: 'cancel',
                                    }
                                ]);
                            }
                        }} />
                </View>
                <View style={{ flex: 1 }}></View>
            </QCView>
        )
    }
}
const styles = StyleSheet.create({
    textInputStyle: {
        backgroundColor: colors.lightGrey,
        alignSelf: 'stretch',
        textAlignVertical: 'top',
        borderBottomColor: colors.PrimaryLight,
        borderBottomWidth: screenHeight * 0.0015,
        height: screenHeight * 0.06,
        width: screenWidth * 0.75
    },
});


export default ForgotPassword;