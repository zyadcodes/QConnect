import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MushafScreen from './MushafScreen';
import { screenHeight, screenWidth } from 'config/dimensions';
import FirebaseFunctions from 'config/FirebaseFunctions';
import QcActionButton from 'components/QcActionButton';
import strings from 'config/strings';
import { ScrollView } from 'react-native-gesture-handler';
import surahs from './Data/Surahs.json';
import { compareOrder } from './Helpers/AyahsOrder';
import colors from 'config/colors';
import SwitchSelector from 'react-native-switch-selector';
import fontStyles from 'config/fontStyles';
import studentImages from 'config/studentImages';
import classImages from 'config/classImages';
import LoadingSpinner from 'components/LoadingSpinner';
import ActionButton from "react-native-action-button";
import { Icon } from "react-native-elements";

//------- constants to indicate the case when there is no ayah selected
const noAyahSelected = {
  surah: 0,
  page: 0,
  ayah: 0,
  length: 0,
};

const noSelection = {
  start: noAyahSelected,
  end: noAyahSelected,
  started: false,
  completed: false,
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
    isNewAssignment: this.props.navigation.state.params.newAssignment === true,
    isLoading: true
  };

  async componentDidMount() {
    FirebaseFunctions.setCurrentScreen(
      'MushhafAssignmentScreen',
      'MushhafAssignmentScreen'
    );

    //getClassInfoFromDbIfNotPassedIn
    await this.getClassInfoFromDbIfNotPassedIn();
  }

  async getClassInfoFromDbIfNotPassedIn() {
    let {
      isTeacher,
      classID,
      userID,
      assignmentLocation,
      assignmentType
    } = this.state;
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
          assignmentType = currentClassInfo.currentAssignments[0].type;
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
          assignmentType,
          isNewAssignment:
            assignmentLocation === undefined ||
            this.props.navigation.state.params.newAssignment === true,
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
      isReadyEnum: 'NOT_STARTED'
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
          : 'TeacherCurrentClass';
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
    const { assignToAllClass, isNewAssignment } = this.state;
    const closeAfterSave = true;

    if (assignmentName && assignmentName.trim() === '') {
      Alert.alert(strings.Whoops, strings.PleaseEnterAnAssignmentName);
    } else {
      if (assignToAllClass) {
        this.saveClassAssignment(
          isNewAssignment,
          assignmentName,
          classID,
          assignmentType,
          classInfoParam,
          selection,
          assignmentIndex,
          closeAfterSave
        );
      } else {
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
    isNewAssignment,
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
      assignmentIndex,
      isNewAssignment
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
          isReadyEnum: 'NOT_STARTED'
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
      return '';
    }

    let desc =
      surahs[selection.start.surah].tname + ' (' + selection.start.ayah;

    if (selection.start.surah === selection.end.surah) {
      if (selection.start.ayah !== selection.end.ayah) {
        desc += strings.To + selection.end.ayah;
      }
    } else {
      desc +=
        ')' +
        strings.To +
        surahs[selection.end.surah].tname +
        ' (' +
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
      //check if the student has the current assignment already
      let isNewAssignment = this.state.isNewAssignment;

      //if the student doesn't have the assignment that was marked on the page,
      // treat this as if the teacher wants to assign a new assignment
      if (!this.studentHasCurrentAssignment(id)) {
        isNewAssignment = true;
      }
      this.setState({
        studentID: id,
        assignToAllClass: false,
        imageID: imageID,
        isNewAssignment
      });
    }
  }

  studentHasCurrentAssignment(studentID) {
    if (!this.state.currentClass || !this.state.currentClass.students) {
      return false;
    }

    let student = this.state.currentClass.students.find(
      student => student.ID === studentID
    );

    if (student === undefined || student.currentAssignments === undefined) {
      return false;
    }

    return (
      student.currentAssignments.find(
        assignment => assignment.name === this.state.assignmentName
      ) !== undefined
    );
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
                    1
                }
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
                    this.state.selection.end.wordNum - selectedAyah.wordNum + 1
                }
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

  getActionItems() {
    const {
      studentID,
      currentClass,
      assignToAllClass,
      assignmentName,
      assignmentIndex,
      assignmentLocation,
      selection,
      assignmentType,
      classID,
      userID
    } = this.state;

    let actionItemConfig = [];
    actionItemConfig[strings.Memorization] = {
      color: colors.darkestGrey,
      iconName: 'open-book',
      iconType: 'entypo'
    };

    actionItemConfig[strings.Reading] = {
      color: colors.magenta,
      iconName: 'book-open',
      iconType: 'feather'
    };

    actionItemConfig[strings.Revision] = {
      color: colors.blue,
      iconName: 'reminder',
      iconType: 'material-community'
    };

    let res = [];
    //If this is a particular student, show their other assignments
    // to allow teacher to switch to them.
    // this is not supported for all-class assignment
    if (!assignToAllClass) {
      //allAssignments will hold the list of the other assignments
      // if the screen has class assignment, then AllAssignments will have the rest of class assignments
      // if it shows assignments of a particular student, then AllAssignments will show rest of that student assignments
      let allAssignments = [];
      try {
        allAssignments = currentClass.students.find(
          student => student.ID === studentID
        ).currentAssignments;
      } catch (err) {
        FirebaseFunctions.logEvent(
          'EXCEPTION_CURRENT_ASSIGNMENTS_FROM_MUSHAF_SCREEN',
          { err }
        );
      }

      res = allAssignments.map((assignment, c) => {
        if (c !== assignmentIndex) {
          return (
            <ActionButton.Item
              key={"goto_" + c}
              buttonColor={actionItemConfig[assignment.type].color}
              title={assignment.type + ': ' + assignment.name}
              onPress={() => {
                this.setState({ isLoading: true });

                this.props.navigation.push('MushafAssignmentScreen', {
                  isTeacher: true,
                  assignToAllClass: assignToAllClass,
                  userID: userID,
                  classID: classID,
                  studentID,
                  currentClass,
                  assignmentLocation: assignment.location,
                  assignmentType: assignment.type,
                  assignmentName: assignment.name,
                  assignmentIndex: c,
                  imageID: this.state.imageID,
                  onSaveAsignment: {}
                });
              }}
            >
              <Icon
                name={actionItemConfig[assignment.type].iconName}
                type={actionItemConfig[assignment.type].iconType}
                color="#fff"
                style={styles.actionButtonIcon}
              />
            </ActionButton.Item>
          );
        }
      });
    }

    //only show add another assignment if the user is not adding a new assignment already
    if (!this.state.isNewAssignment) {
      res.push(
        <ActionButton.Item
          buttonColor={colors.darkGreen}
          title="Add another assignment"
          key={"add_new"}
          onPress={() => {
            this.setState({ isLoading: true });

            this.props.navigation.push('MushafAssignmentScreen', {
              isTeacher: true,
              newAssignment: true,
              assignToAllClass: this.state.assignToAllClass,
              userID: userID,
              classID: classID,
              studentID,
              currentClass,
              imageID: this.state.imageID,
              onSaveAsignment: {}
            });
          }}
        >
          <Icon
            name="plus"
            type="feather"
            color="#fff"
            style={styles.actionButtonIcon}
          />
        </ActionButton.Item>
      );
    }

    //only show evaluation if we are showing a current assignment (not new) for a particular student
    if (!this.state.assignToAllClass && !this.state.isNewAssignment) {
      res.push(
        <ActionButton.Item
          buttonColor={colors.primaryDark}
          key={"evaluate_" + assignmentName}
          title={strings.EvaluateAssignment}
          onPress={async () => {
            this.setState({ isLoading: true });
            const classStudent = await currentClass.students.find(
              eachStudent => {
                return eachStudent.ID === studentID;
              }
            );
            const submission = classStudent.currentAssignments[assignmentIndex]
              ? classStudent.currentAssignments[assignmentIndex].submission
              : undefined;

            this.props.navigation.navigate('EvaluationPage', {
              classID,
              studentID,
              userID,
              assignmentName,
              assignmentLocation,
              assignmentLength: selection.length,
              assignmentType,
              classStudent,
              newAssignment: true,
              readOnly: false,
              submission,
              onCloseNavigateTo: "ClassStudentsTab"
            });
          }}
        >
          <Icon
            name="clipboard-check-outline"
            type="material-community"
            color="#fff"
            style={styles.actionButtonIcon}
          />
        </ActionButton.Item>
      );
    }

    return res;
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
      {
        label: strings.Memorization,
        value: strings.Memorization
      },
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
    let actionItems = this.getActionItems();

    if (isLoading === true) {
      return (
        <View
          id={this.state.page + 'spinner'}
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <LoadingSpinner isVisible={true} />
        </View>
      );
    } else {
      return (
        <ScrollView
          containerStyle={{
            width: screenWidth,
            height: screenHeight
          }}
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
          <View
            style={
              actionItems && actionItems.length > 0 ? { paddingRight: 80 } : {}
            }
          >
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
                flexDirection: 'row',
                justifyContent: 'center',
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
          </View>

          {actionItems && actionItems.length > 0 && (
            <ActionButton
              buttonColor={colors.actionButtonColor}
              renderIcon={() => (
                <Icon
                  name="ellipsis1"
                  color="#fff"
                  type="antdesign"
                  style={styles.actionButtonIcon}
                />
              )}
            >
              {actionItems}
            </ActionButton>
          )}
        </ScrollView>
      );
    }
  }
}

export default MushafAssignmentScreen;

const styles = StyleSheet.create({
  actionButtonIcon: {
    color: '#ffffff',
    fontSize: 20,
    height: 22
  }
});
