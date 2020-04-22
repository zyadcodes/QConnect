//Screen which will provide all of the possible settings for the user to click on
import React from "react";
import { View, StyleSheet, ScrollView, PixelRatio } from "react-native";
import LoadingSpinner from "components/LoadingSpinner";
import colors from "config/colors";
import QcParentScreen from 'screens/QcParentScreen';
import SelectionPage from "./Components/SelectionPage";
import Swiper from "react-native-swiper";
import { screenHeight, screenWidth } from "config/dimensions";

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
    index:
      this.props.selection && this.props.selection.start
        ? 604 - this.props.selection.start.page
        : 3,
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

    this.setState({
      pages: allPages,
      isLoading: false,
    });
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      JSON.stringify(prevState.selection) !==
      JSON.stringify(nextProps.selection)
    ) {
      let index =
        nextProps.selection && nextProps.selection.start
          ? 604 - nextProps.selection.start.page
          : 3;

      return {
        selection: nextProps.selection,
        page: nextProps.selection.start ? nextProps.selection.start.page : 3,
        index: index,
        key: index,
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
      key: index,
    });

    if (this.props.onChangePage) {
      this.props.onChangePage(page, keepSelection);
    }
  }

  // ------------------------ Render the Mushhaf Component ----------------------------------------
  renderItem(item, idx) {
    const { assignmentType } = this.state;
    const {
      profileImage,
      assignToID,
      selection,
      disableChangingUser,
    } = this.props;

    const itemInt = parseInt(item);

    return (
      <View style={{ flex: 1 }} key={idx}>
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
          currentClass={this.props.currentClass}
          isLoading={this.state.isLoading}
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
            {this.state.pages.map((item, idx) => this.renderItem(item, idx))}
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
    color: colors.darkGrey,
  },
});
