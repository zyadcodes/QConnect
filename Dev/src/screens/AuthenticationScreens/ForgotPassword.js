import React, { Component } from 'react';
import { Text, StyleSheet, View, TextInput, Dimensions } from 'react-native';
import QCView from 'components/QCView';
import strings from 'config/strings';
import colors from 'config/colors';
import QcActionButton from 'components/QcActionButton';
import { Alert } from 'react-native';
import FirebaseFunctions from 'config/FirebaseFunctions';
import screenStyle from 'config/screenStyle';

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
                    <View style={{ flex: 1 }}>
                        <Text style={styles.header}>{strings.RecoverYourPassword}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text>{strings.PleaseEnterYourEmailAddress}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        <TextInput
                            style={styles.notesStyle}
                            returnKeyType={"done"}
                            blurOnSubmit={true}
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
                                    Alert.alert(strings.EmailErrorHeader, strings.EmailError)
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
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: colors.white,
        alignItems: 'center'
    },
    spacer: {
        flex: 3
    },
    notesStyle: {
        backgroundColor: colors.lightGrey,
        alignSelf: 'stretch',
        textAlignVertical: 'top',
        borderBottomColor: colors.PrimaryLight,
        borderBottomWidth: 1,
        height: 45,
        width: Dimensions.get('window').width * 0.75
    },
    mainTextContainer: {
        alignContent: 'center',
        margin: 20,
        fontSize: 15
    },
    header: {
        fontSize: 20
    }

});


export default ForgotPassword;