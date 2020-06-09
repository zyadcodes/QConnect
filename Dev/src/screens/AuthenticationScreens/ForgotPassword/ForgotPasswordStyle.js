// This file will serve as the StyleSheet for the ForgotPassword screen
import { StyleSheet } from 'react-native';
import { screenHeight, screenWidth } from 'config/dimensions';

export default StyleSheet.create({
	textInputStyle: {
		backgroundColor: colors.lightGrey,
		alignSelf: 'stretch',
		textAlignVertical: 'top',
		borderBottomColor: colors.PrimaryLight,
		borderBottomWidth: screenHeight * 0.0015,
		height: screenHeight * 0.06,
		width: screenWidth * 0.75,
	},
	spacer: {
		flex: 1,
	},
	emailAddressText: {
		flex: 0.5,
		alignSelf: 'flex-start',
		justifyContent: 'flex-end',
	},
	textInputContainer: {
		flex: 1,
		justifyContent: 'flex-start',
	},
	buttonContainer: {
		alignItems: 'center',
		justifyContent: 'center',
		flex: 1,
	},
});
