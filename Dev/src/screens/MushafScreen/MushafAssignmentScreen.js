import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import MushafScreen from './MushafScreen';
import { screenHeight, screenWidth } from 'config/dimensions';

class MushafAssignmentScreen extends Component {
  closeScreen(assignmentName, currentClass) {
    const {
      popOnClose,
      loadScreenOnClose,
      userID,
    } = this.props.navigation.state.params;

    //go back to student profile screen if invoked from there, otherwise go back to main screen
    if (popOnClose === true) {
      if (assignmentName && assignmentName.trim().length > 0) {
        //update the caller screen with the new assignment then close
        this.props.navigation.state.params.onSaveAssignment(assignmentName);
      }
      this.props.navigation.pop();
    } else {
      let screenName =
        loadScreenOnClose !== undefined
          ? loadScreenOnClose
          : 'TeacherCurrentClass';
      this.props.navigation.push(screenName, {
        userID,
        currentClass,
      });
    }
  }

  render() {
    return (
      <View style={{ width: screenWidth, height: screenHeight }}>
        <MushafScreen {...this.props} onClose={this.closeScreen.bind(this)} />
      </View>
    );
  }
}

export default MushafAssignmentScreen;
