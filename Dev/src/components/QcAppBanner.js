import React from 'react';
import { View, Text } from 'react-native';
import FontLoadingComponent from './FontLoadingComponent';
import LoadingSpinner from '../components/LoadingSpinner';
import strings from '../../config/strings';
import fontStyles from '../../config/fontStyles';

class QcAppBanner extends FontLoadingComponent {
    render() {
        return (
            <View ID="AppBanner">
                {this.state.fontLoaded ? (
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
                            <LoadingSpinner isVisible={!this.state.fontLoaded} />
                        </View>
                    )
                }
            </View>
        )
    }
}

export default QcAppBanner;

