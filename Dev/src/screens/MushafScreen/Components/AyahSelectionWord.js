import React from 'react';
import { Text, StyleSheet, View, TouchableWithoutFeedback, I18nManager } from 'react-native';
import colors from 'config/colors';
import Sound from 'react-native-sound';

//Creates the higher order component
class Word extends React.Component {


    render() {
        const { text, onPress, selected, isFirstSelectedWord } = this.props;
        let containerStyle = [styles.container];
        if(selected) {containerStyle.push(styles.selectionStyle)};
        if(isFirstSelectedWord) {containerStyle.push(I18nManager.isRTL? styles.firstSelectedWordText : styles.firstSelectedWordTextNoRTL)};

        return (
            <View style={containerStyle}>
                <TouchableWithoutFeedback onPress={() => onPress()}>
                    <Text style={styles.wordText} >
                        {text}
                    </Text>
                </TouchableWithoutFeedback>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    wordText: {
        textAlign: 'right',
        fontFamily: 'me_quran',
        fontSize: 17,
        color: colors.darkGrey
    },
    container: {
        flexGrow: 1, 
        alignSelf: 'stretch',
        marginVertical: 1,
    },
    selectionStyle: {
        backgroundColor: colors.green,
    },
    firstSelectedWordTextNoRTL: {
        borderTopRightRadius: 15,
        borderBottomRightRadius: 15
    },
    firstSelectedWordText: {
        borderTopLeftRadius: 15,
        borderBottomLeftRadius: 15
    }
})

export default Word;