import React, { Component } from 'react';
import { View, Text } from 'react-native';
import MushafScreen from './MushafScreen';
import { screenHeight, screenWidth } from 'config/dimensions';
import FirebaseFunctions from 'config/FirebaseFunctions';
import QcActionButton from 'components/QcActionButton';
import strings from "config/strings";
import { ScrollView } from 'react-native-gesture-handler';
import surahs from "./Data/Surahs.json";
import { compareOrder } from "./Helpers/AyahsOrder";
import colors from "config/colors";
import SwitchSelector from 'react-native-switch-selector';
import fontStyles from "config/fontStyles";

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
    isTeacher: this.props.navigation.state.params.isTeacher,
    selection: this.props.navigation.state.params.assignmentLocation
      ? {
          start: this.props.navigation.state.params.assignmentLocation.start,
          end: this.props.navigation.state.params.assignmentLocation.end,
          started: false,
          completed: true,
        }
      : noSelection,
    freeFormAssignment: false,
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
    let {
      isTeacher,
      classID,
      currentClass,
      userID,
      assignmentLocation,
    } = this.state;
    if (classID === undefined && currentClass !== undefined) {
      this.setState({ classID: currentClass.ID });
    } else if (
      classID === undefined &&
      currentClass === undefined &&
      isTeacher === true
    ) {
      alert("getting from internet");
      const teacher = await FirebaseFunctions.getTeacherByID(userID);
      const { currentClassID } = teacher;
      const currentClassInfo = await FirebaseFunctions.getClassByID(
        currentClassID
      );
      this.setState({
        classID: currentClassID,
        currentClass: currentClassInfo,
        selection: assignmentLocation
          ? {
              start: assignmentLocation.start,
              end: assignmentLocation.end,
              started: false,
              completed: true,
            }
          : noSelection,
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
    const { assignToAllClass } = this.props.navigation.state.params;

    if (assignmentName && assignmentName.trim() === "") {
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

      this.closeScreen(assignmentName, this.state.currentClass);
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
		let students = currentClass.students.map((student) => {
			//Temporary solution until we use assignmentIDs.
			const index = student.currentAssignments.findIndex((element) => {
				return (
					element.name === this.props.navigation.state.params.assignmentName &&
					element.type === this.props.navigation.state.params.assignmentType &&
					element.location === this.props.navigation.state.params.assignmentLocation
				);
			});
			student.currentAssignments[index] = {
				name: newAssignmentName,
				type: assignmentType,
				location: assignmentLocation,
				isReadyEnum: 'WORKING_ON_IT'
			};
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
    let students = currentClass.students.map((student) => {
			if (student.ID === studentID) {
				if (isNewAssignment === true) {
					student.currentAssignments.push({
						name: newAssignmentName,
						type: assignmentType,
						location: assignmentLocation,
						isReadyEnum: 'WORKING_ON_IT'
					});
				} else {
					const index = student.currentAssignments.findIndex((element) => {
						return (
							element.name === this.props.navigation.state.params.assignmentName &&
							element.type === this.props.navigation.state.params.assignmentType
						);
					});
					student.currentAssignments[index] = {
						name: newAssignmentName,
						type: assignmentType,
						location: assignmentLocation,
						isReadyEnum: 'WORKING_ON_IT'
					};
				}
			}

    FirebaseFunctions.updateStudentCurrentAssignment(
      classID,
      studentID,
      newAssignmentName,
      assignmentType,
      assignmentLocation
    );
  });
}

  updateAssignmentName() {
    const { selection } = this.state;
    if (selection.start.surah === 0) {
      //no selection made
      //todo: make this an explicit flag
      return '';
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
      freeFormAssignment: false,
    });
  }

  //this is to update the assignment text without mapping it to a location in the mus7af
  // this is to allow teachers to enter free form assignemnts
  // for example: redo your last 3 assignments
  setFreeFormAssignmentName(freeFormAssignmentName) {
    this.setState({
      assignmentName: freeFormAssignmentName,
      freeFormAssignment: true,
    });
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
            completed: true,
          },
        },
        () => {
          //Set the smallest number as the start, and the larger as the end
          if (compareOrder(selection.start, selectedAyah) > 0) {
            this.setState(
              { selection: { ...this.state.selection, end: selectedAyah } },
              () => this.updateAssignmentName()
            );
          } else {
            this.setState(
              { selection: { ...this.state.selection, start: selectedAyah } },
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
              },
            };
          },
          () => this.updateAssignmentName()
        )
    );
  }

  //============= end of selection methods =============================

  //============ render method: UI entry point for this component ===
  render() {
    const {
      userID,
      studentID,
      assignmentName,
      assignmentLocation,
      assignmentType,
      currentClass,
      selection,
      classID,
    } = this.state;

    const options = [
      { label: strings.Memorization, value: strings.Memorization },
      { label: strings.Revision, value: strings.Revision },
      { label: strings.Reading, value: strings.Reading },
    ];
    let selectedAssignmentTypeIndex = 0;
    if (this.props.assignmentType !== undefined) {
      if (
        options.findIndex(
          option => option.value === this.props.assignmentType
        ) !== -1
      ) {
        selectedAssignmentTypeIndex = options.findIndex(
          option => option.value === this.props.assignmentType
        );
      }
    }

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
          onSelectAyah={this.onSelectAyah.bind(this)}
          onSelectAyahs={this.onSelectAyahs.bind(this)}
          setFreeFormAssignmentName={this.setFreeFormAssignmentName.bind(this)}
        />
        <View style={{ padding: 5 }}>
          {this.state.selection.start.surah > 0 ||
          this.state.freeFormAssignment ? (
            <Text style={fontStyles.mainTextStyleDarkGrey}>
              {this.state.assignmentName}
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
            onPress={() => this.closeScreen(assignmentName, currentClass)}
          />
        </View>
      </ScrollView>
    );
  }
}

export default MushafAssignmentScreen;
