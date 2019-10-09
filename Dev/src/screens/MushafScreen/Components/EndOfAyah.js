import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import colors from 'config/colors';
import { TouchableHighlight } from 'react-native-gesture-handler';

//Creates the higher order component
const EndOfAyah = ({ ayahNumber, onPress, selected }) => {
    const rightBracket = '  \uFD3F';
    const leftBracket = '\uFD3E';

    return (
        <View>
            <TouchableHighlight 
            style={selected? {backgroundColor: colors.green} : {}}
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
    }
})

export default EndOfAyah;