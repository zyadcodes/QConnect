import React from 'react';
import { Text, StyleSheet, View, I18nManager } from 'react-native';
import colors from 'config/colors';
import { TouchableHighlight } from 'react-native-gesture-handler';

//Creates the higher order component
const EndOfAyah = ({ ayahNumber, onPress, selected, isLastSelectedAyah }) => {
    const rightBracket = '  \uFD3F';
    const leftBracket = '\uFD3E';
    let containerStyle = [styles.container];
    if(selected) {containerStyle.push(styles.selectionStyle)};
    if(isLastSelectedAyah) {containerStyle.push(I18nManager.IsRTL? styles.lastSelectedAyah : styles.lastSelectedAyahNoRTL)};

    return (
        <View style={containerStyle}>
            <TouchableHighlight 
            onPress={ () => onPress()}>
                <Text style={styles.ayahSeparator}>
                    {leftBracket}
                    <Text style={styles.ayahNumber}>
                        {ayahNumber}
                    </Text>
                    {rightBracket}
                </Text>
            </TouchableHighlight>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1, 
        alignSelf: 'stretch',
        marginVertical: 1
    },
    ayahNumber: {
        textAlign: 'right',
        fontFamily: 'me_quran',
        alignItems: 'center',
        alignSelf: 'center',
        fontSize: 10,
        color: colors.darkGrey
    },
    ayahSeparator: {
        textAlign: 'right',
        fontFamily: 'me_quran',
        alignItems: 'center',
        alignSelf: 'center',
        fontSize: 14,
        color: colors.darkGrey,
    },
    selectionStyle: {
        backgroundColor: colors.green
    },
    lastSelectedAyahNoRTL: {
        borderTopRightRadius: 15,
        borderBottomRightRadius: 15
    },
    lastSelectedAyah: {
        borderTopLeftRadius: 15,
        borderBottomLeftRadius: 15
    },

})

export default EndOfAyah;