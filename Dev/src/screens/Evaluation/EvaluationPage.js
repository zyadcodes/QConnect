/* eslint-disable quotes */
/* eslint-disable comma-dangle */
import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Image,
  Alert,
  ScrollView
} from "react-native";
import { AirbnbRating } from "react-native-elements";
import colors from "config/colors";
import QcActionButton from "components/QcActionButton";
import strings from "config/strings";
import studentImages from "config/studentImages";
import QcParentScreen from "screens/QcParentScreen";
import FlowLayout from "components/FlowLayout";
import TopBanner from "components/TopBanner";
import FirebaseFunctions from "config/FirebaseFunctions";
import LoadingSpinner from "components/LoadingSpinner";
import QCView from "components/QCView";
import screenStyle from "config/screenStyle";
import fontStyles from "config/fontStyles";
import { screenWidth, screenHeight } from "config/dimensions";
import AudioPlayer from "components/AudioPlayer/AudioPlayer";

export class EvaluationPage extends QcParentScreen {
  //Default improvement areas
  areas = [
    strings.Memorization,
    strings.Makharej,
    strings.Edgham,
    strings.Ekhfae,
    strings.RulingsOfRaa,
    strings.Muduud,
    strings.Qalqalah
  ];

  state = {
    notes: this.props.navigation.state.params.notes
      ? this.props.navigation.state.params.notes
      : "",
    readOnly: this.props.navigation.state.params.readOnly,
    classID: this.props.navigation.state.params.classID,
    studentID: this.props.navigation.state.params.studentID,
    classStudent: this.props.navigation.state.params.classStudent,
    assignmentName: this.props.navigation.state.params.assignmentName,
    assignmentLength: this.props.navigation.state.params.assignmentLength,
    assignmentType: this.props.navigation.state.params.assignmentType,
    submission: this.props.navigation.state.params.submission,
    isLoading: true,
    rating: this.props.navigation.state.params.rating
      ? this.props.navigation.state.params.rating
      : 0,
    studentObject: "",
    isPlaying: "Stopped",
    currentPosition: "0:00",
    audioFile: -1,
    notesHeight: 30,
    selectedImprovementAreas: []
  };

  componentWillUnmount() {
    this.setState({
      currentPosition: "0:00",
      audioFile: -1
    });
  }
  //Sets the screen name according to whether this is a new assignment evaluation or an old one
  async componentDidMount() {
    if (this.state.readOnly === true) {
      FirebaseFunctions.setCurrentScreen(
        "Past Evaluation Page",
        "EvaluationPage"
      );
    } else {
      FirebaseFunctions.setCurrentScreen(
        "New Evaluation Page",
        "EvaluationPage"
      );
    }

    const studentObject = await FirebaseFunctions.getStudentByID(
      this.state.studentID
    );

    const { submission } = this.state;

    let audioFile = -1;
    let audioSentDateTime;
    if (submission !== undefined && submission.audioFileID !== undefined) {
      //Fetches audio file for student if one is present
      audioFile = await FirebaseFunctions.downloadAudioFile(
        submission.audioFileID
      );

      let audioSentDate = submission.sent.toDate();
      audioSentDateTime =
        audioSentDate.toLocaleDateString("EN-US") +
        ", " +
        audioSentDate.getHours() +
        ":" +
        audioSentDate.getMinutes();
    }

    //Fetches the ID for the evaluation (if there is none, it is created)
    const evaluationID = this.props.navigation.state.params.evaluationID
      ? this.props.navigation.state.params.evaluationID
      : this.state.studentID +
        (this.state.classStudent.totalAssignments + 1) +
        "";

    //what improvement area buttons to show
    //logic: if this is a read only version (of a past evaluation from history), we will show
    // the tags that teacher pressed on during evaluation (if any). Those gets passed as a navigation param
    // Otherwise, if it is a new evaluation, we'll check if the teacher has custom tags, we'll use them,
    // otherwise, we'll use the default areas
    //-----------------------------------------------------------
    let improvementAreas = this.areas;
    if (this.props.navigation.state.params.readOnly === true) {
      //show areas pressed when evaluating this history item (passed from calling screen)
      improvementAreas = this.props.navigation.state.params.improvementAreas;
    } else {
      const teacher = await FirebaseFunctions.getTeacherByID(
        this.props.navigation.state.params.userID
      );
      //if teacher has customized areas, let's load theirs.
      if (
        teacher.evaluationImprovementTags &&
        teacher.evaluationImprovementTags.length > 0
      ) {
        improvementAreas = teacher.evaluationImprovementTags;
      }
    }

    this.setState({
      studentObject,
      isLoading: false,
      evaluationID,
      audioFile,
      audioSentDateTime,
      improvementAreas
    });
  }

  // --------------  Updates state to reflect a change in a category rating --------------

  //Saves the evaluation as a new assignment
  async doSubmitRating() {
    let {
      rating,
      notes,
      selectedImprovementAreas,
      assignmentName,
      classID,
      studentID,
      assignmentLength,
      assignmentType,
      evaluationID
    } = this.state;

    notes = notes.trim();
    const submission = this.state.submission
      ? { submission: this.state.submission }
      : {};
    let evaluationDetails = {
      ID: evaluationID,
      name: assignmentName,
      assignmentLength,
      assignmentType: assignmentType,
      completionDate: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
      }),
      evaluation: {
        rating,
        notes,
        improvementAreas: selectedImprovementAreas
      },
      ...submission
    };
    try {
      await FirebaseFunctions.completeCurrentAssignment(
        classID,
        studentID,
        evaluationDetails
      );
      const currentClass = await FirebaseFunctions.getClassByID(
        this.state.classID
      );
      this.setState({
        currentPosition: "0:00",
        audioFile: -1
      });

      this.props.navigation.push("TeacherStudentProfile", {
        studentID: this.state.studentID,
        currentClass,
        userID: this.props.navigation.state.params.userID,
        classID: this.state.classID
      });
    } catch (err) {
      Alert.alert(strings.Whoops, strings.SomethingWentWrong);
    }
  }

  //Overwrites a previously saved assignment with the new data
  async overwriteOldEvaluation() {
    const {
      classID,
      studentID,
      evaluationID,
      notes,
      rating,
      selectedImprovementAreas,
      assignmentLength,
      classStudent
    } = this.state;
    const { assignmentType } = this.props.navigation.state.params;
    this.setState({ isLoading: true });
    let evaluationDetails = {
      rating,
      notes,
      assignmentLength,
      improvementAreas: selectedImprovementAreas,
      assignmentType: assignmentType
    };

    await FirebaseFunctions.overwriteOldEvaluation(
      classID,
      studentID,
      evaluationID,
      evaluationDetails
    );

    const currentClass = await FirebaseFunctions.getClassByID(
      this.state.classID
    );
    this.props.navigation.push("TeacherStudentProfile", {
      studentID: this.state.studentID,
      currentClass,
      userID: this.props.navigation.state.params.userID,
      classID: this.state.classID
    });
  }

  //------------  Ensures a rating is inputted before submitting it -------
  submitRating() {
    if (this.state.rating === 0) {
      Alert.alert("No Rating", strings.AreYouSureYouWantToProceed, [
        {
          text: "Yes",
          style: "cancel",
          onPress: () => {
            if (this.props.navigation.state.params.newAssignment === true) {
              this.doSubmitRating();
            } else {
              this.overwriteOldEvaluation();
            }
          }
        },
        { text: "No", style: "cancel" }
      ]);
    } else {
      this.setState({ isLoading: true });
      if (this.props.navigation.state.params.newAssignment === true) {
        this.doSubmitRating();
      } else {
        this.overwriteOldEvaluation();
      }
    }
  }

  // --------------  Renders Evaluation scree UI --------------
  render() {
    if (isLoading === true) {
      return (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <LoadingSpinner isVisible={true} />
        </View>
      );
    }
    const {
      notes,
      improvementAreas,
      readOnly,
      rating,
      classID,
      studentID,
      classStudent,
      assignmentName,
      isLoading,
      studentObject
    } = this.state;
    const { profileImageID } = studentObject;
    const headerTitle = readOnly
      ? strings.Completed +
        ": " +
        this.props.navigation.state.params.completionDate
      : strings.HowWas + classStudent.name + strings.sTasmee3;

    return (
      //----- outer view, gray background ------------------------
      //Makes it so keyboard is dismissed when clicked somewhere else

      <QCView style={screenStyle.container}>
        <ScrollView>
          {this.props.navigation.state.params.newAssignment === true ? (
            <TopBanner
              LeftIconName="angle-left"
              LeftOnPress={() =>
                this.props.navigation.state.params.onCloseNavigateTo
                  ? this.props.navigation.navigate(
                      this.props.navigation.state.params.onCloseNavigateTo
                    )
                  : this.props.navigation.goBack()
              }
              Title={strings.Evaluation}
            />
          ) : readOnly === true &&
            !this.props.navigation.state.params.isStudentSide ? (
            <TopBanner
              LeftIconName="angle-left"
              LeftOnPress={() => {
                let index = this.props.navigation.dangerouslyGetParent().state
                  .index;
                // go back to previous page if we have one
                if (index > 0) {
                  this.props.navigation.goBack();
                } else {
                  //if navigation stack is empty (no previous page), go to main screen
                  this.props.navigation.push("TeacherCurrentClass", {
                    userID: this.state.userID
                  });
                }
              }}
              Title={strings.Evaluation}
              RightIconName="edit"
              RightOnPress={() => {
                this.setState({
                  readOnly: false,
                  improvementAreas: this.state.improvementAreas
                });
              }}
            />
          ) : (
            <TopBanner
              LeftIconName="angle-left"
              LeftOnPress={() => this.props.navigation.goBack()}
              Title={strings.Evaluation}
            />
          )}
          <View style={styles.evaluationContainer}>
            <View style={styles.section}>
              <Image
                source={studentImages.images[profileImageID]}
                style={styles.profilePic}
              />
              <Text style={fontStyles.bigTextStyleDarkGrey}>
                {classStudent.name}
              </Text>
              <Text style={fontStyles.mainTextStylePrimaryDark}>
                {assignmentName}
              </Text>
            </View>
            {this.state.audioFile !== -1 ? (
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <View style={styles.playAudio}>
                  <AudioPlayer
                    visible={true}
                    compensateForVerticalMove={false}
                    image={studentImages.images[profileImageID]}
                    reciter={classStudent.name}
                    title={assignmentName}
                    audioFilePath={this.state.audioFile}
                    hideCancel={true}
                    sent={
                      this.state.audioSentDateTime
                        ? this.state.audioSentDateTime
                        : ""
                    }
                  />
                </View>
              </View>
            ) : (
              <View />
            )}
            <View style={styles.section}>
              <Text style={fontStyles.mainTextStyleDarkGrey}>
                {headerTitle}
              </Text>
              <View style={{ paddingVertical: 15 }}>
                <AirbnbRating
                  defaultRating={rating}
                  size={30}
                  showRating={false}
                  onFinishRating={value =>
                    this.setState({
                      rating: value
                    })
                  }
                  isDisabled={readOnly}
                />
              </View>

              <TextInput
                style={styles.notesStyle}
                multiline={true}
                height={this.state.notesHeight}
                onChangeText={teacherNotes =>
                  this.setState({
                    notes: teacherNotes
                  })
                }
                returnKeyType={"done"}
                autoCorrect={false}
                blurOnSubmit={true}
                placeholder={strings.WriteANote}
                placeholderColor={colors.black}
                editable={!readOnly}
                value={notes}
                onFocus={() =>
                  this.setState({ notesHeight: screenHeight * 0.1 })
                }
                onEndEditing={() => this.setState({ notesHeight: 30 })}
              />

              {/**
                  The Things to work on button.
              */}

              <View
                style={{ flexDirection: "row", justifyContent: "flex-start" }}
              >
                <Text style={fontStyles.mainTextStyleDarkGrey}>
                  {strings.ImprovementAreas}
                </Text>
              </View>
              <FlowLayout
                ref="flow"
                dataValue={improvementAreas}
                title={strings.ImprovementAreas}
                readOnly={readOnly}
                selectedByDefault={readOnly ? true : false}
                onSelectionChanged={selectedImprovementAreas => {
                  this.setState({ selectedImprovementAreas });
                }}
                onImprovementsCustomized={newAreas => {
                  this.setState({ improvementAreas: newAreas });
                  FirebaseFunctions.saveTeacherCustomImprovementTags(
                    this.props.navigation.state.params.userID,
                    newAreas
                  );
                }}
              />
            </View>
          </View>
        </ScrollView>
        <View style={styles.buttonsContainer}>
          {!readOnly ? (
            <QcActionButton
              text={strings.Submit}
              onPress={() => {
                this.submitRating();
              }}
              disabled={this.state.isLoading}
              screen={this.name}
            />
          ) : (
            <View />
          )}
        </View>
        <View style={styles.filler} />
      </QCView>
    );
  }
}

//--------------- Styles used on this screen -------------------
const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    backgroundColor: colors.lightGrey,
    flex: 1,
    justifyContent: "flex-end"
  },
  playAudio: {
    height: screenHeight * 0.1,
    justifyContent: "center",
    alignItems: "center"
  },
  evaluationContainer: {
    flexDirection: "column",
    paddingTop: screenHeight * 0.048,
    paddingBottom: screenHeight * 0.037,
    alignItems: "center",
    marginTop: screenHeight * 0.044,
    marginBottom: screenHeight * 0.015,
    marginHorizontal: screenWidth * 0.024,
    backgroundColor: colors.white,
    borderColor: colors.lightGrey,
    borderWidth: screenWidth * 0.0025
  },
  section: {
    alignItems: "center",
    alignSelf: "stretch",
    paddingTop: screenHeight * 0.015,
    paddingBottom: screenHeight * 0.015,
    paddingLeft: screenWidth * 0.024,
    paddingRight: screenWidth * 0.024
  },
  profilePic: {
    width: screenHeight * 0.1,
    height: screenHeight * 0.1,
    borderRadius: screenHeight * 0.05,
    marginTop: screenHeight * -0.1,
    marginLeft: screenWidth * 0.024,
    borderColor: colors.white,
    borderWidth: screenWidth * 0.007
  },
  buttonsContainer: {
    alignItems: "center",
    justifyContent: "space-evenly",
    flexDirection: "row",
    backgroundColor: colors.white
  },
  notesStyle: {
    backgroundColor: colors.lightGrey,
    alignSelf: "stretch",
    marginTop: screenHeight * 0.007,
    marginBottom: screenHeight * 0.007,
    marginLeft: screenWidth * 0.012,
    marginRight: screenWidth * 0.012,
    textAlignVertical: "top"
  },
  filler: {
    flexDirection: "column",
    flex: 1
  }
});
export default EvaluationPage;
