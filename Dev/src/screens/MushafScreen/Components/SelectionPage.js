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
        this.getPageLines(this.state.page);
    }

    //retrieves the lines, ayahs, and words of a particular page of the mushhaf
    //parameters: page: the page number we want to retrieve
    // reads the data from a local json file
    // data retrieved is saved under this.state.lines
    async getPageLines(page){
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

    onSelectAyah(selectedAyah) {
        const { selectedAyahsStart, selectedAyahsEnd, selectionCompleted, selectionStarted } = this.state;
        const noAyahSelected = {
            surah: 0,
            page: 0,
            ayah: 0
        };

        //if the user taps on the same selected aya again, turn off selection
        if (this.compareOrder(selectedAyahsStart, selectedAyahsEnd) === 0 &&
            this.compareOrder(selectedAyahsStart, selectedAyah) === 0 ) {
            this.setState({
                selectionStarted: false,
                selectionCompleted: false,
                selectedAyahsStart: noAyahSelected,
                selectedAyahsEnd: noAyahSelected,
            })
        }
        else if (!selectionStarted) {
            this.setState({
                selectionStarted: true,
                selectionCompleted: false,
                selectedAyahsStart: selectedAyah,
                selectedAyahsEnd: selectedAyah
            })
        } else if (!selectionCompleted) {
            this.setState(
                {
                    selectionStarted: false,
                    selectionCompleted: true,
                }
            )

            //Set the smallest number as the start, and the larger as the end
            if (this.compareOrder(selectedAyahsStart, selectedAyah) > 0) {
                this.setState({ selectedAyahsEnd: selectedAyah })
            } else {
                this.setState({ selectedAyahsStart: selectedAyah })
            }
        }
    }

    // compare which ayah comes first: ayah1 or ayah2
    // return: 0 if they are the same ayah
    //         1 if ayah1 is before ayah2
    //         -1 if ayah2 is before ayah1
    compareOrder(ayah1, ayah2) {

        if (ayah1.page === ayah2.page &&
            ayah1.ayah === ayah2.ayah &&
            ayah1.surah === ayah2.surah) {
            return 0; //
        }
        // ayah 1 is before ayah 2 if:
        else if (ayah1.page < ayah2.page || // ayah1 page is before ayah 2 page
            (ayah1.page === ayah2.page && ( // OR: ayah1 and ayah2 on the same page yet:
                ayah1.surah < ayah2.surah || // ayah1's surah is before ayah 2's surah
                (ayah1.surah === ayah2.surah && // OR: ayah1 and ayah2 are on the same surah yet 
                    ayah1.ayah < ayah2.ayah) // ayah1's number is less than ayah2.
                )
             )) {
            return 1;
        }

        //if not the same ayahs, and not ayah 1 before ayah 2, then ayah 2 is before ayah 1.
        return -1;
    }

    isAyahSelected(ayah) {
        return (
            (this.state.selectionStarted || this.state.selectionCompleted) && // there are ayahs selected by the user
            this.compareOrder(this.state.selectedAyahsStart, ayah)  >= 0 && //if ayah is after selection start
            this.compareOrder(this.state.selectedAyahsEnd, ayah, ) <= 0 //and ayah before selection end
        ); 
    }

    updatePage() {
        const { editedPageNumber, page } = this.state

        if (isNaN(editedPageNumber) || Number(editedPageNumber) < 1 || Number(editedPageNumber) > this.lastPage) {
            Alert.alert(strings.Whoops, strings.InvalidPageNumber);
            return;
        }

        if (editedPageNumber !== page) {
            this.setState({
                editPageNumber: false,
                page: Number(editedPageNumber),
            })
        }
        this.setState({
            editPageNumber: false,
        })

        this.getPageLines(editedPageNumber);
    }

    updateSurah(surah) {
        try {
            // in the surah array, indexes 0-113 have Arabic names and 114- 227 have English names
            // the formula below gets the surah index from 1 to 114 (so we can get its info from the surah db)
            const surahIndex = (Number(surah.id) % 114) + 1

            const startPage = surahs[surahIndex].startpage;
            this.setState({
                isSurahSelectionVisible: false,
                editedPageNumber: Number(startPage),
                editPageNumber: false,
                page: Number(startPage),
            });
            this.getPageLines(startPage);
        } catch (error) {
            Alert.alert(strings.Whoops,
                "Something went wrong. If the error persists, please contact us at quranconnect@outlook.com")
        }

    }

    debugMe(isAyaSelected, curAyah){
        let isLastSelectedAyah = isAyaSelected && (this.compareOrder(this.state.selectedAyahsEnd, curAyah) === 0)
        return isLastSelectedAyah;
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
                                                    let curAyah = {ayah: Number(word.aya), surah: Number(word.sura), page: page};
                                                    let isAyaSelected = this.isAyahSelected(curAyah);
                                                    let isLastSelectedAyah = isAyaSelected && (this.compareOrder(this.state.selectedAyahsEnd, curAyah) === 0)
                                                    if(isLastSelectedAyah){this.debugMe(isAyaSelected, curAyah)}
                                                    if (word.char_type === "word") {
                                                        let isFirstSelectedWord = isAyaSelected && isFirstWord;
                                                        if (isFirstSelectedWord) { isFirstWord = false; }
                                                        return (<AyahSelectionWord key={word.id}
                                                            text={word.text}
                                                            selected={isAyaSelected}
                                                            onPress={() => this.onSelectAyah(curAyah)}
                                                            isFirstSelectedWord={isFirstSelectedWord} />)
                                                    }
                                                    else if (word.char_type === "end") {
                                                        return (<EndOfAyah key={word.id} ayahNumber={word.aya}
                                                            onPress={() => this.onSelectAyah(curAyah)}
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