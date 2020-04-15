//This screen will be the main screen that will display for students as a landing page for when they first
//sign up or log in
import React from 'react';
import QcParentScreen from '../QcParentScreen';
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
import Toast, { DURATION } from 'react-native-easy-toast';
import { LineChart } from "react-native-chart-kit";
import CodeInput from 'react-native-confirmation-code-input';
import DailyTracker from 'components/DailyTracker';

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
    studentClassInfo: "",
    modalVisible: false,
    recordingUIVisible: [],
    noCurrentClass: false,
    classCode: "",
    classes: "",
    isRecording: false,
    currentPosition: "0:00",
    classesAttended: 0,
    classesMissed: 0,
    dailyPracticeLog: {
      "2020-04-11": {
        type: strings.Memorization,
      },
      "2020-04-12": {
        type: strings.Revision,
      },
      "2020-04-13": {
        type: strings.Reading,
      }
    }
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
      const studentClassInfo = currentClass.students.find(student => {
        return student.ID === userID;
      });
      const classes = await FirebaseFunctions.getClassesByIDs(student.classes);

      //This constructs an array of the student's past assignments & only includes the "length" field which is how many
      //words that assignment was. The method returns that array which is then passed to the line graph below as the data
      const { assignmentHistory, dailyPracticeLog } = studentClassInfo;
      const data = [];
      for (const assignment of assignmentHistory) {
        if (assignment.assignmentLength && assignment.assignmentLength > 0) {
          data.push(assignment);
        }
      }

      //initialize recordingUIVisible array to have the same number of elements
      // as we have assignments, and initialize each flag to false (do not show any recording UI initially)
      //this flag will be used to show option to record audio when students completes an assignment
      let recordingUIVisible = this.state.studentClassInfo.currentAssignments
        ? this.state.studentClassInfo.currentAssignments.map(
            assignment => false
          )
        : [];

      this.setState({
        student,
        userID,
        currentClass,
        wordsPerAssignmentData: data,
        currentClassID,
        dailyPracticeLog,
        studentClassInfo,
        isLoading: false,
        isOpen: false,
        classes,
        recordingUIVisible,
        classesAttended: studentClassInfo.classesAttended
          ? studentClassInfo.classesAttended
          : 0,
        classesMissed: studentClassInfo.classesMissed
          ? studentClassInfo.classesMissed
          : 0
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
    let { averageRating } = this.state.studentClassInfo;

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
    const { student, userID } = this.state;
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
        <QCView>
          <View>
            <TopBanner
              LeftIconName="navicon"
              LeftOnPress={() => this.setState({ isOpen: true })}
              Title={"Quran Connect"}
            />
          </View>
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              alignSelf: "center"
            }}
          >
            <View style={{ height: 100 }} />
            <Text
              style={[
                fontStyles.hugeTextStyleDarkGrey,
                { textAlign: 'center', alignSelf: 'center' },
              ]}
            >
              {strings.StudentNoClassHeaderMsg}
            </Text>

            <Image
              source={require("assets/emptyStateIdeas/welcome-girl.png")}
              style={{
                width: screenWidth * 0.73,
                height: screenHeight * 0.22,
                resizeMode: "contain"
              }}
            />

            <Text
              style={[
                fontStyles.bigTextStyleDarkGrey,
                { textAlign: 'center', alignSelf: 'center' },
              ]}
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
                      <Image
                        source={require("assets/emptyStateIdeas/welcome-girl2.png")}
                        style={{
                          width: 50,
                          height: 100,
                          resizeMode: "contain",
                          marginTop: 20,
                        }}
                      />
                      <Text
                        style={[
                          fontStyles.mainTextStyleDarkGrey,
                          { marginBottom: 20 },
                        ]}
                      >
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
                      <CodeInput
                        space={2}
                        size={50}
                        codeLength={5}
                        activeColor={colors.primaryDark}
                        inactiveColor={colors.primaryLight}
                        autoFocus={true}
                        inputPosition="center"
                        className="border-circle"
                        containerStyle={{ marginBottom: 60 }}
                        codeInputStyle={{ borderWidth: 1.5 }}
                        onFulfill={code => this.setState({ classCode: code })}
                      />
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between"
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
  renderHistoryItem(item, index, studentClassInfo) {
    return (
      <TouchableOpacity
        onPress={() => {
          //To-Do: Navigates to more specific evaluation for this assignment
          this.props.navigation.push("EvaluationPage", {
            classID: this.state.currentClassID,
            studentID: this.state.userID,
            studentClassInfo: studentClassInfo,
            classStudent: studentClassInfo,
            assignment: item,
            completionDate: item.completionDate,
            rating: item.evaluation.rating,
            notes: item.evaluation.notes,
            improvementAreas: item.evaluation.improvementAreas,
            submission: item.submission,
            userID: this.state.userID,
            evaluationObject: item.evaluation,
            isStudentSide: true,
            evaluationID: item.ID,
            readOnly: true,
            newAssignment: false,
            assignmentName: item.name
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
          {item.submission ? (
            <View style={{ justifyContent: "flex-end", flexDirection: "row" }}>
              <Icon
                name="microphone"
                type="material-community"
                color={colors.darkRed}
              />
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
    const {
      student,
      studentClassInfo,
      currentClass,
      classesAttended,
      classesMissed,
    } = this.state;

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
                  startingValue={studentClassInfo.averageRating}
                  imageSize={25}
                />
                <View
                  style={{
                    flexDirection: "column",
                    justifyContent: "center"
                  }}
                >
                  <Text style={fontStyles.bigTextStyleDarkGrey}>
                    {studentClassInfo.averageRating === 0
                      ? ""
                      : parseFloat(studentClassInfo.averageRating).toFixed(1)}
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
                paddingTop: 10,
                flexDirection: 'row',
                justifyContent: 'flex-start'
              }}
            >
              <Text
                style={[
                  fontStyles.mainTextStyleDarkGrey,
                  { paddingLeft: 5, paddingRight: 10 }
                ]}
              >
                {strings.Attendance}:
              </Text>

              <View style={styles.classesAttended}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "flex-start"
                  }}
                >
                  <Icon
                    name="account-check-outline"
                    type="material-community"
                    color={colors.darkGreen}
                    size={20}
                  />
                  <Text
                    style={[
                      fontStyles.mainTextStyleDarkGreen,
                      { paddingLeft: 5, paddingRight: 10 }
                    ]}
                  >
                    {strings.Attended}
                  </Text>
                  <Text style={[fontStyles.mainTextStyleDarkGreen]}>
                    {classesAttended}
                  </Text>
                </View>
              </View>
              <View style={{ width: 20 }} />
              <View style={styles.classesMissed}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "flex-start"
                  }}
                >
                  <Icon
                    name="account-remove-outline"
                    type="material-community"
                    color={colors.darkRed}
                    size={20}
                  />
                  <Text
                    style={[
                      fontStyles.mainTextStyleDarkRed,
                      { paddingLeft: 5, paddingRight: 10 }
                    ]}
                  >
                    {strings.Missed}
                  </Text>
                  <Text style={[fontStyles.mainTextStyleDarkRed]}>
                    {classesMissed}
                  </Text>
                </View>
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

  getCustomPickerTemplate(item) {
    return (
      <View
        style={{
          flexDirection: 'row',
          paddingLeft: screenWidth * 0.02,
          justifyContent: 'space-between'
        }}
      >
        <Text style={fontStyles.mainTextStylePrimaryDark}>
          {item.isReadyEnum === 'READY' && strings.Ready}
          {item.isReadyEnum === 'WORKING_ON_IT' && strings.WorkingOnIt}
          {item.isReadyEnum === 'NOT_STARTED' && strings.NotStarted}
          {item.isReadyEnum === 'NEED_HELP' && strings.NeedHelp}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            paddingRight: screenWidth * 0.02,
            justifyContent: 'space-between'
          }}
        >
          <Text style={fontStyles.mainTextStylePrimaryDark}>
            {strings.ChangeStatus}
          </Text>
        </View>
      </View>
    );
  }

  updateCurrentAssignmentStatus(value, index) {
    const { currentClassID, studentClassInfo, userID } = this.state;
    let updatedAssignments = studentClassInfo.currentAssignments;
    updatedAssignments[index].isReadyEnum = value;
    this.setState({
      studentClassInfo: {
        ...studentClassInfo,
        currentAssignments: updatedAssignments,
      },
    });

    FirebaseFunctions.updateStudentAssignmentStatus(
      currentClassID,
      userID,
      value,
      index
    );

    let toastMsg =
      value === "NEED_HELP"
        ? strings.TeacherIsNotifiedNeedHelp
        : strings.TeacherIsNotified;

    this.refs.toast.show(toastMsg, DURATION.LENGTH_LONG);

    if (value === 'READY') {
      this.setState(
        { recordingUIVisible: this.setRecUIForAssignmentIndex(index, true) },
        () => this.animateShowAudioUI()
      );
    } else {
      if (this.state.recordingUIVisible[index]) {
        this.animateHideAudioUI();
      }
      this.setState({
        recordingUIVisible: this.setRecUIForAssignmentIndex(index, false),
      });
    }
  }

  setRecUIForAssignmentIndex(assignmentIndex, value) {
    showRecUI = this.state.recordingUIVisible;
    showRecUI[assignmentIndex] = value;
    return showRecUI;
  }

  animateShowAudioUI() {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true
      }),
      Animated.timing(opacity, { toValue: 1, useNativeDriver: true })
    ]).start();
  }

  animateHideAudioUI(index) {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -35,
        duration: 300,
        useNativeDriver: true
      }),
      Animated.timing(opacity, { toValue: 0, useNativeDriver: true })
    ]).start(() =>
      this.setState({
        recordingUIVisible: this.setRecUIForAssignmentIndex(index, false),
      })
    );
  }

  renderAudioRecordingUI(assignmentIndex) {
    const {
      student,
      studentClassInfo,
      userID,
      currentClassID,
      recordingUIVisible
    } = this.state;

    const transformStyle = {
      transform: [{ translateY }],
      opacity: opacityInterpolate,
    };

    return (
      <View>
        <Animated.View
          style={[
            {
              justifyContent: "flex-start",
              alignItems: "center",
              alignSelf: "flex-start"
            },
            transformStyle
          ]}
        >
          <AudioPlayer
            image={studentImages.images[student.profileImageID]}
            reciter={student.name}
            compensateForVerticalMove={true}
            visible={recordingUIVisible[assignmentIndex]}
            title={studentClassInfo.currentAssignments[assignmentIndex].name}
            isRecordMode={true}
            showSendCancel={true}
            onClose={() => {
              this.animateHideAudioUI(assignmentIndex);
            }}
            onSend={recordedFileUri => {
              this.setState({ recordedFileUri: recordedFileUri });
              FirebaseFunctions.submitRecordingAudio(
                recordedFileUri,
                userID,
                currentClassID,
                assignmentIndex
              );
              this.animateHideAudioUI(assignmentIndex);
            }}
          />
        </Animated.View>
      </View>
    );
  }

  renderAssignmentsSectionHeader(label, iconName, desc) {
    return (
      <View style={{
        marginLeft: screenWidth * 0.017,
        paddingTop: screenHeight * 0.005,
        paddingBottom: screenHeight * 0.01
      }}>
      <View
        style={{
          alignItems: "center",
          flexDirection: "row",
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
          {label ? label.toUpperCase() : strings.Assignment}
        </Text>
      </View>
      {desc && <Text style={fontStyles.smallTextStyleDarkGrey}>{desc}</Text>}</View>
    );
  }

  renderCurrentAssignmentCard(item, index) {
    const { studentClassInfo, currentClassID, userID, student } = this.state;
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
      },
      {
        label: strings.NotStarted,
        value: "NOT_STARTED",
        color: colors.primaryVeryLight
      }
    ];

    return (
      <View>
        <View
          style={[
            styles.currentAssignment,
            {
              backgroundColor:
                item.isReadyEnum === 'WORKING_ON_IT'
                  ? colors.workingOnItColorBrown
                  : item.isReadyEnum === 'READY'
                  ? colors.green
                  : item.isReadyEnum === 'NOT_STARTED'
                  ? colors.primaryVeryLight
                  : colors.red,
            },
          ]}
        >
          <TouchableOpacity
            onPress={() => {
              //if the current staus is not started and the student open the mus7af @ assignment
              // change status to "working on it"
              //if (item.isReadyEnum === "NOT_STARTED") {
              this.updateCurrentAssignmentStatus("WORKING_ON_IT", index);
              //}

              this.props.navigation.push("MushafReadingScreen", {
                popOnClose: true,
                isTeacher: false,
                assignToAllClass: false,
                userID: this.props.navigation.state.params.userID,
                classID: currentClassID,
                studentID: userID,
                currentClass: studentClassInfo,
                assignmentLocation: item.location,
                assignmentType: item.type,
                assignmentName: item.name,
                assignmentIndex: index,
                imageID: studentClassInfo.profileImageID,
              });
            }}
          >
            <View>
              <View style={styles.middleView}>
                <Text style={fontStyles.bigTextStyleBlack}>
                  {item.type ? item.type : strings.Memorize}
                </Text>
                <Text
                  style={[
                    fontStyles.bigTextStyleBlack,
                    { paddingTop: screenHeight * 0.04 },
                  ]}
                >
                  {item.name ? item.name.toUpperCase() : 'No Assignment Yet'}
                </Text>
                {item.name && (
                  <Text style={fontStyles.smallTextStylePrimaryDark}>
                    {strings.readInMushaf}
                  </Text>
                )}
              </View>
            </View>
          </TouchableOpacity>

          <CustomPicker
            options={customPickerOptions}
            onValueChange={value =>
              this.updateCurrentAssignmentStatus(value.value, index)
            }
            getLabel={item => item.label}
            optionTemplate={settings =>
              this.getCustomPickerOptionTemplate(settings)
            }
            fieldTemplate={() => this.getCustomPickerTemplate(item)}
          />
        </View>
        {this.renderAudioRecordingUI(index)}
      </View>
    );
  }

  renderCurrentAssignmentCards() {
    return (
      <View>
        {this.renderAssignmentsSectionHeader(
          strings.currentAssignments,
          "book-open-outline"
        )}

        <FlatList
          style={{ flexGrow: 0 }}
          extraData={this.state.studentClassInfo.currentAssignments}
          data={this.state.studentClassInfo.currentAssignments}
          keyExtractor={(item, index) => item.name + index + Math.random() * 10}
          renderItem={({ item, index }) =>
            this.renderCurrentAssignmentCard(item, index)
          }
        />
      </View>
    );
  }

  renderEmptyAssignmentCard() {
    return (
      <View>
        <View
          style={[
            styles.currentAssignment,
            {
              backgroundColor: colors.primaryVeryLight
            }
          ]}
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
            <Text
              style={[
                fontStyles.mainTextStylePrimaryDark,
                { paddingBottom: 30 }
              ]}
            >
              {strings.EnjoyYourTime}
            </Text>
          </View>
        </View>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'flex-start',
            alignSelf: 'center'
          }}
        >
          <Text
            style={[
              fontStyles.bigTextStylePrimaryDark,
              {
                textAlign: "center"
              }
            ]}
          >
            {strings.ReadQuranMotivation}
          </Text>
          <Text
            style={[
              fontStyles.mainTextStyleDarkGrey,
              {
                textAlign: "center"
              }
            ]}
          >
            {strings.ReadQuranMotivationDesc}
          </Text>

          <Image
            source={require('assets/emptyStateIdeas/student-read.png')}
            style={{
              height: 0.16 * screenHeight,
              resizeMode: 'contain'
            }}
          />

          <QcActionButton
            text={strings.OpenMushaf}
            onPress={() => {
              this.props.navigation.push("MushafReadingScreen", {
                popOnClose: true,
                isTeacher: false,
                assignToAllClass: false,
                userID: this.props.navigation.state.params.userID,
                classID: this.state.currentClassID,
                studentID: this.state.userID,
                currentClass: this.state.studentClassInfo,
                imageID: this.state.studentClassInfo.profileImageID,
              });
            }}
          />
        </View>
      </View>
    );
  }

  renderStudentProgressChart() {
    const { wordsPerAssignmentData } = this.state;

    return (
      <View>
        {wordsPerAssignmentData.length > 0 && (
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <Text style={fontStyles.bigTextStyleBlack}>
              {strings.WordsPerAssignment}
            </Text>
            <View style={{ height: screenHeight * 0.0075 }} />
            <LineChart
              data={{
                labels:
                  wordsPerAssignmentData.length > 1
                    ? [
                        wordsPerAssignmentData[0].completionDate.substring(
                          0,
                          wordsPerAssignmentData[0].completionDate.lastIndexOf(
                            '/'
                          )
                        ),
                        wordsPerAssignmentData[
                          wordsPerAssignmentData.length - 1
                        ].completionDate.substring(
                          0,
                          wordsPerAssignmentData[
                            wordsPerAssignmentData.length - 1
                          ].completionDate.lastIndexOf("/")
                        ),
                      ]
                    : [
                        wordsPerAssignmentData[0].completionDate.substring(
                          0,
                          wordsPerAssignmentData[0].completionDate.lastIndexOf(
                            '/'
                          )
                        ),
                      ],
                datasets: [
                  {
                    data: wordsPerAssignmentData.map(
                      data => data.assignmentLength
                    ),
                  },
                ],
              }}
              fromZero={true}
              withInnerLines={false}
              chartConfig={{
                backgroundColor: colors.primaryDark,
                backgroundGradientFrom: colors.lightGrey,
                backgroundGradientTo: colors.primaryDark,
                decimalPlaces: 0,
                color: (opacity = 1) => colors.primaryDark,
                labelColor: (opacity = 1) => colors.black,
                style: {
                  borderRadius: 16,
                },
              }}
              width={screenWidth}
              height={220}
            />
          </View>
        )}
      </View>
    );
  }

  onDatePressed(date) {
    let dailyPracticeLog = {
      ...this.state.dailyPracticeLog,
      [date.dateString]: {
        type: strings.Reading,
      },
    };

    this.setState({
      dailyPracticeLog
    });

    FirebaseFunctions.updateDailyPracticeTracker(
      this.state.currentClassID,
      this.state.userID,
      dailyPracticeLog
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
      studentClassInfo,
      currentClass,
      classes,
      isOpen,
      dailyPracticeLog
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
    let assignmentHistory = studentClassInfo.assignmentHistory
      ? studentClassInfo.assignmentHistory.reverse()
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
        <ScrollView style={screenStyle.container}>
          {this.renderTopView()}
          {this.renderAssignmentsSectionHeader(
            strings.DailyPracticeLog,
            'book-open-outline',
            strings.DailyPracticeLogDec
          )}

          <DailyTracker
            data={dailyPracticeLog}
            onDatePressed={this.onDatePressed.bind(this)}
          />
          {studentClassInfo.currentAssignments &&
          studentClassInfo.currentAssignments.length !== 0
            ? this.renderCurrentAssignmentCards()
            : this.renderEmptyAssignmentCard()}
          <Toast position={"bottom"} ref="toast" />
          <View>
            <ScrollView>
              {this.renderStudentProgressChart()}
              {assignmentHistory &&
                assignmentHistory.length > 0 &&
                this.renderAssignmentsSectionHeader(
                  strings.PastAssignments,
                  "history"
                )}
              <FlatList
                data={assignmentHistory}
                keyExtractor={(item, index) => item.name + index}
                renderItem={({ item, index }) => {
                  return this.renderHistoryItem(item, index, studentClassInfo);
                }}
              />
            </ScrollView>
          </View>
        </ScrollView>
      </SideMenu>
    );
  }
}
//------------------ Component styles ----------------------------
//Styles for the entire container along with the top banner
const styles = StyleSheet.create({
  topView: {
    flexDirection: 'column',
    backgroundColor: colors.veryLightGrey
  },
  profileInfoTop: {
    paddingHorizontal: screenWidth * 0.024,
    paddingTop: screenHeight * 0.015,
    flexDirection: 'row',
    height: screenHeight * 0.125,
    borderBottomColor: colors.lightGrey,
    borderBottomWidth: 1
  },
  profileInfoTopRight: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    paddingLeft: screenWidth * 0.075,
    paddingBottom: screenHeight * 0.007
  },
  innerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.grey
  },
  optionContainer: {
    backgroundColor: colors.grey,
    height: screenHeight * 0.08,
    justifyContent: 'center',
    paddingLeft: screenWidth * 0.25
  },
  box: {
    width: screenWidth * 0.049,
    height: screenHeight * 0.03,
    marginRight: screenWidth * 0.024
  },
  profileInfoBottom: {
    flexDirection: 'row',
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
    justifyContent: 'flex-end',
    height: 150,
    borderWidth: 0.5,
    borderColor: colors.grey,
    marginBottom: 5
  },
  middleView: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: screenHeight * 0.0112
  },
  bottomView: {
    flex: 3,
    backgroundColor: colors.veryLightGrey
  },
  prevAssignmentCard: {
    flexDirection: 'column',
    paddingHorizontal: screenWidth * 0.008,
    paddingBottom: screenHeight * 0.019,
    marginBottom: screenHeight * 0.009,
    borderColor: colors.grey,
    borderWidth: screenHeight * 0.13 * 0.0066,
    backgroundColor: colors.white
  },
  profileInfo: {
    flexDirection: 'column',
    backgroundColor: colors.white
  },
  corner: {
    borderColor: '#D0D0D0',
    borderWidth: 1,
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: screenWidth * 0.012,
    marginRight: screenWidth * 0.015,
    marginTop: screenHeight * 0.007
  },
  prevAssignments: {
    flexDirection: 'column',
    backgroundColor: colors.veryLightGrey,
    flex: 1
  },
  classesAttended: {
    paddingLeft: 5,
    paddingRight: 5,
  },
  classesMissed: {
    paddingRight: 5,
  },
  modal: {
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    height: 300,
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
