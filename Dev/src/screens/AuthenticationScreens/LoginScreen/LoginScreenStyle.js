// This file will serve as the StyleSheet for the login screen
import { StyleSheet } from 'react-native';
import { screenHeight, screenWidth } from 'config/dimensions';

export default StyleSheet.create({
	flexOne: {
		flex: 1,
	},
	spacer: {
		flex: 3,
	},
	bgImage: {
		flex: 5,
		top: 0,
		left: 0,
		width: screenWidth,
		height: screenHeight,
		justifyContent: 'center',
		alignItems: 'center',
	},
	flexOneCenter: {
		flex: 1,
		justifyContent: 'center',
	},
	flexHalfCenter: {
		flex: 0.5,
		justifyContent: 'flex-start',
	},
	imageContainer: {
		flex: 4,
		justifyContent: 'center',
	},
});
