import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import PropTypes from "prop-types";
import colors from "config/colors";
import strings from "../../config/strings";
import PhoneInput from "react-native-phone-input";
import fontStyles from "config/fontStyles";
import { screenHeight, screenWidth } from "config/dimensions";

//--------------------------------------------------------------------------
// Teacher info entries (Name, Phone number, and Email address).
// Used from Teacher welcome flow as well as Teacher profile edit page
//--------------------------------------------------------------------------

class TeacherInfoEntries extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        {
          //Teacher Name box ------------------------------------------------------
        }
        <View style={styles.infoRow}>
          <TextInput
            style={[fontStyles.smallTextStyleBlack, styles.textInput]}
            textContentType="name"
            accessibilityLabel="name"
            placeholder={strings.namePlaceHolder}
            placeholderTextColor={colors.darkestGrey}
            autoCorrect={false}
            onChangeText={this.props.onNameChanged}
            value={this.props.name}
          />
        </View>

        {
          //Teacher Phone box -----------------------------------------------------
        }
        <View style={styles.infoRow}>
          <PhoneInput
            style={styles.textInput}
            ref={ref => {
              this.phone = ref;
            }}
            textProps={{
              placeholder: strings.phoneNumberPlaceHolder,
              placeholderTextColor: colors.darkestGrey,
              accessibilityLabel: "phoneNumber"
            }}
            textStyle={fontStyles.smallTextStyleBlack}
            value={this.props.phoneNumber}
            onChangePhoneNumber={() =>
              this.props.onPhoneNumberChanged(this.phone)
            }
          />
        </View>

        {
          //Teacher Email adress box ----------------------------------------------
        }
        {!this.props.noEmailField ? (
          <View style={styles.infoRow}>
            <TextInput
              style={[fontStyles.smallTextStyleBlack, styles.textInput]}
              keyboardType="email-address"
              accessibilityLabel="emailAddress"
              placeholder={strings.emailPlaceHolder}
              placeholderTextColor={colors.darkestGrey}
              autoCorrect={false}
              autoCapitalize="none"
              textContentType="emailAddress"
              onChangeText={this.props.onEmailAddressChanged}
              value={this.props.emailAddress}
            />
          </View>
        ) : (
          <View />
        )}

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
            <TextInput
              style={[fontStyles.smallTextStyleBlack, styles.textInput]}
              textContentType="password"
              autoCompleteType="password"
              accessibilityLabel="password"
              placeholderTextColor={colors.darkestGrey}
              placeholder={strings.password}
              autoCorrect={false}
              onChangeText={this.props.onPasswordChanged}
              secureTextEntry={true}
              value={this.props.password}
              autoCapitalize="none"
            />
          </View>
        }

        {
          /**
           * Password field two
           */
          <View style={styles.infoRow}>
            <TextInput
              style={[fontStyles.smallTextStyleBlack, styles.textInput]}
              textContentType="password"
              accessibilityLabel="confirmPassword"
              autoCorrect={false}
              placeholder={strings.ConfirmPasswordPlaceholder}
              placeholderTextColor={colors.darkestGrey}
              autoCompleteType="password"
              onChangeText={this.props.onPasswordTwoChanged}
              secureTextEntry={true}
              value={this.props.passwordTwo}
              autoCapitalize="none"
            />
          </View>
        }
      </View>
    );
  }
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
};

//Styles for the Teacher profile class
const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
  },
  textInput: {
    flex: 1,
    paddingLeft: 5,
    backgroundColor: colors.veryLightGrey,
    height: 40,
    borderRadius: 1
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: screenWidth * 0.025,
    height: screenHeight * 0.08,
    borderBottomColor: colors.grey,
    borderBottomWidth: 0.25
  },

  passwordRow: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignContent: "flex-start",
    paddingLeft: screenWidth * 0.025,
    height: screenHeight * 0.07,
    borderBottomColor: colors.grey,
    borderBottomWidth: 0.25
  },
  infoTextInput: {
    paddingLeft: screenWidth * 0.025,
    fontSize: 14,
    color: colors.darkGrey,
    flex: 1,
    alignSelf: "stretch",
  },
});

export default TeacherInfoEntries;
