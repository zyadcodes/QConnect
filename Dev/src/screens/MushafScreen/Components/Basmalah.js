import React from 'react';
import { Text, StyleSheet } from 'react-native';
import colors from 'config/colors';
import EndOfAyah from './EndOfAyah';

//Creates the higher order component
const Basmalah = ({  number, id }) => {
    
    return (
        <Text numberOfLines={1} style={styles.ayahText} >
            بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
        </Text>
    )
}

const styles = StyleSheet.create({
    ayahText: {
        height: 30,
        textAlign: 'center', 
        fontFamily: 'me_quran', 
        fontSize: 17, 
        color: colors.darkishGrey

    }
})

export default Basmalah;