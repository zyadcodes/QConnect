/* eslint-disable react-native/no-inline-styles */
/* eslint-disable quotes */
/* eslint-disable comma-dangle */
import React from "react";
import {
  StyleSheet,
  View,
  Text,
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
import { toNumberString } from "../MushafScreen/Helpers/AyahsOrder";
import EvaluationNotes from "../../components/EvaluationNotes";

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
    evaluationCollapsed: true,
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
    let evaluationCollapsed = this.state.evaluationCollapsed;
    if (this.props.navigation.state.params.readOnly === true) {
      //show areas pressed when evaluating this history item (passed from calling screen)
      improvementAreas = this.props.navigation.state.params.improvementAreas;
      let itemHasImprovementAreas =
        improvementAreas && improvementAreas.length > 0;
      let itemHasNotes =
        this.props.navigation.state.params.notes !== undefined &&
        this.props.navigation.state.params.notes.length > 0;

      // Expand evaluation card in history view to show evaluation notes if the evaluation item has some notes/areas.
      if (itemHasImprovementAreas || itemHasNotes) {
        evaluationCollapsed = false;
      }
    } else {
      this.getTeacherCustomImprovementAreas();
    }

    this.setState({
      studentObject,
      isLoading: false,
      evaluationID,
      evaluationCollapsed,
      audioFile,
      audioSentDateTime,
      improvementAreas
    });
  }

  //asynchronously loads custom evaluation tags that the teacher might have
  // saved on firebase and update the state once loaded.
  async getTeacherCustomImprovementAreas() {
    const teacher = await FirebaseFunctions.getTeacherByID(
      this.props.navigation.state.params.userID
    );
    //if teacher has customized areas, let's load theirs.
    if (
      teacher.evaluationImprovementTags &&
      teacher.evaluationImprovementTags.length > 0
    ) {
      let improvementAreas = teacher.evaluationImprovementTags;
      this.setState({ improvementAreas });
    }
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
        improvementAreas: selectedImprovementAreas,
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
      highlightedAyahs,
      highlightedWords
    } = this.state;

    this.setState({ isLoading: true });
    let evaluationDetails = {
      rating,
      notes,
      highlightedWords,
      highlightedAyahs,
      improvementAreas: selectedImprovementAreas,
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
              this.setState({ isLoading: true });
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

  //remove the highlight and its corresponding evaluation notes from the given word.
  unhighlightWord(word, ayah) {
    if (word.char_type === "word") {
      let highlightedWords = this.state.highlightedWords;
      delete highlightedWords[word.id];
      this.setState({ highlightedWords });
    } else if (word.char_type === "end") {
      //if user presses on an end of ayah, we highlight that entire ayah
      let highlightedAyahs = this.state.highlightedAyahs;
      let ayahKey = toNumberString(ayah);
      delete highlightedAyahs[ayahKey];
      this.setState({ highlightedAyahs });
    }
  }

  //this function is called when users
  onSelectAyah(selectedAyah, selectedWord, evalNotes) {
    if (this.state.readOnly) {
      // don't change highlighted words/ayahs on read-only mode.
      return;
    }
    //if users press on a word, we highlight that word
    if (selectedWord.char_type === "word") {
      let highlightedWords = this.state.highlightedWords;
      let wordEval = _.get(highlightedWords, selectedWord.id, {});

      //merge the new notes with the old notes..
      Object.assign(wordEval, evalNotes);

      highlightedWords = {
        ...highlightedWords,
        [selectedWord.id]: wordEval
      };
      this.setState({ highlightedWords });
    } else if (selectedWord.char_type === "end") {
      //if user presses on an end of ayah, we highlight that entire ayah
      let highlightedAyahs = this.state.highlightedAyahs;
      let ayahKey = toNumberString(selectedAyah);
      let ayahEval = _.get(highlightedAyahs, ayahKey, {});
      highlightedAyahs = {
        ...highlightedAyahs,
        [ayahKey]: { ...ayahEval, ...evalNotes }
      };
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

  //handles when teacher taps on an improvement area durig tasmee3 evaluation
  onImprovementAreasSelectionChanged = (
    selectedImprovementAreas,
    word,
    ayah
  ) => {
    if (word === undefined) {
      this.setState({ selectedImprovementAreas });
    } else {
      this.onSelectAyah(ayah, word, {
        improvementAreas: selectedImprovementAreas
      });
    }
  };

  //handles when teacher enters a note durig tasmee3 evaluation
  onSaveNotes(notes, word, ayah) {
    if (word === undefined) {
      this.setState({ notes });
    } else {
      this.onSelectAyah(ayah, word, { notes });
    }
  }

  onImprovementsCustomized = newAreas => {
    this.setState({ improvementAreas: newAreas });
    FirebaseFunctions.saveTeacherCustomImprovementTags(
      this.props.navigation.state.params.userID,
      newAreas
    );
  };

  // --------------  Renders Evaluation scree UI --------------
  render() {
    const {
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

    if (isLoading === true) {
      return (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <LoadingSpinner isVisible={true} />
        </View>
      );
    }
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
            title={assignmentType}
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
                selectedImprovementAreas: this.state.improvementAreas
              });
              this.getTeacherCustomImprovementAreas();
            }}
          />
        ) : (
          <Header
            title={assignmentType}
            avatarName={classStudent.name}
            subtitle={assignmentName}
            avatarImage={studentImages.images[profileImageID]}
            onClose={this.closeScreen.bind(this)}
          />
        )}
        <KeyboardAvoidingView
          behavior={isAndroid ? undefined : "padding"}
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
                  bottom: 5,
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
                        ? "angle-double-down"
                        : "angle-double-up"
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
                <EvaluationNotes
                  improvementAreas={improvementAreas}
                  readOnly={readOnly}
                  onImprovementAreasSelectionChanged={this.onImprovementAreasSelectionChanged.bind(
                    this
                  )}
                  onImprovementsCustomized={this.onImprovementsCustomized.bind(
                    this
                  )}
                  saveNotes={evalNotes => this.onSaveNotes(evalNotes)}
                  notes={this.state.notes}
                  selectedImprovementAreas={this.state.selectedImprovementAreas}
                  userID={this.props.navigation.state.params.userID}
                />
              )}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
        <View style={{ flex: 1 }}>
          {showMushaf && (
            <View
              style={{
                height: screenHeight - headerHeight
              }}
            >
              <KeepAwake />
              <MushafScreen
                assignToID={studentID}
                hideHeader={true}
                readOnly={readOnly}
                showSelectedLinesOnly={false}
                classID={classID}
                showTooltipOnPress={readOnly ? "whenHighlighted" : "true"}
                profileImage={studentImages.images[profileImageID]}
                showLoadingOnHighlightedAyah={
                  this.state.isAudioLoading === true &&
                  (this.state.highlightedAyahs !== undefined ||
                    _.isEqual(this.state.highlightedAyahs, {}))
                }
                selection={this.state.selection}
                highlightedWords={_.cloneDeep(highlightedWords)}
                highlightedAyahs={_.cloneDeep(highlightedAyahs)}
                highlightedColor={colors.darkRed}
                assignmentName={assignmentName}
                assignmentType={assignmentType}
                topRightIconName="close"
                onClose={this.closeScreen.bind(this)}
                currentClass={classStudent}
                onSelectAyah={this.onSelectAyah.bind(this)}
                disableChangingUser={true}
                removeHighlight={this.unhighlightWord.bind(this)}
                evalNotesComponent={(word, ayah) => {
                  let wordOrAyahImprovements = [];
                  let wordOrAyahNotes = "";
                  let wordHasFeedback = false;
                  try {
                    //if user taps on a word, and teacher has put feedback specific to that word, show it
                    if (word.char_type !== "end") {
                      wordOrAyahImprovements = _.get(
                        highlightedWords[word.id],
                        "improvementAreas",
                        []
                      );
                      wordOrAyahNotes = _.get(
                        highlightedWords[word.id],
                        "notes",
                        []
                      );

                      if (
                        wordOrAyahImprovements.length > 0 ||
                        wordOrAyahNotes.length > 0
                      ) {
                        wordHasFeedback = true;
                      }
                    }

                    //show ayah feedback if:
                    // 1: user taps on an ayah number of an ayah that has feedback associated with it
                    // 2: user taps on a word that belongs to an ayah with feedback items AND there is no other
                    //    feedback specific to tha word
                    if (word.char_type === "end" || wordHasFeedback === false) {
                      let ayahNumber = toNumberString(ayah);
                      wordOrAyahImprovements = _.get(
                        highlightedAyahs[ayahNumber],
                        "improvementAreas",
                        []
                      );
                      wordOrAyahNotes = _.get(
                        highlightedAyahs[ayahNumber],
                        "notes",
                        []
                      );
                    }
                  } catch (error) {
                    console.trace();
                    console.log(
                      "ERROR_GET_WRD_AYAH_IMPROVEMENTS" + JSON.stringify(error)
                    );
                    FirebaseFunctions.logEvent(
                      "ERROR_GET_WRD_AYAH_IMPROVEMENTS",
                      {
                        error
                      }
                    );
                  }
                  return (
                    <EvaluationNotes
                      //TODO: This logic needs cleaning
                      // for now: if the teacher is evaluating, then we pass the full set of improvement ares for her to choose from
                      // if this is readonly (ie: student or teacher are seeing a past assignment),
                      //  then we show only imp. areas entered for ths word.
                      improvementAreas={
                        readOnly ? wordOrAyahImprovements : improvementAreas
                      }
                      notes={wordOrAyahNotes}
                      selectedImprovementAreas={wordOrAyahImprovements}
                      readOnly={readOnly}
                      userID={this.props.navigation.state.params.userID}
                      onImprovementAreasSelectionChanged={selectedImprovementAreas =>
                        this.onImprovementAreasSelectionChanged(
                          selectedImprovementAreas,
                          word,
                          ayah
                        )
                      }
                      onImprovementsCustomized={newAreas => {
                        this.setState({ improvementAreas: newAreas });
                        FirebaseFunctions.saveTeacherCustomImprovementTags(
                          this.props.navigation.state.params.userID,
                          newAreas
                        );
                      }}
                      saveNotes={wordNotes =>
                        this.onSaveNotes(wordNotes, word, ayah)
                      }
                    />
                  );
                }}
              />
            </View>
          )}
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
    borderRadius: 3
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
