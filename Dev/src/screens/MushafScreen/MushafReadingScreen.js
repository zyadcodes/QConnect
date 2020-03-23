import React, { Component } from "react";
import PropTypes from "prop-types";
import { View } from "react-native";
import MushafScreen from "./MushafScreen";
import { screenHeight, screenWidth } from "config/dimensions";
import studentImages from "config/studentImages";

const noAyahSelected = {
  surah: 0,
  page: 0,
  ayah: 0
};

const noSelection = {
  start: noAyahSelected,
  end: noAyahSelected,
  started: false,
  completed: false
};

class MushafReadingScreen extends Component {
  state = {
    selection: this.props.navigation.state.params.assignmentLocation
      ? {
          start: this.props.navigation.state.params.assignmentLocation.start,
          end: this.props.navigation.state.params.assignmentLocation.end,
          started: false,
          completed: true
        }
      : noSelection,
  }

  closeScreen() {
    const {
      userID
    } = this.props.navigation.state.params;

    //todo: if we need to generalize this, then we can add a props: onClose, and the caller specifies the onClose behavior with
    // the call to push navigation to the proper next screen.
    this.props.navigation.push("StudentCurrentClass", {
      userID
    });
  }

  onSelectAyah(selectedAyah){
    //todo: implement audio playback
  }

  render() {
    const {
      userID,
      assignmentName,
      assignmentLocation,
      assignmentType,
      currentClass,
      studentID,
      classID,
      imageID,
    } = this.props.navigation.state.params;

    const {selection} = this.state;

   

    return (
      <View style={{ width: screenWidth, height: screenHeight }}>
        <MushafScreen
          assignToID={studentID}
          classID={classID}
          profileImage={studentImages.images[imageID]}
          selection={selection}
          assignmentName={assignmentName}
          assignmentLocation={assignmentLocation}
          assignmentType={assignmentType}
          topRightIconName="close"
          topRightOnPress={this.closeScreen.bind(this)}
          onClose={this.closeScreen.bind(this)}
          currentClass={currentClass}
          onSelectAyah={this.onSelectAyah.bind(this)}
          disableChangingUser={true}
        />
      </View>
    );
  }
}

export default MushafReadingScreen;
