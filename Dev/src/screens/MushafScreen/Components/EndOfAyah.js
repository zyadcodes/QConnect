import React from 'react';
import { Text, StyleSheet } from 'react-native';
import colors from 'config/colors';

//Creates the higher order component
const EndOfAyah = ({ ayahNumber }) => {
    const rightBracket = '  \uFD3F';
    const leftBracket = '\uFD3E';
    
    return (
        <Text style={styles.ayahSeparator}>
            {leftBracket}
            <Text style={styles.ayahNumber}>
                {ayahNumber}
            </Text>
            {rightBracket}
        </Text>
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