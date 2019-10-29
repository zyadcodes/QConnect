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
import strings from 'config/strings';
import { screenHeight, screenWidth } from 'config/dimensions';
import PageHeader from './PageHeader';
import AssignmentEntryComponent from 'components/AssignmentEntryComponent';
import surahs from '../Data/Surahs.json'
import pages from '../Data/mushaf-wbw.json'
import {compareOrder} from '../Helpers/AyahsOrder'


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

        this.props.onChangePage(editedPageNumber, true);
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
                }
            }

            const startPage = surahs[surahIndex].startpage;
            this.setState({
                isSurahSelectionVisible: false,
                editedPageNumber: Number(startPage),
            });
            this.props.onChangePage(startPage, false);
        } catch (error) {
            this.setState({
                isSurahSelectionVisible: false,
            });
            this.props.onUpdateAssignmentName(surah)
        }

    }

    getFirstAyahOfPage(){
        const {page, lines} = this.state;

        //find the first line that has text inside (type === line, instad of basmalah or start_surah)
        let startLine = lines.slice().find(line => line.type === "line");

        return { ayah: Number(startLine.ayah), surah: Number(startLine.surahNumber), page: page };
    }

    getLastAyahOfLine(line) {
        //reverse the order of words within the line, (so we search from last word moving backward)
        // then return the first element we find of type === end (end of ayah mark),
        // end return its number 
        let word = line.text.slice().reverse().find(word => word.char_type === "end");

        return Number(word.aya);
    }

    //returns the last ayah of the page..
    //
    getLastAyahOfPage(){
        const {page, lines} = this.state;

        //walk the lines array backward, and find the last line that has text inside (type === line, instad of basmalah or start_surah)
        let lastLine = lines.slice().reverse().find(line => line.type === "line");

        //then get the last ayah within the last line
        let lastAyah = this.getLastAyahOfLine(lastLine);

        return { ayah: lastAyah, surah: Number(lastLine.surahNumber), page: page };
    }

    //selects the entire page
    onSelectPage(){
        const {page, lines} = this.state;
        
        //capture the first ayah (where the selection starts from)
        let firstAyah = this.getFirstAyahOfPage();

        //capture the last ayah (the ayah of the last word in the page)
        let lastAyah = this.getLastAyahOfPage();

        //select all the ayahs between first and last ayah of the page
        this.props.onSelectAyahs(firstAyah, lastAyah);
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
                        RightIconName="check-all"
                        RightOnPress={() => { this.onSelectPage(); }}
                        LeftImage={this.props.profileImage}
                        currentClass={this.props.currentClass}
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
        paddingTop: screenHeight * 0.035,
        paddingBottom: screenHeight * 0.01,
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