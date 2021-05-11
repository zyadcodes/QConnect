import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import colors from 'config/colors';
import strings from 'config/strings';
import PhoneInput from 'react-native-phone-input';
import fontStyles from 'config/fontStyles';
import { screenHeight, screenWidth } from 'config/dimensions';
import styles from './TeacherInfoEntriesStyle'

//--------------------------------------------------------------------------
// Teacher info entries (Name, Phone number, and Email address).
// Used from Teacher welcome flow as well as Teacher profile edit page
//--------------------------------------------------------------------------
export default (TeacherInfoEntries = props => {
  return (
    <View style={styles.container}>
      {
        //Teacher Name box ------------------------------------------------------
      }
      <View style={styles.infoRow}>
        <TextInput
          style={[fontStyles.smallTextStyleDarkestGrey, styles.textInput]}
          textContentType="name"
          placeholder={strings.namePlaceHolder}
          placeholderTextColor={colors.darkestGrey}
          autoCorrect={false}
          onChangeText={props.onNameChanged}
          value={props.name}
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
          }}
          value={props.phoneNumber}
          onChangePhoneNumber={() => props.onPhoneNumberChanged(this.phone)}
        />
      </View>

      {
        //Teacher Email adress box ----------------------------------------------
      }
      {!props.noEmailField ? (
        <View style={styles.infoRow}>
          <TextInput
            style={[fontStyles.smallTextStyleDarkestGrey, styles.textInput]}
            keyboardType="email-address"
            placeholder={strings.emailPlaceHolder}
            placeholderTextColor={colors.darkestGrey}
            autoCorrect={false}
            autoCapitalize="none"
            textContentType="emailAddress"
            onChangeText={props.onEmailAddressChanged}
            value={props.emailAddress}
            autoCapitalize="none"
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
            style={[fontStyles.smallTextStyleDarkestGrey, styles.textInput]}
            textContentType="password"
            autoCompleteType="password"
            placeholderTextColor={colors.darkestGrey}
            placeholder={strings.password}
            autoCorrect={false}
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
          <TextInput
            style={[fontStyles.smallTextStyleDarkestGrey, styles.textInput]}
            textContentType="password"
            autoCorrect={false}
            placeholder={strings.ConfirmPasswordPlaceholder}
            placeholderTextColor={colors.darkestGrey}
            autoCompleteType="password"
            onChangeText={props.onPasswordTwoChanged}
            secureTextEntry={true}
            value={props.passwordTwo}
            autoCapitalize="none"
          />
        </View>
      }
    </View>
  );
});

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


