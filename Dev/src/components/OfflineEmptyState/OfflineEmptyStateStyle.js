// This is going to serve as the StyleSheet for the OfflineEmptyStyle component
import { StyleSheet } from 'react-native';
import { screenHeight, screenWidth } from 'config/dimensions';

export default StyleSheet.create({
	containerStyle: {
		flex: 2,
		marginTop: (screenHeight * 1) / 4,
		justifyContent: 'flex-start',
		alignItems: 'center',
		alignSelf: 'center',
	},
	imageStyle: {
		width: 0.73 * screenWidth,
		height: 0.22 * screenHeight,
		resizeMode: 'contain',
		marginTop: screenHeight * 0.05,
    },
    offlineText: {
        textAlign: 'center' 
    },
    offlineDescText: {
        textAlign: 'center', marginVertical: 10 
    }
});
