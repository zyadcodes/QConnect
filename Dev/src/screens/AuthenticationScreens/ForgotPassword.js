import React, { Component } from 'react';
import { Text, StyleSheet, View, TextInput, KeyboardAvoidingView } from 'react-native';
import strings from 'config/strings';
import colors from 'config/colors';
import QcActionButton from 'components/QcActionButton';
import { Alert } from 'react-native';
import FirebaseFunctions from 'config/FirebaseFunctions';

class ForgotPassword extends Component {

     //Sets the screen for firebase analytics
     componentDidMount() {

        FirebaseFunctions.setCurrentScreen("Forgot Password", "ForgotPassword");

    }

    state = {
        isModalVisible: false,
        emailText: "",
        verificationCode: "",
        disabled: true
    }

    render() {
        return (
            <View style={styles.container}>

                <KeyboardAvoidingView style={styles.emailInputContainer}>

                    <View >
                        <Text style={styles.header}>{strings.RecoverYourPassword}</Text>
                    </View>
                    <View style={styles.mainTextContainer}>
                        <Text>{strings.PleaseEnterYourEmailAddress}</Text>
                    </View>
                    <TextInput
                        style={styles.notesStyle}
                        returnKeyType={"done"}
                        blurOnSubmit={true}
                        placeholder={strings.emailPlaceHolder}
                        placeholderColor={colors.black}
                        value={this.state.emailText}
                        onChangeText={(text) => { this.setState({ emailText: text }) }}
                        autoCapitalize="none" />
                    <View style={styles.buttonsContainer}>
                        <QcActionButton
                            text={strings.Submit}
                            disabled={false}
                            onPress={() => {
                                if (this.state.emailText == "") {
                                    Alert.alert(strings.EmailErrorHeader, strings.EmailError)
                                }
                                else {
                                    this.setState({ isModalVisible: true })
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
                            }}
                        />
                        <View style={styles.spacer} />
                        <View style={{ flex: 1 }}>
                            <View>
                                <View style={{ flex: 1 }} />
                            </View>
                            <View style={{ flex: 1 }} />
                        </View>
                    </View>
                </KeyboardAvoidingView>
                <View style={{ flex: 1 }} />
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        marginTop: 50,
        flex: 1
    },
    spacer: {
        flex: 3
    },
    notesStyle: {
        backgroundColor: colors.lightGrey,
        alignSelf: 'stretch',
        margin: 5,
        textAlignVertical: 'top',
        borderBottomColor: colors.PrimaryLight,
        borderBottomWidth: 1,
        height: 30
    },
    emailInputContainer: {
        flexDirection: 'column',
        paddingTop: 25,
        paddingBottom: 25,
        alignItems: 'center',
        marginTop: 30,
        marginBottom: 450,
        marginHorizontal: 10,
        backgroundColor: colors.white,
        borderColor: colors.lightGrey,
        borderWidth: 1,
        marginTop: 220
    },
    buttonsContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    mainTextContainer: {
        alignContent: 'center',
        margin: 20,
        fontSize: 15
    },
    modal: {
        backgroundColor: colors.white,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        marginTop: 230,
        borderWidth: 1,
        borderRadius: 2,
        borderColor: colors.grey,
        borderBottomWidth: 1,
        shadowColor: colors.darkGrey,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 3,
        elevation: 2,
        marginLeft: 45,
        marginRight: 45,
        paddingRight: 5,
        paddingLeft: 5
    },
    header: {
        fontSize: 20
    }

});


export default ForgotPassword;