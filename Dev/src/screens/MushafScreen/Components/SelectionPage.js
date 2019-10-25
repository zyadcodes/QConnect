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
import pages from '../Data/mushaf-wbw.json'
import {compareOrder} from '../Helpers/AyahsOrder'
import FirebaseFunctions from '../../../../config/FirebaseFunctions';

//Creates the higher order component
class SelectionPage extends React.Component {

    lastPage = 604;

    state = {
        isLoading: true,
        lines: [],
        page: this.lastPage,
        editedPageNumber: this.lastPage,
        editPageNumber: false,
        selectedAyahsStart: {
            surah: 0,
            page: this.lastPage,
            ayah: 0
        },
        selectedAyahsEnd: {
            surah: 0,
            page: this.lastPage,
            ayah: 0
        },
        selectionStarted: false,
        selectionCompleted: false,
        isSurahSelectionVisible: false,
    }

    async componentDidMount() {
        if(!this.props.isLoading){
            this.getPageLines(this.state.page);
        }
        
    }

    // only redraw lines if the page have changed
    static getDerivedStateFromProps(nextProps, prevState){
        let lines = {}
        if(nextProps.page!==prevState.page){
            lines = {lines: pages[nextProps.page - 1]};
        }
        return { 
            ...lines,
            page: nextProps.page, 
            selectedAyahsStart: nextProps.selectedAyahsStart,
            selectedAyahsEnd: nextProps.selectedAyahsEnd,
            selectionStarted: nextProps.selectionStarted,
            selectionCompleted: nextProps.selectionCompleted,
            isLoading: false
        };
     }

    //retrieves the lines, ayahs, and words of a particular page of the mushhaf
    //parameters: page: the page number we want to retrieve
    // reads the data from a local json file
    // data retrieved is saved under this.state.lines
    async getPageLines(page) {
        const lines = await pages[page - 1] //(-1 to switch from 1 based index to 0 based index array)
        this.setState({
            isLoading: false,
            lines
        });
    }

    //retrieves the lines, ayahs, and words of a particular page of the mushhaf
    //parameters: page: the page number we want to retrieve
    // reads the data from a an online api (needs internet and has latency)
    // data retrieved is saved under this.state.lines
    async fetchPageLines(page) {
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

    isAyahSelected(ayah) {
        return (
            (this.state.selectionStarted || this.state.selectionCompleted) && // there are ayahs selected by the user
            compareOrder(this.state.selectedAyahsStart, ayah) >= 0 && //if ayah is after selection start
            compareOrder(this.state.selectedAyahsEnd, ayah) <= 0 //and ayah before selection end
        );
    }

    updatePage() {
        const { editedPageNumber } = this.state

        if (isNaN(editedPageNumber) || Number(editedPageNumber) < 1 || Number(editedPageNumber) > this.lastPage) {
            Alert.alert(strings.Whoops, strings.InvalidPageNumber);
            return;
        }

        this.setState({
            editPageNumber: false,
        })

        this.props.onChangePage(editedPageNumber);
    }

    updateSurah(surah) {
        try {
            // in the surah array, surah ids 1-114 have Arabic names and 115- 229 have English names
            // the formula below gets the surah index from 0 to 113 (so we can get its info from the surah db)
            let surahIndex = (Number(surah.id));
            if(surahIndex > 114){
                //names with index 115-229 are english surah names
                if(surahIndex <= 229){
                    surahIndex -= 114;
                }
                else{
                    console.log("invalid surah Index");
                    FirebaseFunctions.logEvent("Surah suggestion returned an invalid index: " + surahIndex);
                }
            }

            const startPage = surahs[surahIndex].startpage;
            this.setState({
                isSurahSelectionVisible: false,
                editedPageNumber: Number(startPage),
            });
            this.props.onChangePage(startPage);
        } catch (error) {
            Alert.alert(strings.Whoops,
                "Something went wrong. If the error persists, please contact us at quranconnect@outlook.com")
        }

    }

    render() {
        const { isLoading, lines, page } = this.state;
        let isFirstWord = true;
        let lineAlign = 'stretch'
        const surahName = (lines[0] && lines[0].surah) ? lines[0].surah :
            (lines[1] && lines[1].surah) ? lines[1].surah : "Select new assignment";

        if (this.state.page === 1) { lineAlign = 'center' }

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
                        onCancel={() => this.setState({ isSurahSelectionVisible: false })}
                    />
                    <PageHeader
                        Title={surahName}
                        TitleOnPress={() => {
                            const { isSurahSelectionVisible } = this.state;
                            this.setState({ isSurahSelectionVisible: !isSurahSelectionVisible })
                        }}
                    />
                    <View id={this.state.page} style={{ marginVertical: 5, marginHorizontal: 5, backgroundColor: colors.white }}>
                        {
                            lines !== undefined &&
                            lines.map((line, index) => {
                                if (line.type === "start_sura") {
                                    return <View style={styles.footer} key={line.line + "_" + index}>
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
                                                    let curAyah = { ayah: Number(word.aya), surah: Number(word.sura), page: page };
                                                    let isAyaSelected = this.isAyahSelected(curAyah);
                                                    let isLastSelectedAyah = isAyaSelected && (compareOrder(this.state.selectedAyahsEnd, curAyah) === 0)
                                                    if (word.char_type === "word") {
                                                        let isFirstSelectedWord = isAyaSelected && isFirstWord;
                                                        if (isFirstSelectedWord) { isFirstWord = false; }
                                                        return (<AyahSelectionWord key={word.id}
                                                            text={word.text}
                                                            selected={isAyaSelected}
                                                            onPress={() => this.props.onSelectAyah(curAyah)}
                                                            isFirstSelectedWord={isFirstSelectedWord} />)
                                                    }
                                                    else if (word.char_type === "end") {
                                                        return (<EndOfAyah key={word.id} ayahNumber={word.aya}
                                                            onPress={() => this.props.onSelectAyah(curAyah)}
                                                            selected={this.isAyahSelected(curAyah)}
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
                                    onPress={() => { this.setState({ editPageNumber: true }) }}
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
                                        onChangeText={(value) => this.setState({ editedPageNumber: Number(value) })}
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
    Page styles                       
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
    container: {
        flex: 1,
      }
})

export default SelectionPage;