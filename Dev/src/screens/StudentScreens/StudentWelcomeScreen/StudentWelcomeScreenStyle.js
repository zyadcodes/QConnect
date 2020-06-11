// This screen represents the StyleSheet for StudentWelcomeScreen
import { StyleSheet } from 'react-native';
import { screenHeight, screenWidth } from 'config/dimensions';
import colors from 'config/colors';

export default StyleSheet.create({
	picContainer: {
		paddingTop: screenHeight * 0.015,
		alignItems: 'center',
		marginTop: screenHeight * 0.022,
		marginBottom: screenHeight * 0.015,
		backgroundColor: colors.white,
		width: screenWidth,
		flexDirection: 'column',
	},
	welcomeImage: {
		marginTop: screenHeight * 0.022,
		width: screenWidth * 0.44,
		resizeMode: 'contain',
	},
	editInfo: {
		flexDirection: 'column',
		backgroundColor: colors.white,
		color: colors.darkGrey,
		width: screenWidth,
	},
	buttonsContainer: {
		flexDirection: 'column',
		marginTop: screenHeight * 0.015,
		backgroundColor: colors.white,
		justifyContent: 'center',
		width: screenWidth,
	},
	filler: {
		flexDirection: 'column',
		flex: 1,
	},
	leftBackButtonSpacer: {
		flex: 0.1,
	},
	backButtonContainer: {
		flex: 1,
		alignSelf: 'flex-start',
		flexDirection: 'row',
	},
	backButtonTouchableOpacityContainer: {
		flex: 2,
		paddingTop: screenHeight * 0.025,
		justifyContent: 'flex-start',
		alignItems: 'flex-start',
	},
	rightBackButtonSpacer: {
		flex: 3,
	},
	welcomeImageContainer: {
		flex: 1,
		paddingLeft: screenWidth * 0.05,
		paddingRight: screenWidth * 0.05,
	},
});
