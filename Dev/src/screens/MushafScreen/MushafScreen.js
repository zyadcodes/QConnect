//Screen which will provide all of the possible settings for the user to click on
import React from "react";
import { View, StyleSheet, Alert, ScrollView } from "react-native";
import LoadingSpinner from "components/LoadingSpinner";
import colors from "config/colors";
import QcParentScreen from 'screens/QcParentScreen';
import SelectionPage from "./Components/SelectionPage";
import Swiper from "react-native-swiper";
import strings from "config/strings";
import FirebaseFunctions from "config/FirebaseFunctions";
import studentImages from "config/studentImages";
import classImages from 'config/classImages';
import { screenHeight, screenWidth } from "config/dimensions";

//------- constants to indicate the case when there is no ayah selected
const noAyahSelected = {
  surah: 0,
  page: 0,
  ayah: 0,
};

const noSelection = {
  start: noAyahSelected,
  end: noAyahSelected,
  started: false,
  completed: false,
};

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
    index: 3,
    classID: this.props,
    studentID: this.props.studentID,
    imageID: this.props.imageID,
    assignToAllClass: this.props.assignToAllClass,
    selection: {
      started: false,
      completed: false,
      start: {
        surah: 0,
        page: this.lastPage,
        ayah: 0,
      },
      end: {
        surah: 0,
        page: this.lastPage,
        ayah: 0,
      },
    },
    assignmentType: this.props.assignmentType,
    loadScreenOnClose: this.props.loadScreenOnClose,
    popOnClose: this.props.popOnClose,
    isLoading: true,
  };

  async componentDidMount() {
    const {
      studentID,
      assignmentType,
      assignmentLocation,
      assignmentName,
      currentClass,
      userID,
      classID,
    } = this.props;

    //we mimmic right to left pages scanning by reversing the pages order in the swiper component
    allPages = Array.from(Array(604), (e, i) => 604 - i);

    if (studentID === undefined) {
      //assign to all class -----
      this.setState(
        {
          pages: allPages,
          selection: {
            start: currentClass.currentAssignmentLocation
              ? currentClass.currentAssignmentLocation.start
              : noAyahSelected,
            end: currentClass.currentAssignmentLocation
              ? currentClass.currentAssignmentLocation.end
              : noAyahSelected,
            started: false,
            completed: currentClass.currentAssignmentLocation ? true : false
          },
          assignToAllClass: true,
          userID,
          imageID: currentClass.classImageID,
          classID,
          currentClass: currentClass,
          assignmentType: currentClass.currentAssignmentType,
        },
        () => {
          if (currentClass.currentAssignmentLocation !== undefined) {
            let newPage = currentClass.currentAssignmentLocation.start.page;
            this.onChangePage(newPage, true);
          }
          this.setState({ isLoading: false });
        }
      );
    } else {
      // assign to a particular student ----------
      let indexSection = {};
      if (assignmentLocation !== undefined) {
        indexSection = {
          index: 604 - assignmentLocation.start.page,
        };
      }

      this.setState({
        ...indexSection,
        pages: allPages,
        isLoading: false,
        assignToAllClass: false,
        currentClass: currentClass,
        studentID: studentID,
        selection: assignmentLocation
          ? {
              start: assignmentLocation.start,
              end: assignmentLocation.end,
              started: false,
              completed: true,
            }
          : noSelection,
        assignmentType:
          assignmentType !== undefined ? assignmentType : strings.Memorization
      });
    }
  }

  // ------------------------- Helpers and Getters  --------------------------------------
  getPagesToLoad(page) {
    let pageNumber = parseInt(page);
    let nextPage1 = parseInt(pageNumber) + 1;
    let nextPage2 = parseInt(pageNumber) + 2;
    let nextPage3 = parseInt(pageNumber) + 3;
    let curPage = parseInt(pageNumber);
    let prevPage1 = parseInt(pageNumber) - 1;
    let prevPage2 = parseInt(pageNumber) - 2;
    let prevPage3 = parseInt(pageNumber) - 3;
    let index = 3;

    //if we are in the first page, change render page 1, 2, and 3, and set current page to index 0 (page 1)
    //this way, users can't swipe left to previous page since there is no previous page
    if (pageNumber === 1) {
      //bug bug: there is a bug in swiper where if I set index to 0 (to indicate end of book),
      // onIndexChanged is not called on the next swipe.
      // this is a temporary workaround until swiper bug is fixed or we find a better workaround.
      prevPage1 = pageNumber;
      prevPage2 = pageNumber;
      prevPage3 = pageNumber;
      curPage = pageNumber;
      index = 3;
    }
    //if we are in the last page, change render page 602, 603, and 604, and set current page to index 2 (page 604)
    //this way, users can't swipe right to next page, since there is no next page
    else if (pageNumber === 604) {
      //bug bug: there is a bug in swiper where if I set index to 0 (to indicate end of book),
      // onIndexChanged is not called on the next swipe.
      // this is a temporary workaround until swiper bug is fixed or we find a better workaround.
      curPage = pageNumber;
      nextPage1 = pageNumber;
      nextPage2 = pageNumber;
      nextPage3 = pageNumber;
      index = 3;
    }

    return {
      pages: [
        nextPage3.toString(),
        nextPage2.toString(),
        nextPage1.toString(),
        curPage.toString(),
        prevPage1.toString(),
        prevPage2.toString(),
        prevPage3.toString()
      ],
      index: index
    };
  }

  // ------------------------- Event handlers --------------------------------------------

  onChangePage(page, keepSelection) {
    //reset the selection state if we are passed a flag to do so
    let resetSelectionIfApplicable = {};
    if (keepSelection === false) {
      resetSelectionIfApplicable = {
        selection: noSelection
      };
    }

    let index = 604 - page;
    this.setState({
      ...resetSelectionIfApplicable,
      page: page,
      index: index,
      key: index,
    });
  }

  /**
     * studentID: this.props.studentID,
        classID: this.props.classID,
        assignToAllClass: this.props.assignToAllClass,
     */
  onChangeAssignee(id, imageID, isClassID) {
    if (isClassID === true) {
      this.setState({
        classID: id,
        assignToAllClass: true,
        imageID: imageID,
      });
    } else {
      this.setState({
        studentID: id,
        assignToAllClass: false,
        imageID: imageID,
      });
    }
  }

  // ------------------------ Render the Mushhaf Component ----------------------------------------
  renderItem(item, idx) {
    const {
      imageID,
      assignToAllClass,
      assignmentType,
      selection,
      classID,
      studentID
    } = this.state;

    const itemInt = parseInt(item);
    profileImage = isNaN(imageID)
      ? undefined
      : assignToAllClass
      ? classImages.images[imageID]
      : studentImages.images[imageID];

    return (
      <View style={{ width: screenWidth, height: screenHeight }} key={idx}>
        <SelectionPage
          page={itemInt}
          onChangePage={this.onChangePage.bind(this)}
          selectedAyahsStart={selection.start}
          selectedAyahsEnd={selection.end}
          selectionStarted={selection.started}
          selectionCompleted={selection.completed}
          selectionOn={
            itemInt >= selection.start.page && itemInt <= selection.end.page
          }
          profileImage={profileImage}
          currentClass={this.state.currentClass}
          isLoading={this.state.isLoading}
          assignmentType={assignmentType}
          assignToID={assignToAllClass ? classID : studentID}
          onChangeAssignee={(id, imageID, isClassID) =>
            this.onChangeAssignee(id, imageID, isClassID)
          }
          //callback when user taps on a single ayah to selects
          //determines whether this would be the start of end of the selection
          // and select ayahs in between
          onSelectAyah={selectedAyah => this.props.onSelectAyah(selectedAyah)}
          //callback when user selects a range of ayahs (line an entire page or surah)
          onSelectAyahs={(firstAyah, lastAyah) =>
            this.props.onSelectAyahs(firstAyah, lastAyah)
          }
          topRightIconName={this.props.topRightIconName}
          topRightOnPress={this.props.topRightOnPress}
          onUpdateAssignmentName={newAssignmentName =>
            this.props.setFreeFormAssignmentName(newAssignmentName)
          }
        />
      </View>
    );
  }

  render() {
    const { isLoading } = this.state;

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
        <View style={{ width: screenWidth, height: screenHeight }}>
          <ScrollView
            style={{ width: screenWidth, height: screenHeight * 0.95 }}
          >
            <Swiper
              index={this.state.index}
              containerStyle={{ width: screenWidth, height: screenHeight }}
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
              {this.state.pages.map((item, idx) => this.renderItem(item, idx))}
            </Swiper>
          </ScrollView>
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
    color: colors.darkGrey,
  },
});
