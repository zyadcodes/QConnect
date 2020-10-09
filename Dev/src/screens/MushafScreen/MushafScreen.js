//Screen which will provide all of the possible settings for the user to click on
import React from "react";
import { View, StyleSheet, ScrollView, PixelRatio } from "react-native";
import LoadingSpinner from "components/LoadingSpinner";
import colors from "config/colors";
import QcParentScreen from "screens/QcParentScreen";
import SelectionPage from "./Components/SelectionPage";
import Swiper from "react-native-swiper";
import { screenHeight, screenWidth } from "config/dimensions";
import * as _ from "lodash";
import { getFontScale } from "react-native-device-info";
import {
  isNoSelection,
  noSelection,
} from "screens/MushafScreen/Helpers/consts";

class MushafPage extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    if (
      (nextProps.curIndex === nextProps.idx &&
        nextProps.page === this.props.page) ||
      ((!_.isEqual(nextProps.selection, this.props.selection) &&
        nextProps.selection === undefined) ||
        (nextProps.page <= nextProps.selection.end.page &&
          nextProps.page >= nextProps.selection.start.page))
    ) {
      return true;
    }
    return false;
  }

  render() {
    const {
      profileImage,
      assignToID,
      selection,
      disableChangingUser,
      showLoadingOnHighlightedAyah,
      hideHeader,
      showSelectedLinesOnly,
      highlightedColor,
      showTooltipOnPress,
      evalNotesComponent,
      removeHighlight,
      assignmentType,
      highlightedWords,
      highlightedAyahs,
      item,
      idx,
      onChangePage,
      isLoading,
      currentClass,
      mushafFontScale,
      readOnly
    } = this.props;

    const itemInt = parseInt(item);
    return (
      <View style={{ flex: 1 }} key={idx}>
        <SelectionPage
          page={itemInt}
          hideHeader={hideHeader}
          showSelectedLinesOnly={showSelectedLinesOnly}
          showTooltipOnPress={showTooltipOnPress} //if the prop is not passed, we default to false
          onChangePage={onChangePage}
          highlightedWords={highlightedWords}
          highlightedAyahs={highlightedAyahs}
          highlightedColor={highlightedColor}
          readOnly={readOnly}
          showLoadingOnHighlightedAyah={showLoadingOnHighlightedAyah}
          selectedAyahsStart={selection.start}
          selectedAyahsEnd={selection.end}
          selectionStarted={selection.started}
          selectionCompleted={selection.completed}
          evalNotesComponent={evalNotesComponent}
          removeHighlight={removeHighlight}
          selectionOn={
            itemInt >= selection.start.page && itemInt <= selection.end.page
          }
          profileImage={profileImage}
          currentClass={currentClass}
          isLoading={isLoading}
          assignmentType={assignmentType}
          assignToID={assignToID}
          disableChangingUser={disableChangingUser}
          onChangeAssignee={(id, imageID, isClassID) => {
            if (this.props.onChangeAssignee !== undefined) {
              this.props.onChangeAssignee(id, imageID, isClassID);
            }
          }}
          //callback when user taps on a single ayah to selects
          //determines whether this would be the start of end of the selection
          // and select ayahs in between
          onSelectAyah={(selectedAyah, selectedWord) =>
            this.props.onSelectAyah(selectedAyah, selectedWord)
          }
          //callback when user selects a range of ayahs (line an entire page or surah)
          onSelectAyahs={(firstAyah, lastAyah) =>
            this.props.onSelectAyahs(firstAyah, lastAyah)
          }
          topRightIconName={this.props.topRightIconName}
          topRightOnPress={this.props.topRightOnPress}
          onUpdateAssignmentName={newAssignmentName =>
            this.props.setFreeFormAssignmentName(newAssignmentName)
          }
          mushafFontScale={mushafFontScale}
        />
      </View>
    );
  }
}

//-------- MushafScreen: container component for the screen holding Mushaf pages ------
// Implements pagination through a swiper component with a fixed width: 3 screens
// swiping screens back and forth changes the loaded pages but keeps the set to 3 screens and the loaded page as the middle screen
// this way a user can always swipe left and right
// Todo: currently the first and last screen of the mushhaf have a hack since they deviate from this paradigm. Need to fix later on.
export default class MushafScreen extends QcParentScreen {
  //------------------------ initial state ----------------------------
  lastPage = 604;
  state = {
    pages: [],
    key: 1,
    page:
      this.props.selection && this.props.selection.start
        ? this.props.selection.start.page
        : 1,
    index:
      this.props.selection && this.props.selection.start
        ? 604 - this.props.selection.start.page
        : 603,
    classID: this.props,
    studentID: this.props.studentID,
    assignmentType: this.props.assignmentType,
    loadScreenOnClose: this.props.loadScreenOnClose,
    popOnClose: this.props.popOnClose,
    isLoading: true,
  };

  async componentDidMount() {
    //we mimmic right to left pages scanning by reversing the pages order in the swiper component
    let allPages = Array.from(Array(604), (e, i) => 604 - i);

    getFontScale().then(fontScale => {
      if (fontScale > 1) {
        this.setState({ mushafFontScale: fontScale });
      }
    });

    this.setState({
      pages: allPages,
      isLoading: false
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (
      nextState.isLoading === this.state.isLoading &&
      nextState.pages === this.state.pages &&
      nextState.index === this.state.index &&
      nextState.page === this.state.page &&
      nextState.mushafFontScale === this.state.mushafFontScale &&
      nextState.assignmentType === this.state.assignmentType &&
      nextProps.assignToID === this.props.assignToID &&
      nextProps.readOnly === this.props.readOnly &&
      nextProps.profileImage === this.props.profileImage &&
      nextProps.showLoadingOnHighlightedAyah ===
        this.props.showLoadingOnHighlightedAyah &&
      _.isEqual(nextProps.selection, this.props.selection) &&
      _.isEqual(nextProps.highlightedWords, this.props.highlightedWords) &&
      _.isEqual(nextProps.highlightedAyahs, this.props.highlightedAyahs) &&
      nextProps.assignmentName === this.props.assignmentName &&
      nextProps.assignmentType === this.props.assignmentType
    ) {
      return false;
    }
    return true;
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      JSON.stringify(prevState.selection) !==
        JSON.stringify(nextProps.selection) &&
      nextProps.selection !== undefined &&
      !isNoSelection(nextProps.selection)
    ) {
      let index =
        nextProps.selection && nextProps.selection.start
          ? 604 - nextProps.selection.start.page
          : 603;

      return {
        selection: nextProps.selection,
        page: nextProps.selection.start ? nextProps.selection.start.page : 1,
        index: index,
        key: index
      };
    }

    return null;
  }

  // ------------------------- Event handlers --------------------------------------------

  onChangePage(page, keepSelection) {
    let index = 604 - page;

    this.setState({
      page: page,
      index: index,
      key: index
    });

    if (this.props.onChangePage) {
      this.props.onChangePage(page, keepSelection);
    }
  }

  // ------------------------ Render the Mushhaf Component ----------------------------------------
  render() {
    const { isLoading, mushafFontScale } = this.state;

    const highlightedWords = Object.assign({}, this.props.highlightedWords);
    const highlightedAyahs = Object.assign({}, this.props.highlightedAyahs);

    if (isLoading === true) {
      return (
        <View
          id={this.state.page + "spinner"}
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <LoadingSpinner isVisible={true} />
        </View>
      );
    } else {
      return (
        <View style={{ flex: 1 }}>
          <Swiper
            index={this.state.index}
            containerStyle={[{ width: screenWidth, height: screenHeight }]}
            key={this.state.key}
            loop={false}
            showsButtons={false}
            loadMinimal={true}
            loadMinimalSize={1}
            showsPagination={false}
            onIndexChanged={index => {
              this.setState({ page: 604 - index });
            }}
          >
            {this.state.pages.map((item, idx) => (
              <MushafPage
                item={item}
                idx={idx}
                page={this.state.page}
                mushafFontScale={mushafFontScale}
                curIndex={604 - this.state.page}
                highlightedWords={highlightedWords}
                highlightedAyahs={highlightedAyahs}
                onChangePage={this.onChangePage.bind(this)}
                isLoading={this.state.isLoading}
                {...this.props}
              />
            ))}
          </Swiper>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {},
  ayahText: {
    padding: 5,
    textAlign: "right",
    fontFamily: "me_quran",
    fontSize: 30,
    color: colors.darkGrey
  }
});
