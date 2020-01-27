import React, { Component } from 'react';
import { View } from 'react-native';
import MushafScreen from './MushafScreen';
import { screenHeight, screenWidth } from 'config/dimensions';
import FirebaseFunctions from 'config/FirebaseFunctions';
import QcActionButton from 'components/QcActionButton'
import strings from "config/strings";
import { ScrollView } from 'react-native-gesture-handler';

class MushafAssignmentScreen extends Component {
  //=================== Initialize Component ============================
  state = {
    userID: this.props.navigation.state.params.userID,
    studentID: this.props.navigation.state.params.studentID,
    classID: this.props.navigation.state.params.classID,
    assignmentName: this.props.navigation.state.params.assignmentName,
    assignmentType: this.props.navigation.state.params.assignmentType,
    assignmentLocation: this.props.navigation.state.params.assignmentLocation,
    currentClass: this.props.navigation.state.params.currentClass,
    isTeacher: this.props.navigation.state.params.isTeacher
  };

  async componentDidMount() {
    FirebaseFunctions.setCurrentScreen(
      "MushhafAssignmentScreen",
      "MushhafAssignmentScreen"
    );

    //getClassInfoFromDbIfNotPassedIn
    await this.getClassInfoFromDbIfNotPassedIn();
  }

  async getClassInfoFromDbIfNotPassedIn() {
    let { isTeacher, classID, currentClass, userID } = this.state;
    if (classID === undefined && currentClass !== undefined) {
      this.setState({ classID: currentClass.ID });
    } else if (
      classID === undefined &&
      currentClass === undefined &&
      isTeacher === true
    ) {
      const teacher = await FirebaseFunctions.getTeacherByID(userID);
      const { currentClassID } = teacher;
      const currentClassInfo = await FirebaseFunctions.getClassByID(
        currentClassID
      );
      this.setState({
        classID: currentClassID,
        currentClass: currentClassInfo
      });
    }
  }

  //======== end of Initialize Component ========================

  //======== action methods to handle user interation actions ===
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

  onSaveAssignment(
    classID,
    studentID,
    assignmentName,
    assignmentType,
    selection,
    classInfoParam
  ) {
    const { assignToAllClass } = this.props.navigation.state.params;

    if (assignmentName.trim() === "") {
      Alert.alert(strings.Whoops, strings.PleaseEnterAnAssignmentName);
    } else {
      if (assignToAllClass) {
        this.saveClassAssignment(
          assignmentName,
          classID,
          assignmentType,
          classInfoParam,
          selection
        );
      } else {
        this.saveStudentAssignment(
          assignmentName,
          classID,
          studentID,
          assignmentType,
          selection,
          classInfoParam
        );
      }

      this.props.onClose(assignmentName, this.state.currentClass);
    }
  }

  async saveClassAssignment(
    newAssignmentName,
    classID,
    assignmentType,
    currentClass,
    selection
  ) {
    let assignmentLocation = { start: selection.start, end: selection.end };

    await FirebaseFunctions.updateClassAssignment(
      classID,
      newAssignmentName,
      assignmentType,
      assignmentLocation
    );

    //since there might be a latency before firebase returns the updated assignments,
    //let's save them here and later pass them to the calling screen so that it can update its state without
    //relying on the Firebase async latency
    let students = currentClass.students.map(student => {
      student.currentAssignment = newAssignmentName;
      student.assignmentLocation = assignmentLocation;
    });
    let updatedClass = {
      ...currentClass,
      students
    };

    this.setState({
      currentClass: updatedClass
    });
  }

  //method updates the current assignment of the student
  saveStudentAssignment(
    newAssignmentName,
    classID,
    studentID,
    assignmentType,
    selection,
    currentClass
  ) {
    let assignmentLocation = { start: selection.start, end: selection.end };

    //update the current class object (so we can pass it to caller without having to re-render from firebase)
    let students = currentClass.students.map(student => {
      if (student.ID === studentID) {
        student.currentAssignment = newAssignmentName;
        student.assignmentLocation = assignmentLocation;
      }
      return student;
    });

    let updatedClass = {
      ...currentClass,
      students
    };

    this.setState({
      currentClass: updatedClass
    });

    FirebaseFunctions.updateStudentCurrentAssignment(
      classID,
      studentID,
      newAssignmentName,
      assignmentType,
      assignmentLocation
    );
  }

  //============= end of action methods =============================

  //============ render method: UI entry point for this component ===
  render() {
    const {
      userID,
      assignmentName,
      assignmentLocation,
      assignmentType,
      currentClass,
      classID,
    } = this.state;

    return (
      <ScrollView containerStyle={{ width: screenWidth, height: screenHeight }}>
        <MushafScreen
          {...this.props}
          userID={userID}
          classID={classID}
          assignmentName={assignmentName}
          assignmentLocation={assignmentLocation}
          assignmentType={assignmentType}
          onClose={this.closeScreen.bind(this)}
          currentClass={currentClass}
        />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginBottom: 15
          }}
        >
          <QcActionButton
            text={strings.Save}
            onPress={() => {
              this.onSaveAssignment();
            }}
          />
          <QcActionButton
            text={strings.Cancel}
            onPress={() => this.closeScreen(assignmentName, currentClass)}
          />
          </View>
        </ScrollView>
    );
  }
}

export default MushafAssignmentScreen;
