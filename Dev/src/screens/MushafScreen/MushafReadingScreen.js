import React, { Component } from "react";
import PropTypes from "prop-types";
import { View } from "react-native";
import MushafScreen from "./MushafScreen";
import { screenHeight, screenWidth } from "config/dimensions";

class MushafReadingScreen extends Component {
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
    alert(JSON.stringify(selectedAyah))
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
    } = this.props.navigation.state.params;

    return (
      <View style={{ width: screenWidth, height: screenHeight }}>
        <MushafScreen
          userID={userID}
          studentID={studentID}
          classID={classID}
          assignmentName={assignmentName}
          assignmentLocation={assignmentLocation}
          assignmentType={assignmentType}
          topRightIconName="close"
          topRightOnPress={this.closeScreen.bind(this)}
          onClose={this.closeScreen.bind(this)}
          currentClass={currentClass}
          onSelectAyah={this.onSelectAyah.bind(this)}
        />
      </View>
    );
  }
}

export default MushafReadingScreen;
