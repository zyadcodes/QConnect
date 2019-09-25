import React from 'react';
import { Text, StyleSheet } from 'react-native';
import colors from 'config/colors';
import { TouchableHighlight } from 'react-native-gesture-handler';

//Creates the higher order component
class Word extends React.Component {

    state = {
        highlighted: false
    }

    render() {
        const { text } = this.props;
        highlightedStyle = this.state.highlighted ? { backgroundColor: colors.green, borderRadius: 5 } : {};

        return (
            <TouchableHighlight onPress={() => this.setState({ highlighted: !this.state.highlighted })}>
                <Text style={[styles.wordText, highlightedStyle]} >
                    {text}
                </Text>
            </TouchableHighlight>
        )
    }
}

const styles = StyleSheet.create({
    wordText: {
        textAlign: 'right',
        fontFamily: 'me_quran',
        fontSize: 15,
        color: colors.darkGrey
    }
})

export default Word;