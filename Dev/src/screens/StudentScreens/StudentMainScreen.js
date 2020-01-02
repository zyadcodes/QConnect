//This screen will be the main screen that will display for students as a landing page for when they first
//sign up or log in
import React from "react";
import QcParentScreen from "../QcParentScreen";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Modal,
  Alert,
  Animated
} from "react-native";
import { Icon } from "react-native-elements";
import studentImages from "config/studentImages";
import { Rating } from "react-native-elements";
import colors from "config/colors";
import strings from "config/strings";
import TopBanner from "components/TopBanner";
import FirebaseFunctions from "config/FirebaseFunctions";
import QcActionButton from "components/QcActionButton";
import LeftNavPane from "./LeftNavPane";
import SideMenu from "react-native-side-menu";
import LoadingSpinner from "components/LoadingSpinner";
import { TextInput } from "react-native-gesture-handler";
import QCView from "components/QCView";
import screenStyle from "config/screenStyle";
import fontStyles from "config/fontStyles";
import { CustomPicker } from "react-native-custom-picker";
import { screenHeight, screenWidth } from "config/dimensions";
import AudioPlayer from "components/AudioPlayer/AudioPlayer";
import TouchableText from "components/TouchableText";

const translateY = new Animated.Value(-35);
const opacity = new Animated.Value(0);
const opacityInterpolate = opacity.interpolate({
  inputRange: [0, 0.85, 1],
  outputRange: [0, 0, 1]
});

class StudentMainScreen extends QcParentScreen {
  state = {
    isLoading: true,
    student: "",
    userID: "",
    currentClass: "",
    currentClassID: "",
    thisClassInfo: "",
    isReadyEnum: "",
    modalVisible: false,
    recordingUIVisible: false,
    classCode: "",
    classes: "",
    isRecording: false,
    currentPosition: "0:00"
  };

  //-------------- Component lifecycle methods -----------------------------------
  //Fetches all the values for the state from the firestore database
  async componentDidMount() {
    super.componentDidMount();

    //Sets the screen name in firebase analytics
    FirebaseFunctions.setCurrentScreen(
      "Student Main Screen",
      "StudentMainScreen"
    );

    const { userID } = this.props.navigation.state.params;
    const student = await FirebaseFunctions.getStudentByID(userID);
    const { currentClassID } = student;
    if (currentClassID === "") {
      this.setState({
        isLoading: false,
        noCurrentClass: true,
        student,
        userID,
        isOpen: false,
        classes: []
      });
    } else {
      const currentClass = await FirebaseFunctions.getClassByID(currentClassID);
      const thisClassInfo = currentClass.students.find(student => {
        return student.ID === userID;
      });
      const { isReadyEnum } = thisClassInfo;
      const classes = await FirebaseFunctions.getClassesByIDs(student.classes);
      this.setState({
        student,
        userID,
        currentClass,
        currentClassID,
        thisClassInfo,
        isReadyEnum,
        isLoading: false,
        isOpen: false,
        classes
      });
    }
  }

  //------------------- end of component lifecycle methods -----------------------------

  //Joins the class by first testing if this class exists. If the class doesn't exist, then it will
  //alert the user that it does not exist. If the class does exist, then it will join the class, and
  //navigate to the current class screen.
  async joinClass() {
    this.setState({ isLoading: true });
    const { userID, classCode, student } = this.state;

    //Tests if the user is already a part of this class and throws an alert if they are
    if (student.classes.includes(classCode)) {
      Alert.alert(strings.Whoops, strings.ClassAlreadyJoined);
      this.setState({ isLoading: false });
    } else {
      const didJoinClass = await FirebaseFunctions.joinClass(
        student,
        classCode
      );
      if (didJoinClass === -1) {
        Alert.alert(strings.Whoops, strings.IncorrectClassCode);
        this.setState({ isLoading: false, modalVisible: false });
      } else {
        //Refetches the student object to reflect the updated database
        this.setState({
          isLoading: false,
          modalVisible: false
        });
        this.props.navigation.push("StudentCurrentClass", {
          userID
        });
      }
    }
  }

  //Returns the correct caption based on the student's average grade
  getRatingCaption() {
    let caption = strings.GetStarted;
    let { averageRating } = this.state.thisClassInfo;

    if (averageRating > 4) {
      caption = strings.OutStanding;
    } else if (averageRating >= 3) {
      caption = strings.GreatJob;
    } else if (averageRating > 0) {
      caption = strings.PracticePerfect;
    }

    return caption;
  }

  //---------- Helper methods to render parts of the screen, or certain cases ------------
  //Renders the screen when student didn't join any class
  renderEmptyState() {
    return (
      <SideMenu
        onChange={isOpen => {
          this.setState({ isOpen });
        }}
        openMenuOffset={screenWidth * 0.7}
        isOpen={this.state.isOpen}
        menu={
          <LeftNavPane
            student={student}
            userID={userID}
            classes={this.state.classes}
            edgeHitWidth={0}
            navigation={this.props.navigation}
          />
        }
      >
        <QCView style={screenStyle.container}>
          <View style={{ flex: 1 }}>
            <TopBanner
              LeftIconName="navicon"
              LeftOnPress={() => this.setState({ isOpen: true })}
              Title={"Quran Connect"}
            />
          </View>
          <View
            style={{
              flex: 2,
              justifyContent: "flex-start",
              alignItems: "center",
              alignSelf: "center"
            }}
          >
            <Image
              source={require("assets/emptyStateIdeas/ghostGif.gif")}
              style={{
                width: screenWidth * 0.73,
                height: screenHeight * 0.22,
                resizeMode: "contain"
              }}
            />

            <Text
              style={[fontStyles.bigTextStyleDarkGrey, { alignSelf: "center" }]}
            >
              {strings.HaventJoinedClassYet}
            </Text>

            <QcActionButton
              text={strings.JoinClass}
              onPress={() => this.setState({ modalVisible: true })}
            />
          </View>
          <Modal
            animationType="fade"
            style={{ alignItems: "center", justifyContent: "center" }}
            transparent={true}
            presentationStyle="overFullScreen"
            visible={this.state.modalVisible}
            onRequestClose={() => {}}
          >
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                alignSelf: "center",
                paddingTop: screenHeight / 3
              }}
            >
              <View style={styles.modal}>
                {this.state.isLoading === true ? (
                  <View>
                    <LoadingSpinner isVisible={true} />
                  </View>
                ) : (
                  <View>
                    <View
                      style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center"
                      }}
                    >
                      <Text style={fontStyles.mainTextStyleDarkGrey}>
                        {strings.TypeInAClassCode}
                      </Text>
                    </View>
                    <View
                      style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center"
                      }}
                    >
                      <TextInput
                        style={[
                          {
                            height: screenHeight * 0.07,
                            paddingLeft: 0.017 * screenWidth
                          },
                          fontStyles.mainTextStyleDarkGrey
                        ]}
                        placeholder={strings.TypeInAClassCode}
                        autoCorrect={false}
                        onChangeText={classCode => this.setState({ classCode })}
                        value={this.state.classCode}
                      />
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        flex: 1
                      }}
                    >
                      <QcActionButton
                        text={strings.Cancel}
                        onPress={() => {
                          this.setState({ modalVisible: false });
                        }}
                      />
                      <QcActionButton
                        text={strings.Confirm}
                        onPress={() => {
                          //Joins the class
                          this.joinClass();
                        }}
                      />
                    </View>
                  </View>
                )}
              </View>
            </View>
          </Modal>
        </QCView>
      </SideMenu>
    );
  }

  //renders a past assignment info card
  renderHistoryItem(item, index, thisClassInfo) {
    return (
      <TouchableOpacity
        onPress={() => {
          //To-Do: Navigates to more specific evaluation for this assignment
          this.props.navigation.push("EvaluationPage", {
            classID: this.state.currentClassID,
            studentID: this.state.userID,
            classStudent: thisClassInfo,
            assignmentName: item.name,
            completionDate: item.completionDate,
            rating: item.evaluation.rating,
            notes: item.evaluation.notes,
            improvementAreas: item.evaluation.improvementAreas,
            userID: this.state.userID,
            evaluationObject: item.evaluation,
            isStudentSide: true,
            evaluationID: item.ID,
            readOnly: true,
            newAssignment: false
          });
        }}
      >
        <View style={styles.prevAssignmentCard} key={index}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <View
              style={{
                flex: 3,
                justifyContent: "center",
                alignItems: "flex-start"
              }}
            >
              <Text style={fontStyles.mainTextStylePrimaryDark}>
                {item.completionDate}
              </Text>
            </View>
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                flex: 3
              }}
            >
              <Text
                numberOfLines={1}
                style={[
                  fontStyles.mainTextStyleBlack,
                  {
                    color:
                      item.assignmentType === strings.Reading ||
                      item.assignmentType === strings.Read
                        ? colors.grey
                        : item.assignmentType === strings.Memorization ||
                          item.assignmentType === strings.Memorize ||
                          item.assignmentType == null
                        ? colors.darkGreen
                        : colors.darkishGrey
                  }
                ]}
              >
                {item.assignmentType ? item.assignmentType : strings.Memorize}
              </Text>
            </View>
            <View
              style={{
                flex: 3,
                justifyContent: "center",
                alignItems: "flex-end"
              }}
            >
              <Rating
                readonly={true}
                startingValue={item.evaluation.rating}
                imageSize={17}
              />
            </View>
          </View>
          <View
            style={{
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Text numberOfLines={1} style={fontStyles.bigTextStyleBlack}>
              {item.name}
            </Text>
          </View>
          {item.evaluation.notes ? (
            <Text numberOfLines={2} style={fontStyles.smallTextStyleDarkGrey}>
              {"Notes: " + item.evaluation.notes}
            </Text>
          ) : (
            <View />
          )}
          {item.evaluation.improvementAreas &&
          item.evaluation.improvementAreas.length > 0 ? (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-start",
                height: screenHeight * 0.03
              }}
            >
              <Text style={fontStyles.smallTextStyleDarkGrey}>
                {strings.ImprovementAreas}
              </Text>
              {item.evaluation.improvementAreas.map((tag, cnt) => {
                return (
                  <Text key={tag}>
                    {cnt > 0 ? ", " : ""}
                    {tag}
                  </Text>
                );
              })}
            </View>
          ) : (
            <View />
          )}
        </View>
      </TouchableOpacity>
    );
  }

  renderTopBanner(className) {
    return (
      <TopBanner
        LeftIconName="navicon"
        LeftOnPress={() => this.setState({ isOpen: true })}
        Title={className}
      />
    );
  }

  renderTopView() {
    const { student, thisClassInfo, currentClass } = this.state;

    return (
      <View style={styles.topView}>
        {this.renderTopBanner(currentClass.name)}
        <View style={styles.profileInfo}>
          <View style={styles.profileInfoTop}>
            <Image
              style={styles.profilePic}
              source={studentImages.images[student.profileImageID]}
            />
            <View style={styles.profileInfoTopRight}>
              <Text numberOfLines={1} style={fontStyles.mainTextStyleBlack}>
                {student.name.toUpperCase()}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  height: screenHeight * 0.04
                }}
              >
                <Rating
                  readonly={true}
                  startingValue={thisClassInfo.averageRating}
                  imageSize={25}
                />
                <View
                  style={{
                    flexDirection: "column",
                    justifyContent: "center"
                  }}
                >
                  <Text style={fontStyles.bigTextStyleDarkGrey}>
                    {thisClassInfo.averageRating === 0
                      ? ""
                      : parseFloat(thisClassInfo.averageRating).toFixed(1)}
                  </Text>
                </View>
              </View>
              <Text style={fontStyles.mainTextStylePrimaryDark}>
                {this.getRatingCaption()}
              </Text>
            </View>
          </View>
          <View style={styles.profileInfoBottom}>
            <View
              style={{
                justifyContent: "space-between",
                flexDirection: "column"
              }}
            >
              <View style={{ alignSelf: "flex-start" }}>
                <Text style={fontStyles.mainTextStyleDarkGrey}>
                  {strings.TotalAssignments +
                    ": " +
                    thisClassInfo.totalAssignments +
                    "  "}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }

  getCustomPickerOptionTemplate(settings) {
    const { item, getLabel } = settings;
    return (
      <View style={styles.optionContainer}>
        <View style={styles.innerContainer}>
          <View style={[styles.box, { backgroundColor: item.color }]} />
          <Text style={fontStyles.bigTextStyleBlack}>{getLabel(item)}</Text>
        </View>
      </View>
    );
  }

  getCustomPickerTemplate() {
    const { thisClassInfo, isReadyEnum } = this.state;
    let bgdClr =
      isReadyEnum === "WORKING_ON_IT"
        ? colors.workingOnItColorBrown
        : isReadyEnum === "READY"
        ? colors.green
        : colors.red;
    return (
      <View style={[styles.currentAssignment, { backgroundColor: bgdClr }]}>
        <View style={styles.middleView}>
          <Text style={fontStyles.bigTextStyleBlack}>
            {thisClassInfo.currentAssignmentType
              ? thisClassInfo.currentAssignmentType
              : strings.Memorize}
          </Text>
          <Text
            style={[
              fontStyles.bigTextStyleBlack,
              { paddingTop: screenHeight * 0.04 }
            ]}
          >
            {thisClassInfo.currentAssignment.toUpperCase()}
          </Text>
        </View>
        <View
          style={{
            justifyContent: "flex-start",
            alignItems: "flex-end",
            flexDirection: "row",
            paddingLeft: screenWidth * 0.02
          }}
        >
          <Text style={fontStyles.mainTextStylePrimaryDark}>
            {isReadyEnum === "READY"
              ? strings.Ready
              : isReadyEnum === "WORKING_ON_IT"
              ? strings.WorkingOnIt
              : strings.NeedHelp}
          </Text>
        </View>
      </View>
    );
  }

  updateCurrentAssignmentStatus(value) {
    const { currentClassID, userID } = this.state;
    this.setState({ isReadyEnum: value.value });
    FirebaseFunctions.updateStudentAssignmentStatus(
      currentClassID,
      userID,
      value.value
    );
    if (value.value === "READY") {
      this.setState({ recordingUIVisible: true }, () =>
        this.animateShowAudioUI()
      );
    }
  }

  animateShowAudioUI() {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 1000
      }),
      Animated.timing(opacity, { toValue: 1 })
    ]).start();
  }

  animateHideAudioUI() {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -35,
        duration: 300
      }),
      Animated.timing(opacity, { toValue: 0 })
    ]).start(() => this.setState({ recordingUIVisible: false }));
  }

  renderAudioRecordingUI() {
    const {
      student,
      thisClassInfo,
      isRecording,
      recordingUIVisible
    } = this.state;

    const transformStyle = {
      transform: [{ translateY }],
      opacity: opacityInterpolate,
    };

    return (
      <View>
        {recordingUIVisible && (
          <Animated.View
            style={[
              {
                justifyContent: "center",
                alignItems: "center",
                alignSelf: "center"
              },
              transformStyle
            ]}
          >
            <AudioPlayer
              image={studentImages.images[student.profileImageID]}
              reciter={student.name}
              title={thisClassInfo.currentAssignment}
              isRecordMode={true}
              onStopRecording={recordedFileUri => {
                this.setState({ recordedFileUri: recordedFileUri });
                FirebaseFunctions.uploadAudio(
                  recordedFileUri,
                  this.state.userID
                );
                this.animateHideAudioUI();
              }}
            />
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                alignSelf: "flex-end",
                justifySelf: "align-self"
              }}
            >
              <TouchableText
                text={strings.Cancel}
                disabled={isRecording}
                onPress={() => {
                  this.animateHideAudioUI();
                }}
              />
            </View>
          </Animated.View>
        )}
      </View>
    );
  }

  renderAssignmentsSectionHeader(label, iconName) {
    return (
      <View
        style={{
          alignItems: "center",
          marginLeft: screenWidth * 0.017,
          flexDirection: "row",
          paddingTop: screenHeight * 0.007,
          paddingBottom: screenHeight * 0.019
        }}
      >
        <Icon
          name={iconName}
          type="material-community"
          color={colors.darkGrey}
        />
        <Text
          style={[
            { marginLeft: screenWidth * 0.017 },
            fontStyles.mainTextStyleDarkGrey
          ]}
        >
          {label.toUpperCase()}
        </Text>
      </View>
    );
  }

  renderCurrentAssignmentCard() {
    const { isReadyEnum } = this.state;

    const customPickerOptions = [
      {
        label: strings.WorkingOnIt,
        value: "WORKING_ON_IT",
        color: colors.workingOnItColorBrown
      },
      {
        label: strings.Ready,
        value: "READY",
        color: colors.green
      },
      {
        label: strings.NeedHelp,
        value: "NEED_HELP",
        color: colors.red
      }
    ];

    return (
      <View>
        {this.renderAssignmentsSectionHeader(
          strings.CurrentAssignment,
          "book-open-outline"
        )}

        <CustomPicker
          options={customPickerOptions}
          onValueChange={value => this.updateCurrentAssignmentStatus(value)}
          getLabel={item => item.label}
          optionTemplate={settings =>
            this.getCustomPickerOptionTemplate(settings)
          }
          fieldTemplate={() => this.getCustomPickerTemplate()}
        />
        {this.renderAudioRecordingUI()}
      </View>
    );
  }

  renderEmptyAssignmentCard() {
    return (
      <View
        style={{
          ...styles.middleView,
          backgroundColor: colors.primaryLight
        }}
      >
        <View
          style={{
            flex: 0.5,
            justifyContent: "center",
            alignItems: "center",
            paddingVertical: screenHeight * 0.04
          }}
        >
          <Text style={fontStyles.bigTextStyleBlack}>
            {strings.NoAssignmentsYet}
          </Text>
          <Text style={fontStyles.mainTextStyleBlack}>
            {strings.YouDontHaveAssignments}
          </Text>
          <Text style={fontStyles.bigTextStyleBlack}>{"  "}</Text>
          <Text style={fontStyles.mainTextStylePrimaryDark}>
            {strings.EnjoyYourTime}
          </Text>
        </View>
      </View>
    );
  }

  //-------------------------- render method: Main UI enctry point for the component ------------
  //Renders the screen
  render() {
    const {
      userID,
      isLoading,
      student,
      currentClassID,
      thisClassInfo,
      isReadyEnum,
      currentClass,
      classes,
      isOpen
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

    if (this.state.noCurrentClass) {
      return this.renderEmptyState();
    }

    // show history from oldest to newest
    // todo: this should be managed at db to avoid cost of reversing the list every time we render the screen
    let assignmentHistory = thisClassInfo.assignmentHistory
      ? thisClassInfo.assignmentHistory.reverse()
      : null;

    // UI to show
    return (
      <SideMenu
        onChange={isOpen => {
          this.setState({ isOpen });
        }}
        isOpen={isOpen}
        menu={
          <LeftNavPane
            student={student}
            userID={userID}
            classes={classes}
            edgeHitWidth={0}
            navigation={this.props.navigation}
          />
        }
      >
        <QCView style={screenStyle.container}>
          {this.renderTopView()}
          {thisClassInfo.currentAssignment !== "None"
            ? this.renderCurrentAssignmentCard()
            : this.renderEmptyAssignmentCard()}
          <View>
            <ScrollView>
              {this.renderAssignmentsSectionHeader(
                strings.PastAssignments,
                "history"
              )}
              <FlatList
                data={assignmentHistory}
                keyExtractor={(item, index) => item.name + index}
                renderItem={({ item, index }) => {
                  return this.renderHistoryItem(item, index, thisClassInfo);
                }}
              />
            </ScrollView>
          </View>
        </QCView>
      </SideMenu>
    );
  }
}

//------------------ Component styles ----------------------------
//Styles for the entire container along with the top banner
const styles = StyleSheet.create({
  topView: {
    flexDirection: "column",
    backgroundColor: colors.veryLightGrey
  },
  profileInfoTop: {
    paddingHorizontal: screenWidth * 0.024,
    paddingTop: screenHeight * 0.015,
    flexDirection: "row",
    height: screenHeight * 0.125,
    borderBottomColor: colors.lightGrey,
    borderBottomWidth: 1
  },
  profileInfoTopRight: {
    flexDirection: "column",
    alignItems: "flex-start",
    paddingLeft: screenWidth * 0.075,
    paddingBottom: screenHeight * 0.007
  },
  innerContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.grey
  },
  optionContainer: {
    backgroundColor: colors.grey,
    height: screenHeight * 0.08,
    justifyContent: "center",
    paddingLeft: screenWidth * 0.25
  },
  box: {
    width: screenWidth * 0.049,
    height: screenHeight * 0.03,
    marginRight: screenWidth * 0.024
  },
  profileInfoBottom: {
    flexDirection: "row",
    paddingHorizontal: screenWidth * 0.024,
    borderBottomColor: colors.grey,
    borderBottomWidth: 1
  },
  profilePic: {
    width: screenHeight * 0.1,
    height: screenHeight * 0.1,
    borderRadius: (screenHeight * 0.1) / 2
  },
  currentAssignment: {
    justifyContent: "flex-end",
    height: screenHeight * 0.16,
    borderWidth: 0.5,
    borderColor: colors.grey
  },
  middleView: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: screenHeight * 0.0112
  },
  bottomView: {
    flex: 3,
    backgroundColor: colors.veryLightGrey
  },
  prevAssignmentCard: {
    flexDirection: "column",
    paddingHorizontal: screenWidth * 0.008,
    paddingBottom: screenHeight * 0.019,
    marginBottom: screenHeight * 0.009,
    borderColor: colors.grey,
    borderWidth: screenHeight * 0.13 * 0.0066,
    backgroundColor: colors.white
  },
  profileInfo: {
    flexDirection: "column",
    backgroundColor: colors.white
  },
  corner: {
    borderColor: "#D0D0D0",
    borderWidth: 1,
    borderRadius: 3,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: screenWidth * 0.012,
    marginRight: screenWidth * 0.015,
    marginTop: screenHeight * 0.007
  },
  prevAssignments: {
    flexDirection: "column",
    backgroundColor: colors.veryLightGrey,
    flex: 1
  },
  modal: {
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    height: screenHeight * 0.25,
    width: screenWidth * 0.75,
    borderWidth: screenHeight * 0.003,
    borderRadius: screenHeight * 0.003,
    borderColor: colors.grey,
    shadowColor: colors.darkGrey,
    shadowOffset: { width: 0, height: screenHeight * 0.003 },
    shadowOpacity: 0.8,
    shadowRadius: screenHeight * 0.0045,
    elevation: screenHeight * 0.003
  }
});

export default StudentMainScreen;
