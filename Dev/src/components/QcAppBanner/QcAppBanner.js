import React from 'react';
import { View, Text } from 'react-native';
import FontLoadingComponent from './FontLoadingComponent';
import LoadingSpinner from '../components/LoadingSpinner';
import strings from '../../../config/strings';
import fontStyles from 'config/fontStyles';

const QcAppBanner = (props) => {
        return (
            <View ID="AppBanner">
                {true ? (
                    <View style={{ alignItems: 'center' }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={fontStyles.hugeTextStylePrimaryDark}>{strings.AppTitle}</Text>
                        </View>
                        <View>
                            <Text style={fontStyles.mainTextStyleDarkGrey}>{strings.AppSubTitle}</Text>
                        </View>
                    </View>
                ) : (
                        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                            <LoadingSpinner isVisible={true} />
                        </View>
                    )
                }
            </View>
        )
}

export default QcAppBanner;

