import React from 'react';
import { Text, StyleSheet } from 'react-native';
import colors from 'config/colors';
import EndOfAyah from './EndOfAyah';

//Creates the higher order component
const Ayah = ({ text, number }) => {
    
    return (
        <Text style={styles.ayahText}>
            {text}
            <EndOfAyah ayahNumber={number}/> 
        </Text>
    )
}

const styles = StyleSheet.create({
    ayahText: {
        textAlign: 'right', 
        fontFamily: 'me_quran', 
        fontSize: 30, 
        color: colors.darkGrey
    }
})

export default Ayah;