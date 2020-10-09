import React from "react";
import {
  View,
  ImageBackground,
  StyleSheet,
  TextInput,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  PixelRatio
} from "react-native";
import colors from "config/colors";
import TouchableText from "components/TouchableText";
import LoadingSpinner from "components/LoadingSpinner";
import { getPageTextWbW } from "../ServiceActions/getQuranContent";
import Basmalah from "./Basmalah";
import fontStyles from "config/fontStyles";
import strings from "config/strings";
import { screenHeight, screenWidth } from "config/dimensions";
import PageHeader from "./PageHeader";
import TextLine from "./TextLine";
import AssignmentEntryComponent from "components/AssignmentEntryComponent";
import surahs from "../Data/Surahs.json";
import pages from "../Data/mushaf-wbw.json";
import SurahHeader from "./SurahHeader";
import { compareOrder, isLineSelected } from "../Helpers/AyahsOrder";
import * as _ from "lodash";

//Creates the higher order component
class SelectionPage extends React.Component {
  //------------------------ default state ----------------------------------------
  lastPage = 604;
  state = {
    isLoading: true,
    lines: [],
    page: this.lastPage,
    editedPageNumber: this.props.page,
    editPageNumber: false,
    selectedAyahsStart: {
      surah: 0,
      page: this.lastPage,
      ayah: 0,
    },
    selectedAyahsEnd: {
      surah: 0,
      page: this.lastPage,
      ayah: 0,
    },
    selectionStarted: false,
    selectionCompleted: false,
    isSurahSelectionVisible: false,
    selectionOn: false
  };

  //------------------------ initialize component ----------------------------------------
  componentDidMount() {
    if (!this.props.isLoading) {
      this.getPageLines(this.props.page);
    }
  }

  // only redraw lines if the page have changed
  static getDerivedStateFromProps(nextProps, prevState) {
    let retValue = null;
    //if we didn't have the page text initialized before, let's initialize it.
    if (
      (!prevState.lines || prevState.lines.length === 0) &&
      !nextProps.isLoading
    ) {
      retValue = {
        page: nextProps.page,
        isLoading: false,
        lines: pages[nextProps.page - 1],
      };
    }

    //if there is a new selection, update the page.
    if (
      nextProps.selectionOn &&
      (compareOrder(
        nextProps.selectedAyahsStart,
        prevState.selectedAyahsStart
      ) !== 0 ||
        compareOrder(nextProps.selectedAyahsEnd, prevState.selectedAyahsEnd) !==
          0)
    ) {
      retValue = {
        ...retValue,
        page: nextProps.page,
        selectedAyahsStart: nextProps.selectedAyahsStart,
        selectedAyahsEnd: nextProps.selectedAyahsEnd,
        selectionStarted: nextProps.selectionStarted,
        selectionCompleted: nextProps.selectionCompleted,
        selectionOn: nextProps.selectionOn,
        isLoading: false,
      };
    }

    //clear previous selection if the page has no longer an active selection
    if (!nextProps.selectionOn && prevState.selectionOn) {
      retValue = {
        ...retValue,
        page: nextProps.page,
        selectedAyahsStart: nextProps.selectedAyahsStart,
        selectedAyahsEnd: nextProps.selectedAyahsEnd,
        selectionStarted: nextProps.selectionStarted,
        selectionCompleted: nextProps.selectionCompleted,
        selectionOn: nextProps.selectionOn,
        isLoading: false,
      };
    }
    return retValue;
  }

  shouldComponentUpdate(nextProps, nextState) {
    //if there are no lines initialized yet, skip rendering.
    if (!nextState.lines || nextState.lines.length === 0) {
      return false;
    }

    //if there were no lines initialized, and now we have them, let's re-render.
    if (!this.state.lines || this.state.lines.length === 0) {
      return true;
    }

    //if we have a change in the selection, let's re-render
    if (
      nextProps.selectionOn &&
      (compareOrder(
        nextProps.selectedAyahsStart,
        this.state.selectedAyahsStart
      ) !== 0 ||
        compareOrder(
          nextProps.selectedAyahsEnd,
          this.state.selectedAyahsEnd
        ) !== 0)
    ) {
      return true;
    }

    if (
      !_.isEqual(nextProps.highlightedWords, this.props.highlightedWords) ||
      !_.isEqual(nextProps.highlightedAyahs, this.props.highlightedAyahs) ||
      nextProps.showLoadingOnHighlightedAyah !==
        this.props.showLoadingOnHighlightedAyah
    ) {
      return true;
    }

    //if font scaling changed, re-render
    if (nextProps.mushafFontScale !== this.props.mushafFontScale) {
      return true;
    }

    //if the sele.getDerivedStateFromPropsr
    if (
      nextProps.selectionOn != this.state.selectionOn ||
      nextProps.isLoading !== this.state.isLoading ||
      nextProps.readOnly !== this.props.readOnly || 
      nextState.isSurahSelectionVisible !==
        this.state.isSurahSelectionVisible ||
      nextState.editPageNumber !== this.state.editPageNumber ||
      nextState.editedPageNumber !== this.state.editedPageNumber ||
      nextState.selectionStarted !== this.state.selectionStarted ||
      nextState.selectionCompleted !== this.state.selectionCompleted
    ) {
      return true;
    }

    //if the text of the page has changed, let's re-render
    if (
      nextState.lines[0].surah !== this.state.lines[0].surah ||
      nextState.lines[0].ayah !== this.state.lines[0].ayah ||
      nextState.lines[1].surah !== this.state.lines[1].surah ||
      nextState.lines[1].ayah !== this.state.lines[1].ayah
    ) {
      return true;
    }

    if (nextProps.profileImage !== this.props.profileImage) {
      return true;
    }

    //otherwise, don't re-render.
    return false;
  }

  //------------------------ Getters and content formatters ----------------------------------------

  //retrieves the lines, ayahs, and words of a particular page of the mushhaf
  //parameters: page: the page number we want to retrieve
  // reads the data from a local json file
  // data retrieved is saved under this.state.lines
  getPageLines(page) {
    this.setState({
      page: page,
      isLoading: false,
      lines: pages[page - 1],
    });
  }

  //retrieves the lines, ayahs, and words of a particular page of the mushhaf
  //parameters: page: the page number we want to retrieve
  // reads the data from a an online api (needs internet and has latency)
  // data retrieved is saved under this.state.lines
  async fetchPageLines(page) {
    this.setState({
      isLoading: true
    });
    const lines = await getPageTextWbW(page);
    this.setState({
      isLoading: false,
      lines,
    });
  }

  getLineAyahText(wordsList) {
    const rightBracket = "  \uFD3F";
    const leftBracket = "\uFD3E";

    let lineAyahText = wordsList.reduce(
      (aya, word) => {
        if (word.char_type === "end") {
          return "".concat(aya, " ", rightBracket, word.aya, leftBracket);
        } else if (word.char_type === "word") {
          return "".concat(aya, " ", word.text);
        } else {
          return aya;
        }
      },
      "" //initialize line text with empty string
    );

    return lineAyahText;
  }

  getFirstAyahOfPage() {
    const { page, lines } = this.state;

    //find the first line that has text inside (type === line, instad of basmalah or start_surah)
    let startLine = lines.slice().find(line => line.type === "line");

    return {
      ayah: Number(startLine.ayah),
      surah: Number(startLine.surahNumber),
      page: page,
      wordNum: Number(startLine.text[0].id)
    };
  }

  getLastAyahOfLine(line) {
    //reverse the order of words within the line, (so we search from last word moving backward)
    // then return the first element we find of type === end (end of ayah mark),
    // end return its number
    let word = line.text
      .slice()
      .reverse()
      .find(word => word.char_type === "end");

    return Number(word.aya);
  }

  //returns the last ayah of the page..
  //
  getLastAyahOfPage() {
    const { page, lines } = this.state;

    //walk the lines array backward, and find the last line that has text inside (type === line, instad of basmalah or start_surah)
    let lastLine = lines
      .slice()
      .reverse()
      .find(line => line.type === "line");

    //then get the last ayah within the last line
    let lastAyah = this.getLastAyahOfLine(lastLine);

    return {
      ayah: lastAyah,
      surah: Number(lastLine.surahNumber),
      page: page,
      wordNum: Number(lastLine.text[lastLine.text.length - 1].id),
    };
  }

  //------------------------ event handlers ----------------------------------------
  updatePage() {
    const { editedPageNumber, page } = this.state;

    if (
      isNaN(editedPageNumber) ||
      Number(editedPageNumber) < 1 ||
      Number(editedPageNumber) > this.lastPage
    ) {
      Alert.alert(strings.Whoops, strings.InvalidPageNumber);
      return;
    }

    this.setState({
      isLoading: editedPageNumber !== page ? true : false,
      editPageNumber: false
    });

    this.props.onChangePage(editedPageNumber, true);
  }

  updateSurah(surah) {
    try {
      // in the surah array, surah ids 1-114 have Arabic names and 115- 229 have English names
      // the formula below gets the surah index from 0 to 113 (so we can get its info from the surah db)
      let surahIndex = Number(surah.id);
      if (surahIndex > 114) {
        //names with index 115-229 are english surah names
        if (surahIndex <= 229) {
          surahIndex -= 114;
        } else {
        }
      }

      const startPage = surahs[surahIndex].startpage;
      this.setState({
        isSurahSelectionVisible: false,
        editedPageNumber: Number(startPage)
      });
      this.props.onChangePage(startPage, false);
    } catch (error) {
      this.setState({
        isSurahSelectionVisible: false
      });
      this.props.onUpdateAssignmentName(surah);
    }
  }

  //selects the entire page
  onSelectPage() {
    const { page, lines } = this.state;

    //capture the first ayah (where the selection starts from)
    let firstAyah = this.getFirstAyahOfPage();

    //capture the last ayah (the ayah of the last word in the page)
    let lastAyah = this.getLastAyahOfPage();

    //select all the ayahs between first and last ayah of the page
    this.props.onSelectAyahs(firstAyah, lastAyah);
  }

  //------------------------ render component ----------------------------------------
  render() {
    const {
      isLoading,
      lines,
      page,
      selectedAyahsStart,
      selectedAyahsEnd,
      selectionStarted,
      selectionCompleted,
      selectionOn,
    } = this.state;

    if (isLoading === true) {
      return (
        <View id={this.state.page + "spinner"} style={styles.spinner}>
          <LoadingSpinner isVisible={true} />
        </View>
      );
    } else {
      let lineAlign = "stretch";

      // We show an arc shading with borderRadius to mark the beginning of a selection
      // we use this to remember that we did it already so we don't
      // do that in the next lines that belong to the same ayah.
      let noSelectionInPreviousLines;

      const surahName =
        lines[0] && lines[0].surah
          ? lines[0].surah
          : lines[1] && lines[1].surah
          ? lines[1].surah
          : "Select new assignment";

      if (this.state.page === 1) {
        lineAlign = "center";
      }

      return (
        <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
          <ScrollView>
            <View
              id={this.state.page + "upperWrapper"}
              style={{
                backgroundColor: colors.white,
                justifyContent: "flex-end",
              }}
            >
              <AssignmentEntryComponent
                visible={this.state.isSurahSelectionVisible}
                onSubmit={surah => this.updateSurah(surah)}
                assignment={surahName}
                onCancel={() =>
                  this.setState({ isSurahSelectionVisible: false })
                }
              />

              {!this.props.hideHeader && (
                <PageHeader
                  Title={surahName}
                  TitleOnPress={() => {
                    const { isSurahSelectionVisible } = this.state;
                    this.setState({
                      isSurahSelectionVisible: !isSurahSelectionVisible
                    });
                  }}
                  RightIconName={
                    this.props.topRightIconName
                      ? this.props.topRightIconName
                      : "check-all"
                  }
                  RightOnPress={() => {
                    this.props.topRightOnPress
                      ? this.props.topRightOnPress()
                      : this.onSelectPage();
                  }}
                  LeftImage={this.props.profileImage}
                  currentClass={this.props.currentClass}
                  assignToID={this.props.assignToID}
                  onSelect={this.props.onChangeAssignee}
                  disableChangingUser={this.props.disableChangingUser}
                  fontSizeScale={this.props.mushafFontScale}
                />
              )}

              <View id={this.state.page} style={styles.pageContent}>
                {lines !== undefined &&
                  lines.map((line, index) => {
                    if (line.type === "start_sura") {
                      return (
                        <SurahHeader
                          surahName={line.name}
                          key={line.line + "_" + index}
                        />
                      );
                    } else if (line.type === "besmellah") {
                      return (
                        <Basmalah
                          key={line.line + "_basmalah"}
                          fontSizeScale={this.props.mushafFontScale}
                        />
                      );
                    } else {
                      let word = line.text[line.text.length - 1];
                      let curAyah = {
                        ayah: Number(word.aya),
                        surah: Number(word.sura),
                        page: page,
                        wordNum: Number(word.id)
                      };
                      if (compareOrder(selectedAyahsStart, curAyah) >= 0) {
                        //if we are passed the ayah for the first time, set noSelectionInPreviousLines to true
                        if (noSelectionInPreviousLines === undefined) {
                          noSelectionInPreviousLines = true;
                        } else {
                          //if we passed it but the beginning of the ayah was in a prior line, don't mark it as the first line.
                          noSelectionInPreviousLines = false;
                        }
                      }

                      if (selectionOn && selectedAyahsStart.ayah !== 0) {
                        let lineSelected = isLineSelected(
                          line,
                          selectedAyahsStart,
                          selectedAyahsEnd,
                          page
                        );

                        if (this.props.showSelectedLinesOnly && !lineSelected) {
                          return undefined;
                        }
                      }

                      return (
                        <TextLine
                          key={page + "_" + line.line}
                          lineText={line.text}
                          selectionOn={selectionOn}
                          showTooltipOnPress={this.props.showTooltipOnPress}
                          highlightedWords={this.props.highlightedWords}
                          highlightedAyahs={this.props.highlightedAyahs}
                          highlightedColor={this.props.highlightedColor}
                          readOnly={this.props.readOnly}
                          showLoadingOnHighlightedAyah={
                            this.props.showLoadingOnHighlightedAyah
                          }
                          selectedAyahsEnd={selectedAyahsEnd}
                          selectedAyahsStart={selectedAyahsStart}
                          selectionStarted={selectionStarted}
                          selectionCompleted={selectionCompleted}
                          noSelectionInPreviousLines={
                            noSelectionInPreviousLines
                          }
                          onSelectAyah={(ayah, word) =>
                            this.props.onSelectAyah(ayah, word)
                          }
                          page={this.state.page}
                          lineAlign={lineAlign}
                          evalNotesComponent={this.props.evalNotesComponent}
                          removeHighlight={this.props.removeHighlight}
                          mushafFontScale={this.props.mushafFontScale}
                        />
                      );
                    }
                  })}
              </View>
              <View style={styles.footer}>
                <ImageBackground
                  source={require("assets/images/quran/title-frame.png")}
                  style={{
                    width: "100%",
                    justifyContent: "center",
                    alignSelf: "center",
                    alignItems: "center"
                  }}
                  resizeMethod="scale"
                >
                  {!this.state.editPageNumber && (
                    <TouchableText
                      text={page.toString() + " (Change page)"}
                      style={{
                        ...fontStyles.mainTextStylePrimaryDark,
                        ...fontStyles.textInputStyle
                      }}
                      onPress={() => {
                        this.setState({ editPageNumber: true });
                      }}
                    />
                  )}
                  {this.state.editPageNumber && (
                    <View
                      style={{
                        flexDirection: "row",
                        alignSelf: "stretch",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      <TextInput
                        style={[
                          styles.textInputStyle,
                          fontStyles.mainTextStyleDarkGrey
                        ]}
                        autoFocus={true}
                        selectTextOnFocus={true}
                        autoCorrect={false}
                        value={this.state.editedPageNumber.toString()}
                        onChangeText={value =>
                          this.setState({ editedPageNumber: Number(value) })
                        }
                        onEndEditing={() => this.updatePage()}
                        keyboardType="numeric"
                      />

                      <TouchableText
                        text={strings.Go}
                        style={{
                          ...fontStyles.mainTextStylePrimaryDark,
                          marginLeft: screenWidth * 0.01
                        }}
                        onPress={() => {
                          this.updatePage();
                        }}
                      />
                    </View>
                  )}
                </ImageBackground>
              </View>
            </View>
            <View style={{ height: 300 }} />
          </ScrollView>
        </KeyboardAvoidingView>
      );
    }
  }
}

/**
 *
    Page styles
 */
const styles = StyleSheet.create({
  ayahText: {
    textAlign: "right",
    fontFamily: "me_quran",
    fontSize: 20,
    color: colors.darkGrey,
  },
  footer: {
    justifyContent: "center",
    alignSelf: "stretch",
    height: 40,
    alignItems: "center"
  },
  textInputStyle: {
    backgroundColor: colors.veryLightGrey,
    borderColor: colors.darkGrey,
    width: screenWidth * 0.3,
    height: 40,
    borderRadius: 2,
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  topMiddleView: {
    justifyContent: "center",
    alignSelf: "center",
    alignItems: "center",
    flex: 10,
    paddingTop: screenHeight * 0.035,
    paddingBottom: screenHeight * 0.01,
  },
  entireTopView: {
    height: screenHeight * 0.05,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.white,
    borderBottomWidth: 0.25,
    borderBottomColor: colors.grey
  },
  container: {
    flex: 1
  },
  spinner: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  pageContent: {
    marginVertical: 5,
    marginHorizontal: 2,
    backgroundColor: colors.white,
    width: screenWidth
  },
});

export default SelectionPage;
