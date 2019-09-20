import React from 'react';
import { Text, StyleSheet } from 'react-native';
import colors from 'config/colors';

//Creates the higher order component
const EndOfAyah = ({ ayahNumber }) => {
    const rightBracket = '  \uFD3F';
    const leftBracket = '\uFD3E';
    
    return (
        <Text style={styles.ayahSeparator}>
            {rightBracket}
            <Text style={styles.ayahNumber}>
                {ayahNumber}
            </Text>
            {leftBracket}
        </Text>
    )
}

const styles = StyleSheet.create({
    ayahNumber: {
        textAlign: 'right', 
        fontFamily: 'me_quran', 
        alignItems: 'center', 
        alignSelf: 'center', 
        fontSize: 20, color: colors.darkGrey
    },
    ayahSeparator: {
        textAlign: 'right', 
        fontFamily: 'me_quran', 
        alignItems: 'center', 
        alignSelf: 'center', 
        fontSize: 30, 
        color: colors.darkGrey, 
        marginBottom: 10
    }
})

export default EndOfAyah;