import React from 'react';
import { Text, StyleSheet } from 'react-native';
import colors from 'config/colors';

//Creates the higher order component
const Word = ({ text }) => {
    
    return (
        <Text style={styles.wordText} >
            {text}
        </Text>
    )
}

const styles = StyleSheet.create({
    wordText: {
        textAlign: 'right', 
        fontFamily: 'me_quran', 
        fontSize: 16, 
        color: colors.darkGrey
    }
})

export default Word;