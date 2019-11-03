import React from 'react'
import { View, Text, TextInput, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'
import colors from 'config/colors'
import strings from '../../config/strings';
import PhoneInput from 'react-native-phone-input'
import fontStyles from 'config/fontStyles';
import { screenHeight, screenWidth } from 'config/dimensions';

//--------------------------------------------------------------------------
// Teacher info entries (Name, Phone number, and Email address). 
// Used from Teacher welcome flow as well as Teacher profile edit page
//--------------------------------------------------------------------------
export default TeacherInfoEntries = (props) => {

    return (

        <View style={styles.container}>

            {
                //Teacher Name box ------------------------------------------------------
            }
            <View style={styles.infoRow}>
                <View style={{ paddingRight: screenWidth * 0.015 }}>
                    <Text style={fontStyles.smallTextStyleDarkGrey}>{strings.namePlaceHolder}</Text>
                </View>

                <TextInput
                    style={[fontStyles.smallTextStyleDarkGrey, styles.textInput]}
                    textContentType='name'
                    onChangeText={props.onNameChanged}
                    value={props.name} />
            </View>

            {
                //Teacher Phone box -----------------------------------------------------
            }
            <View style={styles.infoRow}>
                <View style={{ paddingRight: screenWidth * 0.015 }}>
                    <Text style={fontStyles.smallTextStyleDarkGrey}>{strings.phoneNumberPlaceHolder}</Text>
                </View>
                <PhoneInput style={styles.textInput}
                    ref={ref => {
                        this.phone = ref;
                    }}
                    value={props.phoneNumber}
                    onChangePhoneNumber={() => props.onPhoneNumberChanged(this.phone)}
                />
            </View>

            {
                //Teacher Email adress box ----------------------------------------------
            }
            {
                !props.noEmailField ? (
                    <View style={styles.infoRow}>
                        <View style={{ paddingRight: screenWidth * 0.015 }}>
                            <Text style={fontStyles.smallTextStyleDarkGrey}>{strings.emailPlaceHolder}</Text>
                        </View>
                        <TextInput
                            style={[fontStyles.smallTextStyleDarkGrey, styles.textInput]}
                            keyboardType='email-address'
                            autoCapitalize='none'
                            textContentType='emailAddress'
                            onChangeText={props.onEmailAddressChanged}
                            value={props.emailAddress}
                            autoCapitalize="none"
                        />
                    </View>
                ) : (
                        <View></View>
                    )
            }

            {
                /**
                 * The Password fields
                 * 
                 * Here is Field one:
                 * 
                 * the spaces in the text are to help with the asthetic and 
                 * make both password input boxes the same length.
                 */
                <View style={styles.infoRow}>
                    <Text style={fontStyles.smallTextStyleDarkGrey}>{"     " + strings.password + "      "}</Text>

                    <TextInput
                        style={[fontStyles.smallTextStyleDarkGrey, styles.textInput]}
                        textContentType='password'
                        autoCompleteType='password'
                        onChangeText={props.onPasswordChanged}
                        secureTextEntry={true}
                        value={props.password}
                        autoCapitalize="none"
                    />
                </View>
            }

            {
                /**
                 * Password field two
                 */
                <View style={styles.infoRow}>
                    <Text style={fontStyles.smallTextStyleDarkGrey}>{strings.ConfirmPasswordPlaceholder}</Text>
                    <TextInput
                        style={[fontStyles.smallTextStyleDarkGrey, styles.textInput]}
                        textContentType='password'
                        autoCompleteType='password'
                        onChangeText={props.onPasswordTwoChanged}
                        secureTextEntry={true}
                        value={props.passwordTwo}
                        autoCapitalize="none"
                    />

                </View>

            }
        </View>
    );
}

TeacherInfoEntries.propTypes = {
    name: PropTypes.string.isRequired,
    phoneNumber: PropTypes.string.isRequired,
    emailAddress: PropTypes.string.isRequired,
    onNameChanged: PropTypes.func.isRequired,
    onPhoneNumberChanged: PropTypes.func.isRequired,
    onEmailAddressChanged: PropTypes.func.isRequired,
    onPasswordChanged: PropTypes.func,
    showPasswordField: PropTypes.bool,
}

//Styles for the Teacher profile class
const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.white,
    },
    textInput: {
        flex: 1,
        paddingLeft: 0.049 * screenWidth,
        backgroundColor: colors.veryLightGrey,
        height: screenHeight * 0.08 * 0.6,
        borderRadius: screenWidth * 0.05
    },
    infoRow: {
        flexDirection: "row",
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: screenWidth * 0.025,
        height: screenHeight * 0.08,
        borderBottomColor: colors.grey,
        borderBottomWidth: 0.25
    },

    passwordRow: {
        flexDirection: "column",
        justifyContent: 'space-between',
        alignContent: "flex-start",
        paddingLeft: screenWidth * 0.025,
        height: screenHeight * 0.07,
        borderBottomColor: colors.grey,
        borderBottomWidth: 0.25
    },
    infoTextInput: {
        paddingLeft: 20,
        fontSize: 14,
        color: colors.darkGrey,
        flex: 1,
        alignSelf: 'stretch',
    },
})
