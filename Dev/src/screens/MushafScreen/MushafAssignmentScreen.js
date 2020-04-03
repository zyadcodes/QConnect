import React, { Component } from "react";
import { View, Text } from "react-native";
import MushafScreen from "./MushafScreen";
import { screenHeight, screenWidth } from "config/dimensions";
import FirebaseFunctions from "config/FirebaseFunctions";
import QcActionButton from "components/QcActionButton";
import strings from "config/strings";
import { ScrollView } from "react-native-gesture-handler";
import surahs from "./Data/Surahs.json";
import { compareOrder } from "./Helpers/AyahsOrder";
import colors from "config/colors";
import SwitchSelector from "react-native-switch-selector";
import fontStyles from "config/fontStyles";
import studentImages from "config/studentImages";
import classImages from "config/classImages";
import LoadingSpinner from "components/LoadingSpinner";

//------- constants to indicate the case when there is no ayah selected
const noAyahSelected = {
  surah: 0,
  page: 0,
  ayah: 0,
  length: 0
};

const noSelection = {
  start: noAyahSelected,
  end: noAyahSelected,
  started: false,
  completed: false
};

class MushafAssignmentScreen extends Component {
  //=================== Initialize Component ============================
  state = {
    userID: this.props.navigation.state.params.userID,
    imageID: this.props.navigation.state.params.imageID,
    assignToAllClass:
      this.props.navigation.state.params.assignToAllClass !== undefined
        ? this.props.navigation.state.params.assignToAllClass
        : true, //default to true if no param is passed
    studentID: this.props.navigation.state.params.studentID,
    classID: this.props.navigation.state.params.classID,
    assignmentName: this.props.navigation.state.params.assignmentName,
    assignmentType: this.props.navigation.state.params.assignmentType
      ? this.props.navigation.state.params.assignmentType
      : strings.Memorization,
    assignmentLocation: this.props.navigation.state.params.assignmentLocation,
    currentClass: this.props.navigation.state.params.currentClass,
    assignmentIndex: this.props.navigation.state.params.assignmentIndex,
    isTeacher:
      this.props.navigation.state.params.isTeacher !== undefined
        ? this.props.navigation.state.params.isTeacher
        : true, //default to true if not passed in
    selection: this.props.navigation.state.params.assignmentLocation
      ? {
          start: this.props.navigation.state.params.assignmentLocation.start,
          end: this.props.navigation.state.params.assignmentLocation.end,
          length: this.props.navigation.state.params.assignmentLocation.length,
          started: false,
          completed: true
        }
      : noSelection,
    freeFormAssignment: false,
    isLoading: true
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
    let { isTeacher, classID, userID, assignmentLocation } = this.state;
    if (
      classID === undefined &&
      isTeacher === true //if isTeacher is not passed, we default to true
    ) {
      const teacher = await FirebaseFunctions.getTeacherByID(userID);
      const { currentClassID } = teacher;
      const currentClassInfo = await FirebaseFunctions.getClassByID(
        currentClassID
      );

      if (!assignmentLocation) {
        if (
          currentClassInfo.currentAssignments !== undefined &&
          currentClassInfo.currentAssignments.length > 0
        ) {
          assignmentLocation = currentClassInfo.currentAssignments[0].location;
        } else {
          //todo: eventually get rid of old schema.. backward compatibility is temporary only
          assignmentLocation = currentClassInfo.currentAssignmentLocation;
        }
      }

      this.setState(
        {
          classID: currentClassID,
          assignToAllClass: true,
          imageID: currentClassInfo.classImageID,
          currentClass: currentClassInfo,
          selection: assignmentLocation
            ? {
                start: assignmentLocation.start,
                end: assignmentLocation.end,
                length: assignmentLocation.length,
                started: false,
                completed: true
              }
            : noSelection
        },
        () => {}
      );
    }

    this.setState({ isLoading: false });
  }

  //======== end of Initialize Component ========================

  //======== action methods to handle user interation actions ===
  closeScreen() {
    const {
      popOnClose,
      loadScreenOnClose,
      userID,
      assignmentIndex
    } = this.props.navigation.state.params;

    const {
      assignmentName,
      assignmentType,
      selection,
      currentClass
    } = this.state;

    const { started, completed, ...location } = selection;

    let assignment = {
      name: assignmentName,
      type: assignmentType,
      location,
      isReadyEnum: "NOT_STARTED"
    };

    //go back to student profile screen if invoked from there, otherwise go back to main screen
    if (popOnClose === true) {
      if (assignment && assignment.name && assignment.name.trim().length > 0) {
        //update the caller screen with the new assignment then close
        this.props.navigation.state.params.onSaveAssignment(
          assignment,
          assignmentIndex,
          currentClass
        );
      }
      this.props.navigation.pop();
    } else {
      let screenName =
        loadScreenOnClose !== undefined
          ? loadScreenOnClose
          : "TeacherCurrentClass";
      this.props.navigation.push(screenName, {
        userID,
        currentClass
      });
    }
  }

  //======= end of UI action handlers ==========================

  //======= methods handling assignment changes ================

  onSaveAssignment(
    classID,
    studentID,
    assignmentName,
    assignmentType,
    selection,
    classInfoParam
  ) {
    const { assignmentIndex } = this.props.navigation.state.params;
    const { assignToAllClass } = this.state;
    const closeAfterSave = true;

    if (assignmentName && assignmentName.trim() === "") {
      Alert.alert(strings.Whoops, strings.PleaseEnterAnAssignmentName);
    } else {
      if (assignToAllClass) {
        this.saveClassAssignment(
          assignmentName,
          classID,
          assignmentType,
          classInfoParam,
          selection,
          assignmentIndex,
          closeAfterSave
        );
      } else {
        const isNewAssignment =
          this.props.navigation.state.params.newAssignment === true ||
          assignmentIndex === undefined;
        this.saveStudentAssignment(
          isNewAssignment,
          assignmentName,
          classID,
          studentID,
          assignmentType,
          selection,
          classInfoParam,
          assignmentIndex,
          closeAfterSave
        );
      }
    }
  }

  async saveClassAssignment(
    newAssignmentName,
    classID,
    assignmentType,
    currentClass,
    selection,
    assignmentIndex,
    closeAfterSave
  ) {
    let assignmentLocation = {
      start: selection.start,
      end: selection.end,
      length: selection.end.wordNum - selection.start.wordNum + 1
    };

    await FirebaseFunctions.updateClassAssignment(
      classID,
      newAssignmentName,
      assignmentType,
      assignmentLocation,
      assignmentIndex
    );

    //since there might be a latency before firebase returns the updated assignments,
    //let's save them here and later pass them to the calling screen so that it can update its state without
    //relying on the Firebase async latency
    let students = currentClass.students.map(student => {
      //if currentAssignments is null/undefined, we will create an array of 1 assignment and plug in the value
      let currentAssignments = [
        {
          name: newAssignmentName,
          type: assignmentType,
          location: assignmentLocation,
          isReadyEnum: "NOT_STARTED"
        }
      ];

      return { ...student, currentAssignments };
    });

    let updatedClass = {
      ...currentClass,
      students
    };

    this.setState(
      {
        currentClass: updatedClass
      },
      () => {
        if (closeAfterSave) {
          this.closeScreen();
        }
      }
    );
  }

  //method updates the current assignment of the student
  saveStudentAssignment(
    isNewAssignment,
    newAssignmentName,
    classID,
    studentID,
    assignmentType,
    selection,
    currentClass,
    assignmentIndex,
    closeAfterSave //boolean: whether or not to close the screen after saving the info
  ) {
    let assignmentLocation = {
      start: selection.start,
      end: selection.end,
      length: selection.end.wordNum - selection.start.wordNum + 1
    };

    //update the current class object (so we can pass it to caller without having to re-render from firebase)
    let students = currentClass.students.map(student => {
      if (student.ID === studentID) {
        if (isNewAssignment === true) {
          student.currentAssignments.push({
            name: newAssignmentName,
            type: assignmentType,
            location: assignmentLocation,
            isReadyEnum: 'NOT_STARTED'
          });
        } else {
          const index = student.currentAssignments.findIndex(element => {
            return (
              element.name ===
                this.props.navigation.state.params.assignmentName &&
              element.type === this.props.navigation.state.params.assignmentType
            );
          });
          student.currentAssignments[index] = {
            name: newAssignmentName,
            type: assignmentType,
            location: assignmentLocation,
            isReadyEnum: 'NOT_STARTED'
          };
        }
      }
      return student;
    });

    let updatedClass = {
      ...currentClass,
      students
    };

    FirebaseFunctions.updateClassObject(updatedClass.ID, updatedClass);

    this.setState(
      {
        currentClass: updatedClass
      },
      () => {
        if (closeAfterSave) {
          this.closeScreen();
        }
      }
    );
  }

  updateAssignmentName() {
    const { selection } = this.state;
    if (selection.start.surah === 0) {
      //no selection made
      //todo: make this an explicit flag
      return "";
    }

    let desc =
      surahs[selection.start.surah].tname + " (" + selection.start.ayah;

    if (selection.start.surah === selection.end.surah) {
      if (selection.start.ayah !== selection.end.ayah) {
        desc += strings.To + selection.end.ayah;
      }
    } else {
      desc +=
        ")" +
        strings.To +
        surahs[selection.end.surah].tname +
        " (" +
        selection.end.ayah;
    }

    let pageDesc = strings.ParenthesisPage + selection.end.page;
    if (selection.start.page !== selection.end.page) {
      pageDesc =
        strings.PagesWithParenthesis +
        selection.start.page +
        strings.To +
        selection.end.page;
    }
    desc += pageDesc;

    this.setState({
      assignmentName: desc,
      freeFormAssignment: false
    });
  }

  //this is to update the assignment text without mapping it to a location in the mus7af
  // this is to allow teachers to enter free form assignemnts
  // for example: redo your last 3 assignments
  setFreeFormAssignmentName(freeFormAssignmentName) {
    this.setState({
      assignmentName: freeFormAssignmentName,
      freeFormAssignment: true
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
        imageID: imageID
      });
    } else {
      this.setState({
        studentID: id,
        assignToAllClass: false,
        imageID: imageID
      });
    }
  }

  //==================== end of assignment methods =================================

  //======== selection changes methods: which verses are selected in the page ======
  onSelectAyah(selectedAyah) {
    const { selection } = this.state;

    //if the user taps on the same selected aya again, turn off selection
    if (
      compareOrder(selection.start, selection.end) === 0 &&
      compareOrder(selection.start, selectedAyah) === 0
    ) {
      this.setState({ selection: noSelection }, () =>
        this.updateAssignmentName()
      );
    } else if (!selection.started) {
      this.setState(
        {
          selection: {
            started: true,
            completed: false,
            start: selectedAyah,
            end: selectedAyah,
            length: 10 //todo: need to capture actual length of ayah
          }
        },
        () => this.updateAssignmentName()
      );
    } else if (!selection.completed) {
      this.setState(
        {
          selection: {
            ...this.state.selection,
            started: false,
            completed: true
          }
        },
        () => {
          //Set the smallest number as the start, and the larger as the end
          if (compareOrder(selection.start, selectedAyah) > 0) {
            this.setState(
              {
                selection: {
                  ...this.state.selection,
                  end: selectedAyah,
                  length:
                    selectedAyah.wordNum -
                    this.state.selection.start.wordNum +
                    1,
                },
              },
              () => this.updateAssignmentName()
            );
          } else {
            this.setState(
              {
                selection: {
                  ...this.state.selection,
                  start: selectedAyah,
                  length:
                    this.state.selection.end.wordNum - selectedAyah.wordNum + 1,
                },
              },
              () => this.updateAssignmentName()
            );
          }
        }
      );
    }
  }

  // ---- selects a range of ayahs   -----
  onSelectAyahs(firstAyah, lastAyah) {
    let startA = firstAyah;
    let endA = lastAyah;

    //Set the smallest number as the start, and the larger as the end
    if (compareOrder(firstAyah, lastAyah) <= 0) {
      startA = lastAyah;
      endA = firstAyah;
    }

    this.setState(
      prevState => {
        return {
          selection: {
            ...prevState.selection,
            start: startA
          }
        };
      },
      () =>
        this.setState(
          prevState2 => {
            return {
              selection: {
                ...prevState2.selection,
                started: false,
                completed: true,
                end: endA,
                length: endA.wordNum - prevState2.selection.start.wordNum + 1
              }
            };
          },
          () => this.updateAssignmentName()
        )
    );
  }

  onChangePage(page, keepSelection) {
    //reset the selection state if we are passed a flag to do so
    if (keepSelection === false) {
      this.setState({ selection: noSelection });
    }
  }

  //============= end of selection methods =============================

  //============ render method: UI entry point for this component ===
  render() {
    const {
      userID,
      studentID,
      assignmentName,
      assignmentType,
      currentClass,
      selection,
      classID,
      imageID,
      assignToAllClass
    } = this.state;

    const options = [
      { label: strings.Memorization, value: strings.Memorization },
      { label: strings.Revision, value: strings.Revision },
      { label: strings.Reading, value: strings.Reading }
    ];
    let selectedAssignmentTypeIndex = 0;
    if (assignmentType !== undefined) {
      if (options.findIndex(option => option.value === assignmentType) !== -1) {
        selectedAssignmentTypeIndex = options.findIndex(
          option => option.value === assignmentType
        );
      }
    }

    let profileImage = isNaN(imageID)
      ? undefined
      : assignToAllClass
      ? classImages.images[imageID]
      : studentImages.images[imageID];

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
        <ScrollView
          containerStyle={{ width: screenWidth, height: screenHeight - 150 }}
        >
          <MushafScreen
            {...this.props}
            userID={userID}
            assignToID={assignToAllClass ? classID : studentID}
            classID={classID}
            profileImage={profileImage}
            assignmentName={assignmentName}
            selection={selection}
            assignmentType={assignmentType}
            currentClass={currentClass}
            onSelectAyah={this.onSelectAyah.bind(this)}
            onSelectAyahs={this.onSelectAyahs.bind(this)}
            onChangeAssignee={this.onChangeAssignee.bind(this)}
            setFreeFormAssignmentName={this.setFreeFormAssignmentName.bind(
              this
            )}
          />
          <View style={{ padding: 5 }}>
            {this.state.selection.start.surah > 0 ||
            this.state.freeFormAssignment ? (
              <Text style={fontStyles.mainTextStyleDarkGrey}>
                {assignmentName}
              </Text>
            ) : (
              <View />
            )}
          </View>
          <SwitchSelector
            options={options}
            initial={selectedAssignmentTypeIndex}
            height={20}
            textColor={colors.darkGrey}
            selectedColor={colors.primaryDark}
            buttonColor={colors.primaryLight}
            borderColor={colors.lightGrey}
            onPress={value => this.setState({ assignmentType: value })}
            style={{ marginTop: 2 }}
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
                this.onSaveAssignment(
                  classID,
                  studentID,
                  assignmentName,
                  assignmentType,
                  selection,
                  currentClass
                );
              }}
            />
            <QcActionButton
              text={strings.Cancel}
              onPress={() => this.closeScreen()}
            />
          </View>
        </ScrollView>
      );
    }
  }
}

export default MushafAssignmentScreen;
