// This file is the ForgotPassword screen where users will be able to reset their passwords
import React, { useState, useEffect } from 'react';
import { Text, View, TextInput } from 'react-native';
import QCView from 'components/QCView';
import strings from 'config/strings';
import colors from 'config/colors';
import QcActionButton from 'components/QcActionButton';
import { Alert } from 'react-native';
import FirebaseFunctions from 'config/FirebaseFunctions';
import screenStyle from 'config/screenStyle';
import fontStyles from 'config/fontStyles';
import styles from './ForgotPasswordStyle';

// Creates the functional component
const ForgotPassword = (props) => {
	// Declares the state fields used in the screen
	const [emailText, setEmailText] = useState('');

	// The useEffect method acts as a componentDidMount, which will be called once when the screen is first mounted
	useEffect(() => {
		// Sets the screen for firebase analytics
		FirebaseFunctions.setCurrentScreen('Forgot Password', 'ForgotPassword');
	}, []);

	// Renders the UI of the screen
	return (
		<QCView
			style={[
				screenStyle.container,
				{
					alignItems: 'center',
				},
			]}>
			<View style={styles.spacer} />
			<View style={styles.emailAddressText}>
				<Text style={fontStyles.mainTextStylePrimaryDark}>
					{strings.PleaseEnterYourEmailAddress}
				</Text>
			</View>
			<View style={styles.textInputContainer}>
				<TextInput
					style={styles.textInputStyle}
					returnKeyType={'done'}
					blurOnSubmit={true}
					autoCorrect={false}
					placeholder={strings.emailPlaceHolder}
					placeholderColor={colors.black}
					value={emailText}
					onChangeText={(text) => {
						setEmailText(text);
					}}
					autoCapitalize='none'
				/>
			</View>
			<View style={styles.buttonContainer}>
				<QcActionButton
					text={strings.Submit}
					disabled={false}
					onPress={() => {
						const trimmedEmailText = emailText.trim();
						if (trimmedEmailText === '') {
							Alert.alert(strings.EmailErrorHeader, strings.PleaseEnterYourEmailAddress);
						} else {
							FirebaseFunctions.sendForgotPasswordCode(trimmedEmailText);
							Alert.alert(strings.EmailSent, strings.CheckEmail, [
								{
									text: strings.Ok,
									onPress: () => {
										props.navigation.goBack();
									},
									style: 'cancel',
								},
							]);
						}
					}}
				/>
			</View>
			<View style={styles.spacer} />
		</QCView>
	);
};

// Exports the component
export default ForgotPassword;
