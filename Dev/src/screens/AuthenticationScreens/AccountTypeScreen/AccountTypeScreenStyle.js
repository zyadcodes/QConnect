// This is going to serve as the StyleSheet for the AccountTypeScreen
import { StyleSheet } from 'react-native';
import { screenHeight, screenWidth } from 'config/dimensions';

export default StyleSheet.create({
	bgImage: {
		flex: 5,
		top: 0,
		left: 0,
		width: screenWidth,
		height: screenHeight,
		justifyContent: 'center',
		alignItems: 'center',
	},
	topSpacer: {
		flex: 3
	},
	middleSpacers: {
		flex: 1
	}
})