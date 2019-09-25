import React from 'react';
import { Text, StyleSheet } from 'react-native';
import colors from 'config/colors';
import EndOfAyah from './EndOfAyah';

//Creates the higher order component
const Ayah = ({ text, number, id }) => {
    
    return (
        <Text numberOfLines={1} style={styles.ayahText} >
            {text}
        </Text>
    )
}

const styles = StyleSheet.create({
    ayahText: {
        textAlign: 'right', 
        fontFamily: 'me_quran', 
        fontSize: 14, 
        color: colors.darkGrey
    }
})

export default Ayah;