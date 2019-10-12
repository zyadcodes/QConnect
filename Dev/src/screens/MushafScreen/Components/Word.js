import React from 'react';
import { Text, StyleSheet, View } from 'react-native';
import colors from 'config/colors';
import { TouchableHighlight } from 'react-native-gesture-handler';
import Sound from 'react-native-sound';

//Creates the higher order component
class Word extends React.Component {

    state = {
        highlighted: false
    }

    playTrack = (audioFilePath) => {
        const track = new Sound('https://dl.salamquran.com/wbw/' + audioFilePath, null, (e) => {
            if (e) {
                console.log('error loading track:', e)
            } else {
                track.play((success) => {
                    if (success) {
                        console.log('successfully finished playing');
                    } else {
                        console.log('playback failed due to audio decoding errors');
                    }
                    this.setState({ highlighted: false });
                });
            }
        })
    }


    render() {
        const { text, audio, selected } = this.props;
        highlightedStyle = this.state.highlighted ? { backgroundColor: colors.green, borderRadius: 5 } : {};

        return (
            <View style={selected ? { flexGrow: 1, backgroundColor: colors.green, alignSelf: 'stretch' } : {flexGrow: 1, alignSelf: 'stretch'}}>
                <TouchableHighlight onPress={() => {
                    this.setState({ highlighted: !this.state.highlighted });
                    this.playTrack(audio);
                }
                }>
                    <Text style={[styles.wordText, highlightedStyle]} >
                        {text}
                    </Text>
                </TouchableHighlight>
            </View>
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