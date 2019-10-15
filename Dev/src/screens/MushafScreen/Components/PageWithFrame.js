import React from 'react';
import { View, ImageBackground, StyleSheet, } from 'react-native';
import colors from 'config/colors';
import Ayah from './Ayah';
import LoadingSpinner from 'components/LoadingSpinner';
import { getPageTextWbW, getPageText } from '../ServiceActions/getQuranContent'
import Word from './Word'
import EndOfAyah from './EndOfAyah'

//Creates the higher order component
class Page extends React.Component {

    state = {
        isLoading: true,
        lines: [],
        selectedAyahsStart: 0,
        selectedAyahsEnd: 0,
        selectionStarted: false,
        selectionCompleted: false,
    }

    async componentDidMount() {
        const lines = await getPageTextWbW(300)
        this.setState({
            isLoading: false,
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
        //if the user taps on the same selected aya again, turn off selection
        if(this.state.selectedAyahsStart === this.state.selectedAyahsEnd &&
            this.state.selectedAyahsStart === ayaNumber) {
                this.setState({
                    selectionStarted: false,
                    selectionCompleted: false,
                    selectedAyahsStart: 0,
                    selectedAyahsEnd: 0,
                })
            }
        else if(!this.state.selectionStarted){
            this.setState({
                selectionStarted: true,
                selectionCompleted: false,
                selectedAyahsStart: ayaNumber,
                selectedAyahsEnd: ayaNumber,
            })
        } else if(!this.state.selectionCompleted) {
            this.setState(
                {
                    selectionStarted: false,
                    selectionCompleted: true,
                }
            )

            //Set the smallest number as the start, and the larger as the end
            if(this.state.selectedAyahsStart < ayaNumber){
                this.setState({ selectedAyahsEnd: ayaNumber})
            } else{
                this.setState({ selectedAyahsStart: ayaNumber})
            }
        }
    }

    isAyahSelected(ayahNumber){
        return (this.state.selectionStarted || this.state.selectionCompleted) && // there are ayahs selected by the user
            ayahNumber >= this.state.selectedAyahsStart &&
            ayahNumber <= this.state.selectedAyahsEnd
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
                <View style={{ backgroundColor: colors.white }}>
                    <ImageBackground source={require('assets/images/quran-page-frame.png')} style={{ width: '100%' }} resizeMethod='scale'>
                        <View style={{ marginVertical: 30, marginHorizontal: 30, backgroundColor: colors.white, alignItems: 'stretch' }}>
                            {
                                lines !== undefined &&
                                lines.map((line) => {
                                    return (
                                        <View key={line.line} style={{ flexDirection: 'row-reverse', backgroundColor: 'transparent', alignItems: 'stretch' }}>
                                            {
                                                line.ayas.map((aya) => {
                                                    return(
                                                        <View key={line.line + aya.aya} 
                                                        style={this.isAyahSelected(aya.aya)? 
                                                        {flexDirection: 'row-reverse', backgroundColor: colors.green, justifyContent: 'space-between', alignSelf:'stretch'} : 
                                                        {flexDirection: 'row-reverse', backgroundColor: colors.black,  justifyContent: 'space-between', alignSelf:'stretch'}}>{
                                                            aya.text.map((word) => {
                                                                    if (word.char_type === "word") {
                                                                        return (<Word key={word.id} text={word.text} audio={word.audio} />)
                                                                    }
                                                                    else if (word.char_type === "end") {
                                                                        return (<EndOfAyah key={word.id} ayahNumber={word.aya}
                                                                        onPress={() => this.onSelectAyah(word.aya)}  />)
                                                                    }
                                                                }
                                                                )
                                                        }
                                                    </View>
                                                    )

                                                })
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

export default Page;
