// This file is going to be the StyleSheet for the TeacherWelcomeScreen
import { StyleSheet } from 'react-native';
import { screenHeight, screenWidth } from 'config/dimensions';
import colors from 'config/colors';

export default StyleSheet.create({
	container: {
		flexDirection: 'column',
		backgroundColor: colors.lightGrey,
		flex: 1,
		justifyContent: 'flex-end',
	},
	picContainer: {
		alignItems: 'center',
		marginBottom: 0.015 * screenHeight,
		backgroundColor: colors.white,
	},
	welcomeImage: {
		marginTop: 0.022 * screenHeight,
		width: screenWidth * 0.44,
		resizeMode: 'contain',
	},
	editInfo: {
		flexDirection: 'column',
		backgroundColor: colors.white,
		color: colors.darkGrey,
	},
	buttonsContainer: {
		flexDirection: 'column',
		marginTop: 0.015 * screenHeight,
		backgroundColor: colors.white,
		justifyContent: 'center',
	},
	filler: {
		height: 20,
	},
	backButtonContainer: {
		flex: 1,
		paddingTop: screenHeight * 0.04,
		alignSelf: 'flex-start',
		flexDirection: 'row',
	},
	backButtonTouchableOpacity: {
		flex: 2,
		justifyContent: 'flex-start',
		alignItems: 'flex-start',
		paddingLeft: screenWidth * 0.03,
	},
	welcomeImageContainer: {
		flex: 1,
		paddingLeft: screenWidth * 0.05,
		paddingRight: screenWidth * 0.05,
		paddingBottom: screenHeight * 0.02,
	},
});
