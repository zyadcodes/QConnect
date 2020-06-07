/* eslint-disable react-native/no-inline-styles */
/* eslint-disable quotes */
/* eslint-disable comma-dangle */
import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Alert,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import { AirbnbRating, Icon } from "react-native-elements";
import colors from "config/colors";
import ActionButton from "react-native-action-button";
import strings from "config/strings";
import studentImages from "config/studentImages";
import QcParentScreen from "screens/QcParentScreen";
import FlowLayout from "components/FlowLayout";
import TopBanner from "components/TopBanner";
import FirebaseFunctions from "config/FirebaseFunctions";
import LoadingSpinner from "components/LoadingSpinner";
import fontStyles from "config/fontStyles";
import { screenWidth, screenHeight } from "config/dimensions";
import AudioPlayer from "components/AudioPlayer/AudioPlayer";
import Header, { headerHeight } from "components/Header";
import MushafScreen from "screens/MushafScreen/MushafScreen";
import KeepAwake from "react-native-keep-awake";
import { noSelection } from "screens/MushafScreen/Helpers/consts";
import * as _ from "lodash";
import {
  compareOrder,
  toNumberString
} from "../MushafScreen/Helpers/AyahsOrder";
import DailyTracker, { getTodaysDateString } from "components/DailyTracker";

const isAndroid = Platform.OS === "android";

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
    assignmentLocation: this.props.navigation.state.params.assignmentLocation,
    // we show Mushaf in evaluation page only if the assignment location was passed in
    showMushaf:
      this.props.navigation.state.params.assignmentLocation === undefined
        ? false
        : true,
    submission: this.props.navigation.state.params.submission,
    isLoading: true,
    rating: this.props.navigation.state.params.rating
      ? this.props.navigation.state.params.rating
      : 0,
    studentObject: "",
    isPlaying: "Stopped",
    currentPosition: "0:00",
    audioFile: -1,
    notesHeight: 40,
    selectedImprovementAreas: [],
    highlightedWords:
      this.props.navigation.state.params.highlightedWords !== undefined
        ? this.props.navigation.state.params.highlightedWords
        : {},
    highlightedAyahs:
      this.props.navigation.state.params.highlightedAyahs !== undefined
        ? this.props.navigation.state.params.highlightedAyahs
        : {},
    audioPlaybackVisible: true,
    evaluationCollapsed: false,
    selection: this.props.navigation.state.params.assignmentLocation
      ? {
          start: this.props.navigation.state.params.assignmentLocation.start,
          end: this.props.navigation.state.params.assignmentLocation.end,
          started: false,
          completed: true
        }
      : noSelection
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
      assignmentLocation,
      evaluationID,
      highlightedWords,
      highlightedAyahs
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
      location: assignmentLocation,
      completionDate: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
      }),
      evaluation: {
        rating,
        notes,
        highlightedWords,
        highlightedAyahs,
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
      Alert.alert(strings.SomethingWentWrong, strings.SomethingWentWrongDesc);
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
  onSelectAyah(selectedAyah, selectedWord) {
    if (this.state.readOnly) {
      // don't change highlighted words/ayahs on read-only mode.
      return;
    }
    //if users press on a word, we highlight that word
    if (selectedWord.char_type === "word") {
      let highlightedWords = this.state.highlightedWords;
      if (!Object.keys(highlightedWords).includes(selectedWord.id)) {
        highlightedWords = {
          ...highlightedWords,
          [selectedWord.id]: {}
        };
      } else {
        //if the same highlighted word is pressed again, un-highlight it (toggle off)
        delete highlightedWords[selectedWord.id];
      }
      this.setState({ highlightedWords });
    } else if (selectedWord.char_type === "end") {
      //if user presses on an end of ayah, we highlight that entire ayah
      let highlightedAyahs = this.state.highlightedAyahs;
      let ayahKey = toNumberString(selectedAyah);

      if (!Object.keys(highlightedAyahs).includes(ayahKey)) {
        highlightedAyahs = {
          ...highlightedAyahs,
          [ayahKey]: { ...selectedAyah }
        };
      } else {
        //if the same highlighted word is pressed again, un-highlight it (toggle off)
        delete highlightedAyahs[ayahKey];
      }
      this.setState({ highlightedAyahs });
    }
  }

  closeScreen() {
    this.props.navigation.state.params.onCloseNavigateTo
      ? this.props.navigation.navigate(
          this.props.navigation.state.params.onCloseNavigateTo
        )
      : this.props.navigation.goBack();
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
      classStudent,
      assignmentName,
      isLoading,
      studentObject,
      studentID,
      classID,
      assignmentType,
      showMushaf,
      highlightedAyahs,
      highlightedWords
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
      <View
        style={{
          flex: 1
        }}
      >
        {this.props.navigation.state.params.newAssignment === true ? (
          <Header
            title={strings.Evaluation}
            subtitle={assignmentName}
            avatarName={classStudent.name}
            avatarImage={studentImages.images[profileImageID]}
            onClose={this.closeScreen.bind(this)}
          />
        ) : readOnly === true &&
          !this.props.navigation.state.params.isStudentSide ? (
          <TopBanner
            LeftIconName="angle-left"
            LeftOnPress={this.closeScreen.bind(this)}
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
          <Header
            title={strings.Evaluation}
            avatarName={classStudent.name}
            subtitle={assignmentName}
            avatarImage={studentImages.images[profileImageID]}
            onClose={this.closeScreen.bind(this)}
          />
        )}
        {showMushaf && (
          <View
            style={{ height: screenHeight - headerHeight, paddingBottom: 150 }}
          >
            <KeepAwake />
            <MushafScreen
              assignToID={studentID}
              hideHeader={true}
              showSelectedLinesOnly={false}
              classID={classID}
              profileImage={studentImages.images[profileImageID]}
              showLoadingOnHighlightedAyah={
                this.state.isAudioLoading === true &&
                (this.state.highlightedAyahs !== undefined ||
                  _.isEqual(this.state.highlightedAyahs, {}))
              }
              selection={this.state.selection}
              highlightedWords={highlightedWords}
              highlightedAyahs={highlightedAyahs}
              highlightedColor={colors.darkRed}
              assignmentName={assignmentName}
              assignmentType={assignmentType}
              topRightIconName="close"
              onClose={this.closeScreen.bind(this)}
              currentClass={classStudent}
              onSelectAyah={this.onSelectAyah.bind(this)}
              disableChangingUser={true}
            />
          </View>
        )}

        <KeyboardAvoidingView
          behavior= {isAndroid? undefined : "padding"}
          style={
            showMushaf
              ? styles.evaluationContainer
              : { justifyContent: "center", alignItems: "center" }
          }
        >
          <ScrollView>
            {showMushaf && (
              <View
                style={{
                  top: 5,
                  left: screenWidth * 0.9,
                  zIndex: 1,
                  position: "absolute" // add if dont work with above
                }}
              >
                <TouchableOpacity
                  onPress={() =>
                    this.setState({
                      evaluationCollapsed: !this.state.evaluationCollapsed
                    })
                  }
                >
                  <Icon
                    name={
                      this.state.evaluationCollapsed
                        ? "angle-double-up"
                        : "angle-double-down"
                    }
                    type="font-awesome"
                    color={colors.primaryDark}
                  />
                </TouchableOpacity>
              </View>
            )}

            {this.state.audioFile !== -1 ? (
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  margin: 10
                }}
              >
                <View style={styles.playAudio}>
                  <AudioPlayer
                    visible={true}
                    compensateForVerticalMove={false}
                    image={studentImages.images[profileImageID]}
                    reciter={classStudent.name}
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

              {this.state.evaluationCollapsed === false && (
                <View>
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
                    onEndEditing={() => this.setState({ notesHeight: 40 })}
                  />

                  {/**
                  The Things to work on button.
              */}

                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "flex-start"
                    }}
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
                  <View style={{ height: 30 }} />
                  {!readOnly && (
                    <ActionButton
                      buttonColor={colors.darkGreen}
                      onPress={() => {
                        this.submitRating();
                      }}
                      renderIcon={() => (
                        <Icon
                          name="check-bold"
                          color="#fff"
                          type="material-community"
                          style={styles.actionButtonIcon}
                        />
                      )}
                    />
                  )}
                </View>
              )}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    );
  }
}

//--------------- Styles used on this screen -------------------
const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    backgroundColor: colors.lightGrey,
    flex: 1
  },
  playAudio: {
    height: screenHeight * 0.1,
    justifyContent: "center",
    alignItems: "center"
  },
  evaluationContainer: {
    flexDirection: "column",
    paddingTop: 5,
    paddingBottom: 5,
    alignItems: "center",
    marginTop: 5,
    marginBottom: 5,
    marginHorizontal: 5,
    backgroundColor: colors.white,
    borderColor: colors.lightGrey,
    borderWidth: 1,
    shadowColor: colors.black,
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 3,
    borderRadius: 3,
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0
  },
  section: {
    alignItems: "center",
    padding: 5,
    width: screenWidth * 0.99
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
    backgroundColor: colors.blue,
    flex: 1
  }
});
export default EvaluationPage;
