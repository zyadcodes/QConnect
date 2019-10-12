import React from 'react';
import { View, ImageBackground, StyleSheet} from 'react-native';
import colors from 'config/colors';
import Ayah from './Ayah';
import LoadingSpinner from 'components/LoadingSpinner';
import { getPageTextWbW, getPageText } from '../ServiceActions/getQuranContent'
import Word from './Word'
import EndOfAyah from './EndOfAyah'

//Creates the higher order component
class SelectionPage extends React.Component {

    state = {
        isLoading: true,
        lines: [],
        selectedAyahs: new Set()
    }

    async componentDidMount() {
        const lines = await getPageTextWbW(300)
        this.setState({
            isLoading: false,
            selectedAyahs: new Set(),
            lines
        });
    }

    getLineAyahText(wordsList) {
        //if(wordsList[0].line === 2) {}
        lineText = "";
        const rightBracket = '  \uFD3F';
        const leftBracket = '\uFD3E';

        let lineAyahText = wordsList.reduce(
            (aya, word) => {
                if (word.char_type === "end") {
                    return "".concat(aya, " ", rightBracket, word.aya, leftBracket)
                }
                else if (word.char_type === "word") {
                    return "".concat(aya, " ", word.text)
                }
                else {
                    return aya;
                }
            },
            "" //initialize line text with empty string
        )

        return lineAyahText;
    }
    
    onSelectAyah(ayaNumber){
        let newSelectedAyah = this.state.selectedAyahs;

        if(newSelectedAyah.has(ayaNumber)){
            newSelectedAyah.delete(ayaNumber) ;
        } else {
            newSelectedAyah = newSelectedAyah.add(ayaNumber);
        }

        this.setState({selectedAyahs: newSelectedAyah})
    }

    render() {
        const { isLoading, lines } = this.state;
        if (isLoading === true) {
            return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <LoadingSpinner isVisible={true} />
                </View>
            )
        }

        else {
            return (
                <View style={{backgroundColor: colors.white}}>
                <ImageBackground source={require('assets/images/quran-page-frame.png')} style={{ width: '100%' }} resizeMethod='scale'>
                    <View style={{ marginVertical: 30, marginHorizontal: 30, backgroundColor: colors.white }}>
                        {
                            lines !== undefined &&
                            lines.map((line) => {
                                return (
                                    <View key={line.line} style={{ flexDirection: 'row-reverse', backgroundColor: 'transparent', justifyContent: 'space-between' }}>
                                        {
                                            line.text.map((word) => {
                                                if (word.char_type === "word") {
                                                    return (<Word key={word.id} text={word.text} audio={word.audio} 
                                                    selected={this.state.selectedAyahs.has(word.aya)} />)
                                                }
                                                else if (word.char_type === "end") {
                                                    return (<EndOfAyah key={word.id} ayahNumber={word.aya}  
                                                    onPress={() => this.onSelectAyah(word.aya)} />)
                                                }
                                            }
                                            )
                                        }
                                    </View>
                                )
                            })}
                    </View>
                </ImageBackground>
                </View>

            )
        }
    }
}

const styles = StyleSheet.create({
    ayahText: {
        textAlign: 'right',
        fontFamily: 'me_quran',
        fontSize: 20,
        color: colors.darkGrey
    }
})

export default SelectionPage;