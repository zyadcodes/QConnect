import React from 'react';
import { View, Text, StyleSheet, } from 'react-native';
import colors from 'config/colors';
import Ayah from './Ayah';
import LoadingSpinner from 'components/LoadingSpinner';
import {getPageTextWbW, getPageText} from '../ServiceActions/getQuranContent'

//Creates the higher order component
class Page extends React.Component {

    state = {
        isLoading: true,
        lines: []
    }

    async componentDidMount() {
        const lines =  await getPageTextWbW(300)
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
            (aya, word) =>  { 
                if(word.char_type === "end"){
                    return "".concat(aya, " ", rightBracket, word.aya, leftBracket)
                }
                else if(word.char_type === "word") {
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
                <View style={{ margin: 5, backgroundColor: colors.white }}>
                        {
                            lines !== undefined &&
                            lines.map((line) => {
                                return (
                                    <Ayah
                                        key={line.line}
                                        text={this.getLineAyahText(line.text)}
                                        number={line.ayah}
                                    />
                                )
                            })}
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