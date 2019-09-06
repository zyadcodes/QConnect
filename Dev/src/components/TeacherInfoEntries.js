import React from 'react'
import { View, Text, TextInput, StyleSheet } from 'react-native'
import PropTypes from 'prop-types'
import colors from 'config/colors'
import strings from '../../config/strings';
import PhoneInput from 'react-native-phone-input'

//--------------------------------------------------------------------------
// Teacher info entries (Name, Phone number, and Email address). 
// Used from Teacher welcome flow as well as Teacher profile edit page
//--------------------------------------------------------------------------
export default TeacherInfoEntries = (props) => {
    return (
        <View style={styles.container}>
            <View style={styles.infoRow}>
                <Text style={styles.subtitle}>Information</Text>
            </View>
            <View style={styles.infoRow}>
                <Text style={styles.infoTitle}>{strings.namePlaceHolder}</Text>
                <View style={{ flex: 1 }}>
                    <TextInput
                        style={styles.infoTextInput}
                        textContentType='name'
                        onChangeText={props.onNameChanged}
                        value={props.name} />
                </View>
            </View>
            <View style={styles.infoRow}>
                <Text style={styles.infoTitle}>{strings.phoneNumberPlaceHolder}</Text>
                <View style={{ flex: 1 }}>
                    <PhoneInput
                        ref={ref => {
                            this.phone = ref;
                        }}
                        value={props.phoneNumber}
                        onChangePhoneNumber={() => props.onPhoneNumberChanged(this.phone)}
                    />
                </View>
            </View>
            {
                !props.noEmailField ? (
                    <View style={styles.infoRow}>
                        <Text style={styles.infoTitle}>{strings.emailPlaceHolder}</Text>
                        <View style={{ flex: 1 }}>
                            <TextInput
                                style={styles.infoTextInput}
                                keyboardType='email-address'
                                autoCapitalize='none'
                                textContentType='emailAddress'
                                onChangeText={props.onEmailAddressChanged}
                                value={props.emailAddress}
                                autoCapitalize="none"
                            />
                        </View>
                    </View>
                ) : (
                        <View></View>
                    )
            }
            {props.showPasswordField &&
                <View style={styles.infoRow}>
                    <Text style={styles.infoTitle}>{strings.password}</Text>
                    <View style={{ flex: 1 }}>
                        <TextInput
                            style={styles.infoTextInput}
                            textContentType='password'
                            autoCompleteType='password'
                            onChangeText={props.onPasswordChanged}
                            secureTextEntry={true}
                            value={props.password}
                            autoCapitalize="none"
                        />
                    </View>
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
    subtitle: {
        fontSize: 16,
        paddingLeft: 20,
        color: colors.darkGrey,
        marginVertical: 5,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingRight: 10,
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
    infoTitle: {
        paddingLeft: 20,
        paddingVertical: 10,
        fontSize: 14,
        color: colors.darkGrey,
        width: 130
    },
})
