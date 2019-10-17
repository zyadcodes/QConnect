import React from 'react';
import { View, ImageBackground, StyleSheet, Dimensions, Text, TextInput, Alert } from 'react-native';
import colors from 'config/colors';
import TouchableText from 'components/TouchableText'
import LoadingSpinner from 'components/LoadingSpinner';
import { getPageTextWbW, getPageText } from '../ServiceActions/getQuranContent'
import AyahSelectionWord from './AyahSelectionWord'
import EndOfAyah from './EndOfAyah'
import Ayah from './Ayah';
import fontStyles from 'config/fontStyles';
import { TouchableOpacity } from 'react-native-gesture-handler';
import strings from 'config/strings';
import { screenHeight, screenWidth } from 'config/dimensions';
import PageHeader from './PageHeader';
import TopBanner from 'components/TopBanner';
import AssignmentEntryComponent from 'components/AssignmentEntryComponent';
import surahs from '../Data/Surahs.json'

//Creates the higher order component
class SelectionPage extends React.Component {

    state = {
        isLoading: true,
        lines: [],
        page: 222,
        editedPageNumber:  222,
        editPageNumber: false,
        selectedAyahsStart: 0,
        selectedAyahsEnd: 0,
        selectionStarted: false,
        selectionCompleted: false,
        isSurahSelectionVisible: false,
    }

    async componentDidMount() {
        this.fetchPageLines(this.state.page);
    }

    async fetchPageLines(page){
        this.setState({
            isLoading: true,
        });
        const lines = await getPageTextWbW(page)
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

    onSelectAyah(ayaNumber) {
        const {selectedAyahsStart, selectedAyahsEnd, selectionCompleted, selectionStarted} = this.state;
        //if the user taps on the same selected aya again, turn off selection
        if (selectedAyahsStart === selectedAyahsEnd &&
            selectedAyahsStart === ayaNumber) {
            this.setState({
                selectionStarted: false,
                selectionCompleted: false,
                selectedAyahsStart: 0,
                selectedAyahsEnd: 0,
            })
        }
        else if (!selectionStarted) {
            this.setState({
                selectionStarted: true,
                selectionCompleted: false,
                selectedAyahsStart: ayaNumber,
                selectedAyahsEnd: ayaNumber,
            })
        } else if (!selectionCompleted) {
            this.setState(
                {
                    selectionStarted: false,
                    selectionCompleted: true,
                }
            )

            //Set the smallest number as the start, and the larger as the end
            if (Number(selectedAyahsStart) < Number(ayaNumber)) {
                this.setState({ selectedAyahsEnd: ayaNumber })
            } else {
                this.setState({ selectedAyahsStart: ayaNumber })
            }
        }
    }

    isAyahSelected(ayahNumber) {
        return (
            this.state.selectionStarted || this.state.selectionCompleted) && // there are ayahs selected by the user
            Number(ayahNumber) >= Number(this.state.selectedAyahsStart) &&
            Number(ayahNumber) <= Number(this.state.selectedAyahsEnd)
    }

    updatePage() {
        const { editedPageNumber, page } = this.state

        if(isNaN(editedPageNumber) || Number(editedPageNumber) < 1 || Number(editedPageNumber) > 604) {
            Alert.alert(strings.Whoops, strings.InvalidPageNumber);
            return;
        }

        if (editedPageNumber !== page) {
            this.setState({
                editPageNumber: false,
                page: editedPageNumber,
            })
        }
        this.setState({
            editPageNumber: false,
        })

        this.fetchPageLines(editedPageNumber);
    }

    updateSurah(surah){
        try{
            // in the surah array, indexes 0-113 have Arabic names and 114- 227 have English names
            // the formula below gets the surah index from 1 to 114 (so we can get its info from the surah db)
            const surahIndex = (Number(surah.id) % 114) + 1 

            const startPage = surahs[surahIndex].startpage;
            this.setState({
                isSurahSelectionVisible: false,
                editedPageNumber: startPage,
                page: startPage
            });
            this.fetchPageLines(startPage);
        }catch(error){
            Alert.alert(strings.Whoops, 
                "Something went wrong. If the error persists, please contact us at quranconnect@outlook.com")
        }
        
    }

    render() {
        const { isLoading, lines, page } = this.state;
        let isFirstWord = true;
        let lineAlign = 'stretch'
        const surahName = (lines[0] && lines[0].surah)? lines[0].surah : 
            (lines[1] && lines[1].surah)? lines[1].surah : "Select new assignment";

        if(this.state.page === 1) {lineAlign = 'center'}

        if (isLoading === true) {
            return (
                <View id={this.state.page + "spinner"} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <LoadingSpinner isVisible={true} />
                </View>
            )
        }

        else {
            return (
                <View id={this.state.page + "upperWrapper"} style={{ backgroundColor: colors.white }}>
                    <AssignmentEntryComponent
                        visible={this.state.isSurahSelectionVisible}
                        onSubmit={(surah) =>
                            this.updateSurah(surah)}
                        assignment={surahName}
                        onCancel={() => this.setState({isSurahSelectionVisible: false})}
                    />
                    <PageHeader
                        Title={surahName}
                        TitleOnPress={()=> {
                            const {isSurahSelectionVisible} = this.state;
                            this.setState({isSurahSelectionVisible: !isSurahSelectionVisible})}}
                    />
                    <View id={this.state.page} style={{ marginVertical: 5, marginHorizontal: 5, backgroundColor: colors.white }}>
                        {
                            lines !== undefined &&
                            lines.map((line, index) => {
                                if (line.type === "start_sura") {
                                    return <View style={styles.footer} key={line.line + "_" +index}>
                                        <ImageBackground source={require('assets/images/quran/title-frame.png')}
                                            style={{
                                                width: '100%', justifyContent: 'center',
                                                alignSelf: 'center',
                                                alignItems: 'center',
                                            }} resizeMethod='scale'>
                                            <Text style={fontStyles.bigTextStylePrimaryDark}>{line.name}</Text>
                                        </ImageBackground>
                                    </View>
                                } else if (line.type === "besmellah") {
                                    return <Ayah key={line.line + "_basmalah"} text="بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ" />
                                }
                                else {
                                    //show Al-Fatihah aligned center, all other pages should stretch to fill end to end the line.
                                    
                                    return (
                                        <View key={page + "_" + line.line} style={{ flexDirection: 'row-reverse', backgroundColor: 'transparent', justifyContent: 'space-between', alignItems: lineAlign }}>
                                            {
                                                line.text &&
                                                line.text.map((word) => {
                                                    let isAyaSelected = this.isAyahSelected(word.aya);
                                                    let isLastSelectedAyah = isAyaSelected && (this.state.selectedAyahsEnd === word.aya)
                                                    if (word.char_type === "word") {
                                                        let isFirstSelectedWord = isAyaSelected && isFirstWord;
                                                        if(isFirstSelectedWord) {isFirstWord = false;}
                                                        return (<AyahSelectionWord key={word.id} 
                                                            text={word.text} 
                                                            selected={isAyaSelected}
                                                            onPress={() => this.onSelectAyah(word.aya)}
                                                            isFirstSelectedWord={isFirstSelectedWord} />)
                                                    }
                                                    else if (word.char_type === "end") {
                                                        return (<EndOfAyah key={word.id} ayahNumber={word.aya}
                                                            onPress={() => this.onSelectAyah(word.aya)}
                                                            selected={this.isAyahSelected(word.aya)}
                                                            isLastSelectedAyah={isLastSelectedAyah}
                                                        />)
                                                    }
                                                }
                                                )
                                            }
                                        </View>
                                    )
                                }
                            })}
                    </View>
                    <View style={styles.footer}>
                        <ImageBackground source={require('assets/images/quran/title-frame.png')}
                            style={{
                                width: '100%', justifyContent: 'center',
                                alignSelf: 'center',
                                alignItems: 'center',
                            }} resizeMethod='scale'>
                            {
                                !this.state.editPageNumber &&
                                <TouchableText
                                    text={page.toString()}
                                    style={{ ...fontStyles.mainTextStylePrimaryDark, marginLeft: 5 }}
                                    onPress={() => {this.setState({ editPageNumber: true })}}
                                    />
                            }{
                                this.state.editPageNumber &&
                                <View
                                    style={{ flexDirection: 'row', alignSelf: 'stretch', alignItems: 'center', justifyContent: 'center' }}>
                                    <TextInput
                                        style={[styles.textInputStyle, fontStyles.mainTextStyleDarkGrey]}
                                        autoFocus={true}
                                        selectTextOnFocus={true}
                                        value={this.state.editedPageNumber.toString()}
                                        onChangeText={(value) => this.setState({ editedPageNumber: value })}
                                        keyboardType='numeric'
                                    />

                                    <TouchableText
                                        text={strings.Go}
                                        style={{ ...fontStyles.mainTextStylePrimaryDark, marginLeft: 5 }}
                                        onPress={() => { this.updatePage() }
                                        } />

                                </View>
                            }
                        </ImageBackground>
                    </View>
                </View>

            )
        }
    }
}

/**
 * 
                            
 */
const styles = StyleSheet.create({
    ayahText: {
        textAlign: 'right',
        fontFamily: 'me_quran',
        fontSize: 20,
        color: colors.darkGrey
    },
    footer: {
        justifyContent: 'center',
        alignSelf: 'stretch',
        height: 30,
        alignItems: 'center',
    },
    textInputStyle: {
        backgroundColor: colors.lightGrey,
        borderColor: colors.darkGrey,
        width: screenWidth * 0.2,
        height: screenHeight * 0.03,
        marginTop: 5,
        marginBottom: 5,
        textAlign: "center",
        alignItems: "center",
        justifyContent: "center"
    },
    topMiddleView: {
        justifyContent: 'center',
        alignSelf: 'center',
        alignItems: 'center',
        flex: 10,
        paddingTop: Dimensions.get('window').height * 0.035,
        paddingBottom: Dimensions.get('window').height * 0.01,
        height: 600
    },
    entireTopView: {
        height: Dimensions.get('window').height * 0.05,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: colors.white,
        borderBottomWidth: 0.25,
        borderBottomColor: colors.grey,
    },
})

export default SelectionPage;