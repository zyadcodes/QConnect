import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from 'config/colors';
import FontLoadingComponent from './FontLoadingComponent';
import LoadingSpinner from '../components/LoadingSpinner';
import strings from '../../config/strings';

class QcAppBanner extends FontLoadingComponent {
    render() {
        return (
            <View ID="AppBanner">
                {this.state.fontLoaded ? (
                    <View style={styles.loginTitle}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={styles.titleText}>{strings.AppTitle}</Text>
                        </View>
                        <View>
                            <Text style={styles.subtitleText}>{strings.AppSubTitle}</Text>
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

const styles = StyleSheet.create({
    titleText: {
        color: colors.primaryDark,
        fontSize: 30,
        fontFamily: 'Montserrat-Regular',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
    },
    subtitleText: {
        color: colors.darkGrey,
        fontSize: 12,
        fontFamily: 'Montserrat-Regular',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
    }
});

export default QcAppBanner;

