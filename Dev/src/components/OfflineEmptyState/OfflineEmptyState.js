import React from 'react';
import { View, Text, Image } from 'react-native';
import QcActionButton from 'components/QcActionButton';
import fontStyles from 'config/fontStyles';
import strings from 'config/strings';
import OfflineEmptyStateStyle from './OfflineEmptyStateStyle';

const OfflineEmptyState = (props) => {
	return (
		<View style={OfflineEmptyStateStyle.containerStyle}>
			<Text style={[fontStyles.bigTextStyleDarkestGrey, OfflineEmptyStateStyle.offlineText]}>
				{strings.Offline}
			</Text>
			<Image
				source={require('assets/emptyStateIdeas/boy-offline.png')}
				style={OfflineEmptyStateStyle.imageStyle}
			/>
			<Text style={[fontStyles.mainTextStyleDarkGrey, OfflineEmptyStateStyle.offlineDescText]}>
				{strings.OfflineDesc}
			</Text>
			<QcActionButton text={strings.Retry} onPress={props.retry} />
		</View>
	);
};
 
export default OfflineEmptyState;
