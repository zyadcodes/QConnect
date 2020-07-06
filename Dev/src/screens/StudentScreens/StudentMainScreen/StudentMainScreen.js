//This screen will be the main screen that will display for students as a landing page for when they first
//sign up or log in
import React, { useState, useEffect, useRef } from 'react';
import QcParentScreen from '../../QcParentScreen';
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
  Animated,
  TouchableHighlight
} from "react-native";
import styles from './StudentMainScreenStyle'
import { Icon, Avatar, Overlay } from "react-native-elements";
import studentImages from "config/studentImages";
import { Rating } from "react-native-elements";
import colors from "config/colors";
import strings from "config/strings";
import TopBanner from "components/TopBanner/TopBanner";
import FirebaseFunctions from "config/FirebaseFunctions";
import QcActionButton from "components/QcActionButton/QcActionButton";
import LeftNavPane from "../LeftNavPane";
import SideMenu from "react-native-side-menu";
import LoadingSpinner from "components/LoadingSpinner/LoadingSpinner";
import screenStyle from "config/screenStyle";
import fontStyles from "config/fontStyles";
import { screenHeight, screenWidth } from "config/dimensions";
import AudioPlayer from "components/AudioPlayer/AudioPlayer";
import Toast, { DURATION } from 'react-native-easy-toast';
import { LineChart } from "react-native-chart-kit";
import CodeInput from 'react-native-confirmation-code-input';
import DailyTracker, { getTodaysDateString } from 'components/DailyTracker/DailyTracker';
import themeStyles from "config/themeStyles";
import TouchableText from "components/TouchableText/TouchableText";
import QCView from "QCView/QCView";
import { Firebase } from 'react-native-firebase';

const translateY = new Animated.Value(-35);
const opacity = new Animated.Value(0);
const opacityInterpolate = opacity.interpolate({
  inputRange: [0, 0.85, 1],
  outputRange: [0, 0, 1]
});

const StudentMainScreen  = (props) => {
    const [isLoading, setIsLoading] = useState(true)
    const [student, setStudent] = useState("")
    const [sent, setSent] = useState(null)
    const [userID, setUserID] = useState("")
    const [currentClass, setCurrentClass] = useState("")
    const [currentClassID, setCurrentClassID] = useState("")
    const [assignmentHistory, setAssignmentHistory] = useState([])
    const [isOpen, setIsOpen] = useState(false)
    const [studentClassInfo, setStudentClassInfo] = useState("")
    const [modalVisible, setModalVisible] = useState(false)
    const [recordingUIVisible, setRecordingUIVisible] = useState([])
    const [noCurrentClass, setNoCurrentClass] = useState(false)
    const [classCode, setClassCode] = useState("")
    const [wordsPerAssignmentData, setWordsPerAssignmentData] = useState([])
    const [submittedRecordings, setSubmittedRecordings] = useState(null)
    const [classes, setClasses] = useState("")
    const [audioFilePath, setAudioFilePath] = useState("")
    const [isRecording, setIsRecording] = useState(false)
    const [currentPosition, setCurrentPosition] = useState("0:00")
    const [classesAttended, setClassesAttended] = useState(0)
    const [classesMissed, setClassesMissed] = useState(0)
    const [refs, setRefs] = useState({toast: useRef()})
    const [dailyPracticeLog, setDailyPracticeLog] = useState({})
    const [audioPlaybackVisible, setAudioPlaybackVisible] = useState(false)

  //-------------- Component lifecycle methods -----------------------------------
  //Fetches all the values for the state from the firestore database
  useEffect(() => {
    asyncUseEffect()
  }, [])

  const asyncUseEffect = async () => {

    //Sets the screen name in firebase analytics
    FirebaseFunctions.setCurrentScreen(
      "Student Main Screen",
      "StudentMainScreen"
    );

    const { userID, logAsPractice } = props.navigation.state.params;
    const student = await FirebaseFunctions.call('getStudentByID', {studentID: userID});
    const { currentClassID } = student;

    if (currentClassID === "") {
        setIsLoading(false)
        setNoCurrentClass(true)
        setStudent(student)
        setUserID(userID)
        setIsOpen(false)
        setClasses([])
    } else {
      const fetchedData = await Promise.all(
        [
          FirebaseFunctions.call('getClassByID', {
            classID: currentClassID
          }), 
          FirebaseFunctions.call('getStudentWithCurrentAssignmentsByStudentID', {
            classID: currentClassID,
            studentID: userID
          }), 
          FirebaseFunctions.call('getStudentByClassID', {
            classID: currentClassID,
            studentID: userID
          }), 
          FirebaseFunctions.call('getClassesByStudentID', {
            studentID: student.ID
          }), 
          FirebaseFunctions.call('getPracticeLogForStudentByWeek', {
            studentID: userID, 
            classID: currentClassID, 
            day: determineWeekBeginning()
          }), 
          FirebaseFunctions.call('getCompletedAssignmentsByStudentID', {
            classID: currentClassID, studentID: userID, limit: 3
          })
        ]
      )
      const currentClass = fetchedData[0] 
      const currentAssignments = fetchedData[1] 
      const studentClassInfo = fetchedData[2] 
      const classes = fetchedData[3] 

      //This constructs an array of the student's past assignments & only includes the "length" field which is how many
      //words that assignment was. The method returns that array which is then passed to the line graph below as the data
      const dailyPracticeLog = fetchedData[4] 
      let assignmentHistory = fetchedData[5]

      const data = [];
      for (const assignment of assignmentHistory) {
        if (assignment.assignmentLength && assignment.assignmentLength > 0) {
          data.push(assignment);
        }
      }

      //sort chart data from oldest to newest
      data.sort(function(a, b) {
        var dateA = new Date(a.completionDate),
          dateB = new Date(b.completionDate);
        return dateA - dateB;
      });

      //sort assignment history from newest to oldest
      assignmentHistory.sort(function(a, b) {
        var dateA = new Date(a.completionDate),
          dateB = new Date(b.completionDate);
        return dateB - dateA;
      });

      //initialize recordingUIVisible array to have the same number of elements
      // as we have assignments, and initialize each flag to false (do not show any recording UI initially)
      //this flag will be used to show option to record audio when students completes an assignment
      let recordingUIVisible = currentAssignments
        ? currentAssignments.map(assignment => false)
        : [];

      getAudioSubmissions(currentAssignments);


          setStudent(student),
          setUserID(userID),
          setCurrentClass(currentClass),
          setWordsPerAssignmentData(data),
          setCurrentClassID(props.classID)
          setAssignmentHistory(assignmentHistory),
          setDailyPracticeLog(dailyPracticeLog),
          setStudentClassInfo(studentClassInfo),
          setIsLoading(false),
          setIsOpen(false),
          setClasses(classes),
          setRecordingUIVisible(recordingUIVisible),
          setClassesAttended(studentClassInfo.classesAttended
            ? studentClassInfo.classesAttended
            : 0)
          setClassesMissed(studentClassInfo.classesMissed
            ? studentClassInfo.classesMissed
            : 0)
          if (logAsPractice === true) {
            let todaysDate = getTodaysDateString();
            onDatePressed({ dateString: todaysDate }, false);
          }
      }
  }

  //------------------- end of component lifecycle methods ---------------------------
  const determineWeekBeginning = () => {
      let today = new Date();
      let weekBeginning = today.getDate()-today.getDay();
      let str = today.getFullYear()+'-'+today.getMonth()+'-'+weekBeginning
      return str
  }
  const getFormattedDateTimeString = (date) => {
    return `${date.toLocaleDateString(
      'EN-US'
    )}, ${date.getHours()}:${date.getMinutes()}`;
  }
  const getSubmissionFromAssignment = async (assignment) => {
    let { submission } = assignment;
    let audioFile = -1;
    if (submission !== undefined && submission.audioFileID !== undefined) {
      //Fetches audio file for student if one is present
      audioFile = await FirebaseFunctions.call('downloadAudioByAssignmentID', {
        assignmentID: assignment.assignmentID,
        studentID: userID,
        classID: currentClassID
      });

      let sent = getFormattedDateTimeString(submission.sent.toDate());

      return { audioFile, sent };
    } else {
      return undefined;
    }
  }

  const getAudioSubmissions = async (currentAssignments) => {
    if (currentAssignments === undefined) {
      return;
    }

    let submittedRecordings = await Promise.all(
      currentAssignments.map(assignment =>
        getSubmissionFromAssignment(assignment)
      )
    );

     setSubmittedRecordings(submittedRecordings);
  }

  //Joins the class by first testing if this class exists. If the class doesn't exist, then it will
  //alert the user that it does not exist. If the class does exist, then it will join the class, and
  //navigate to the current class screen.
  const joinClass = async () => {
     setIsLoading(true);

    //Tests if the user is already a part of this class and throws an alert if they are
    if (student.classes.includes(classCode)) {
      Alert.alert(strings.Whoops, strings.ClassAlreadyJoined);
       setIsLoading(false);
    } else {
      const didJoinClass = await FirebaseFunctions.call('joinClassByClassInviteCode', {
        studentID: student.ID,
        classInviteCode: classCode
      });
      if (didJoinClass === -1) {
        Alert.alert(strings.Whoops, strings.IncorrectClassCode);
         setIsLoading(false)
         setModalVisible(false);
      } else {
        //Refetches the student object to reflect the updated database
        props.navigation.push("StudentCurrentClass", {
          userID,
        });
      }
    }
  }

  //Returns the correct caption based on the student's average grade
  const getRatingCaption = () => {
    let caption = strings.GetStarted;
    let { averageRating } = studentClassInfo;

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
  const renderEmptyState = () => {
    return (
      <SideMenu
        onChange={isOpen => {
           setIsOpen(isOpen);
        }}
        openMenuOffset={screenWidth * 0.7}
        isOpen={isOpen}
        menu={
          <LeftNavPane
            student={student}
            userID={userID}
            classes={classes}
            edgeHitWidth={0}
            navigation={props.navigation}
          />
        }
      >
        <QCView>
          <View>
            <TopBanner
              LeftIconName="navicon"
              LeftOnPress={() =>  setIsOpen(true)}
              Title={"Quran Connect"}
            />
          </View>
          <View
            style={styles.noClassMsgContainer}
          >
            <View style={styles.noClassMsgView} />
            <Text
              style={[
                fontStyles.hugeTextStyleDarkGrey,
                { textAlign: "center", alignSelf: "center" },
              ]}
            >
              {strings.StudentNoClassHeaderMsg}
            </Text>
            <Text
              style={[
                fontStyles.bigTextStyleDarkGrey,
                { textAlign: "center", alignSelf: "center" },
              ]}
            >
              {strings.HaventJoinedClassYet}
            </Text>

            <Image
              source={require("assets/emptyStateIdeas/welcome-girl.png")}
              style={styles.welcomeGirlImg}
            />

            <Text
              style={[fontStyles.mainTextStyleDarkGrey, { marginBottom: 20 }]}
            >
              {strings.TypeInAClassCode}
            </Text>

            <View style={styles.codeInputView}>
              <CodeInput
                space={2}
                size={50}
                codeLength={5}
                activeColor={colors.primaryDark}
                inactiveColor={colors.primaryLight}
                autoFocus={false}
                blurOnSubmit={false}
                inputPosition="center"
                className="border-circle"
                codeInputStyle={{ borderWidth: 1.5 }}
                onFulfill={code =>  setClassCode(code)}
              />
            </View>

            <QcActionButton
              text={strings.JoinClass}
              onPress={() => joinClass()}
            />
          </View>
        </QCView>
      </SideMenu>
    );
  }

  //renders a past assignment info card
  const renderHistoryItem = (item, index, studentClassInfo) => {
    return (
      <TouchableOpacity
        onPress={() => {
          //To-Do: Navigates to more specific evaluation for this assignment
          props.navigation.push("EvaluationPage", {
            classID: currentClassID,
            studentID: userID,
            studentClassInfo: studentClassInfo,
            classStudent: studentClassInfo,
            assignment: item,
            completionDate: item.completionDate,
            assignmentLocation: item.location,
            rating: item.evaluation.rating,
            notes: item.evaluation.notes,
            improvementAreas: item.evaluation.improvementAreas,
            submission: item.submission,
            userID: userID,
            highlightedWords: item.evaluation.highlightedWords,
            highlightedAyahs: item.evaluation.highlightedAyahs,
            isStudentSide: true,
            evaluationID: item.ID,
            readOnly: true,
            newAssignment: false,
            assignmentName: item.name,
          });
        }}
      >
        <View style={styles.prevAssignmentCard} key={index}>
          <View
            style={styles.prevAssignmentCardFirstView}
          >
            <View
              style={styles.prevAssignmentCardSecondView}
            >
              <Text style={fontStyles.mainTextStylePrimaryDark}>
                {item.completionDate}
              </Text>
            </View>
            <View
              style={styles.assignmentTypeView}
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
                        : colors.darkishGrey,
                  },
                ]}
              >
                {item.assignmentType ? item.assignmentType : strings.Memorize}
              </Text>
            </View>
            <View
              style={styles.ratingView}
            >
              <Rating
                readonly={true}
                startingValue={item.evaluation.rating}
                imageSize={17}
              />
            </View>
          </View>
          <View
            style={styles.assignmentNameView}
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
              style={styles.improvementAreasContainer}
            >
              <Text
                style={[
                  fontStyles.smallTextStyleDarkGrey,
                  { textVerticalAlign: "center", paddingTop: 5 },
                ]}
              >
                {strings.ImprovementAreas}
              </Text>
              {item.evaluation.improvementAreas.map((tag, cnt) => {
                return (
                  <View
                    style={[
                      styles.corner,
                      {
                        flexDirection: "row",
                        backgroundColor: colors.primaryVeryLight,
                      },
                    ]}
                  >
                    <Icon
                      name="tag"
                      size={10}
                      containerStyle={styles.simpleLineIconContainerStyle}
                      style={styles.simpleLineIconStyle}
                      type="simple-line-icon"
                      color={colors.darkGrey}
                    />

                    <Text
                      key={tag}
                      style={[
                        fontStyles.smallTextStyleDarkGrey,
                        { textAlign: "center" },
                      ]}
                    >
                      {tag}
                    </Text>
                  </View>
                );
              })}
            </View>
          ) : (
            <View />
          )}
          {item.submission ? (
            <View style={styles.microphoneIconContainer}>
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

  const renderTopBanner = (className) => {
    return (
      <TopBanner
        LeftIconName="navicon"
        LeftOnPress={() =>  setIsOpen(true)}
        Title={className}
      />
    );
  }

  const renderTopView = () => {
    return (
      <View style={styles.topView}>
        {renderTopBanner(currentClass.name)}
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
                style={styles.studentAverageRatingContainer}
              >
                <Rating
                  readonly={true}
                  startingValue={studentClassInfo.averageRating}
                  imageSize={25}
                />
                <View
                  style={styles.averageRatingTextContainer}
                >
                  <Text style={fontStyles.bigTextStyleDarkGrey}>
                    {studentClassInfo.averageRating === 0
                      ? ""
                      : parseFloat(studentClassInfo.averageRating).toFixed(1)}
                  </Text>
                </View>
              </View>
              <Text style={fontStyles.mainTextStylePrimaryDark}>
                {getRatingCaption()}
              </Text>
            </View>
          </View>
          <View style={styles.profileInfoBottom}>
            <View
              style={styles.attendanceTextContainer}
            >
              <Text
                style={[
                  fontStyles.mainTextStyleDarkGrey,
                  { paddingLeft: 5, paddingRight: 10 },
                ]}
              >
                {strings.Attendance}:
              </Text>

              <View style={styles.classesAttended}>
                <View
                  style={styles.classesAttendedSecondaryView}
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
                      { paddingLeft: 5, paddingRight: 10 },
                    ]}
                  >
                    {strings.Attended}
                  </Text>
                  <Text style={[fontStyles.mainTextStyleDarkGreen]}>
                    {classesAttended}
                  </Text>
                </View>
              </View>
              <View style={styles.attendanceFillerView} />
              <View style={styles.classesMissed}>
                <View
                  style={styles.classesMissedSecondaryContainer}
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
                      { paddingLeft: 5, paddingRight: 10 },
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

  const getCustomPickerOptionTemplate = (settings) => {
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

  const getCustomPickerTemplate = (item) => {
    return (
      <View
        style={styles.isReadyEnumContainer}
      >
        <Text style={fontStyles.mainTextStylePrimaryDark}>
          {item.isReadyEnum === "READY" && strings.Ready}
          {item.isReadyEnum === "WORKING_ON_IT" && strings.WorkingOnIt}
          {item.isReadyEnum === "NOT_STARTED" && strings.NotStarted}
          {item.isReadyEnum === "NEED_HELP" && strings.NeedHelp}
        </Text>
        <View
          style={styles.changeStatusContainer}
        >
          <Text style={fontStyles.mainTextStylePrimaryDark}>
            {strings.ChangeStatus}
          </Text>
        </View>
      </View>
    );
  }

  const updateCurrentAssignmentStatus = (value, index) => {
    let updatedAssignments = studentClassInfo.currentAssignments;
    updatedAssignments[index].isReadyEnum = value;
      setStudentClassInfo({
        ...studentClassInfo,
        currentAssignments: updatedAssignments,
      })

    FirebaseFunctions.call('updateAssignmentByAssignmentID', {
      classID: currentClassID,
      studentID: userID,
      updates: value,
      assignmentID: updatedAssignments[index].assignmentID
    });

    let toastMsg =
      value === "NEED_HELP"
        ? strings.TeacherIsNotifiedNeedHelp
        : strings.TeacherIsNotified;
    
    if (value !== "NOT_STARTED") {
      refs.toast.show(toastMsg, DURATION.LENGTH_LONG);
    }

    if (value === "READY") {
      setRecordingUIVisible(setRecUIForAssignmentIndex(index, true))
      animateShowAudioUI()
    } else {
      if (recordingUIVisible[index]) {
        animateHideAudioUI();
      }  
      setRecordingUIVisible(setRecUIForAssignmentIndex(index, false))
    }
  }

  const setRecUIForAssignmentIndex = (assignmentIndex, value) => {
    let showRecUI = recordingUIVisible;
    showRecUI[assignmentIndex] = value;
    return showRecUI;
  }

  const animateShowAudioUI = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, { toValue: 1, useNativeDriver: true }),
    ]).start();
  }

  const animateHideAudioUI = (index) => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -35,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, { toValue: 0, useNativeDriver: true }),
    ]).start(() =>
        setRecordingUIVisible(setRecUIForAssignmentIndex(index, false))
    )
  }

  //checks if user recorded an audio tasmee3 while this screen was mounted.
  // this checks local state rather than reads older data from server.
  // this logic to handle the case when a student presses on recording to send
  // we want to show the microphone icon right away and allow her/him to listen and re-record
  // without waiting for data to go up and down from the server.
  const isNewRecordingJustSent = () => {
    return audioFilePath;
  }

  //check if there was an audio recording submitted by student for this assignment
  // checks from the server data
  const getOlderSubmissionIfAvailable = (assignmentIndex) => {
    let audioFilePath;
    let sent;
    if (assignmentHasAudioSubmission(assignmentIndex)) {
      audioFilePath = submittedRecordings[assignmentIndex].audioFile;
      sent = submittedRecordings[assignmentIndex].sent;
    }
    //if this assignment has an audio recording submitted, return it.
    if (audioFilePath) {
      return { audioFilePath, sent };
    }
    //otherwise return undefined.
    return undefined;
  }

  //true if either a recording exists for this assignment
  // either sent now (during this session), or loaded from the server
  const recordingExistsForAssignment = (assignmentIndex) => {
    return (
      isNewRecordingJustSent(assignmentIndex) ||
      assignmentHasAudioSubmission(assignmentIndex)
    );
  }

  const renderAudioRecordingUI = (assignmentIndex) => {
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
            transformStyle,
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
            hideCancel={false}
            onClose={() => {
              animateHideAudioUI(assignmentIndex);
            }}
            onSend={(recordedFileUri, localPath) => {
              let sent = getFormattedDateTimeString(new Date());
              setAudioFilePath(localPath)
              setSent(sent) 

              FirebaseFunctions.submitRecordingAudio(
                recordedFileUri,
                userID,
                currentClassID,
                assignmentIndex
              );
              refs.toast.show(strings.RecordingSent, DURATION.LENGTH_LONG);
              animateHideAudioUI(assignmentIndex);
            }}
          />
        </Animated.View>
      </View>
    );
  }

  const getSubmittedRecording = (assignmentIndex) => {
    //if no recording was submitted during this UI session, let's check if we have one from the server
    if (audioFilePath === undefined) {
      //we only use the audio file specified we read from the server if the user has not re-recorded a new one
      // the new one will be saved under audioFilePath. So we only
      let submissionInfo = getOlderSubmissionIfAvailable(assignmentIndex);
      if (submissionInfo !== undefined) {
        audioFilePath = submissionInfo.audioFilePath;
        sent = submissionInfo.sent;
      }
    }
    if (audioFilePath !== undefined) {
      return { audioFilePath, sent };
    } else {
      return undefined;
    }
  }

  const toggleOverlay = () => {
     setAudioPlaybackVisible(!audioPlaybackVisible);
  }

  const renderAudioPlaybackUI = (assignmentIndex) => {
    let submittedAudio = getSubmittedRecording(assignmentIndex);
    if (submittedAudio === undefined) {
      return undefined;
    }

    return (
      <Overlay
        isVisible={audioPlaybackVisible}
        onBackdropPress={toggleOverlay.bind(this)}
        overlayStyle={{ width: screenWidth * 0.9, height: 150 }}
      >
        <View
          style={styles.sendRecitationRecordingTextContainer}
        >
          <Text style={fontStyles.bigTextStylePrimaryDark}>
            Sent Recitation Recording
          </Text>
        </View>

        <AudioPlayer
          visible={true}
          compensateForVerticalMove={true}
          image={studentImages.images[student.profileImageID]}
          reciter={student.name}
          title={studentClassInfo.currentAssignments[assignmentIndex].name}
          audioFilePath={submittedAudio.audioFilePath}
          hideCancel={true}
          sent={submittedAudio.sent}
        />
        <View
          style={styles.resendRecordingContainer}
        >
          <TouchableText
            text="Re-send a new recording"
            onPress={() => {
              toggleOverlay();
                setRecordingUIVisible(setRecUIForAssignmentIndex(
                  assignmentIndex,
                  true
                ))
                animateShowAudioUI()
            }}
          />
        </View>
      </Overlay>
    );
  }

  const renderStatusAvatars = (currentStatus, assignmentIndex) => {
    let statusAvatarsConfig = [];
    statusAvatarsConfig.READY = {
      name: strings.ReadyNonCap,
      iconName: "check",
      iconType: "material-community",
      innerColor: colors.darkGreen,
      outerColor: colors.green,
    };
    statusAvatarsConfig.WORKING_ON_IT = {
      name: strings.WorkingOnItNonCap,
      iconName: "update",
      iconType: "material-community",
      innerColor: colors.primaryDark,
      outerColor: colors.primaryLight,
    };
    statusAvatarsConfig.NEED_HELP = {
      name: strings.NeedHelpNonCap,
      iconName: "issue-opened",
      iconType: "octicon",
      innerColor: colors.darkRed,
      outerColor: colors.red,
    };
    statusAvatarsConfig.NOT_STARTED = {
      name: strings.NotStartedNonCap,
      iconName: "bookmark-off-outline",
      iconType: "material-community",
      innerColor: colors.darkGrey,
      outerColor: colors.grey,
    };

    let statusKeys = ["NOT_STARTED", "WORKING_ON_IT", "NEED_HELP", "READY"];

    return (
      <View
        style={styles.statusContainer}
      >
        <View
          style={styles.statusSecondaryContainer}
        >
          <Text
            style={[
              fontStyles.mainTextStyleDarkGrey,
              { textAlign: "center", textVerticalAlign: "center" },
            ]}
          >
            {strings.Status}
          </Text>
        </View>
        {statusKeys.map(statusKey => {
          return (
            <TouchableOpacity
              onPress={() =>
                updateCurrentAssignmentStatus(statusKey, assignmentIndex)
              }
              style={styles.updateCurrentAssignmentTouchable}
            >
              <View
                style={[
                  {
                    justifyContent: "center",
                    alignItems: "center",
                    width: 40,
                    marginHorizontal: 15,
                  },
                  statusKey !== currentStatus ? { opacity: 0.5 } : {},
                ]}
              >
                <Avatar
                  rounded
                  size={statusKey === currentStatus ? 30 : 25}
                  icon={{
                    name: statusAvatarsConfig[statusKey].iconName,
                    type: statusAvatarsConfig[statusKey].iconType,
                    color: colors.white,
                  }}
                  overlayContainerStyle={{
                    backgroundColor: statusAvatarsConfig[statusKey].innerColor,
                  }}
                />
                <Text
                  style={[
                    statusKey !== currentStatus
                      ? fontStyles.smallestTextStyleDarkGrey
                      : fontStyles.smallTextStyleDarkGrey,
                    {
                      width: 100,
                      textAlign: "center",
                      paddingTop: 3,
                      color: statusAvatarsConfig[statusKey].innerColor,
                    },
                  ]}
                >
                  {statusAvatarsConfig[statusKey].name}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }

  const renderAssignmentsSectionHeader = (label, iconName, desc) => {
    return (
      <View
        style={styles.assignmentSectionHeaderContainer}
      >
        <View
          style={styles.assignmentSectionHeaderSecondaryContainer}
        >
          <Icon
            name={iconName}
            type="material-community"
            color={colors.darkGrey}
          />
          <Text
            style={[
              { marginLeft: screenWidth * 0.017 },
              fontStyles.mainTextStyleDarkGrey,
            ]}
          >
            {label ? label.toUpperCase() : strings.Assignment}
          </Text>
        </View>
        {desc && <Text style={fontStyles.smallTextStyleDarkGrey}>{desc}</Text>}
      </View>
    );
  }

  const assignmentHasAudioSubmission = (assignmentIndex) => {
    return (
      submittedRecordings &&
      submittedRecordings.length > 0 &&
      submittedRecordings[assignmentIndex] &&
      submittedRecordings[assignmentIndex].audioFile !== undefined
    );
  }

  const renderCurrentAssignmentCard = (item, index) => {
    return (
      <View>
        <View
          style={[
            styles.currentAssignment,
            {
              backgroundColor:
                item.isReadyEnum === "WORKING_ON_IT"
                  ? colors.workingOnItColorBrown
                  : item.isReadyEnum === "READY"
                  ? colors.green
                  : item.isReadyEnum === "NOT_STARTED"
                  ? colors.primaryVeryLight
                  : colors.red,
            },
          ]}
        >
          <View>
            {assignmentHasAudioSubmission(index) ? (
              <View
                style={styles.microphoneIconContainerIfAssignmentSubmitted}
              >
                <TouchableOpacity onPress={toggleOverlay.bind(this)}>
                  <Icon
                    name="microphone"
                    type="material-community"
                    color={colors.darkRed}
                  />
                </TouchableOpacity>
              </View>
            ) : (
              <View />
            )}

            <View style={styles.middleView}>
              <Text style={fontStyles.mainTextStyleBlack}>
                {item.type ? item.type : strings.Memorize}
              </Text>
              <Text style={[fontStyles.bigTextStyleBlack]}>
                {item.name ? item.name.toUpperCase() : "No Assignment Yet"}
              </Text>
            </View>
          </View>

          <View style={styles.statusAvatarPrimaryContainer}>
            <View style={styles.statusAvatarSecondaryContainer}>
              {renderStatusAvatars(item.isReadyEnum, index)}
            </View>
          </View>
          <View>
            <View
              style={styles.updateCurrentAssignmentTouchableContainer}
            >
              <TouchableHighlight
                style={styles.cardButtonStyle}
                onPress={() =>
                  updateCurrentAssignmentStatus(strings.Ready, index)
                }
              >
                <View
                  style={styles.checkIconContainer}
                >
                  <Icon name="check" color={colors.primaryDark} size={15} />
                  <Text
                    style={[
                      fontStyles.mainTextStylePrimaryDark,
                      { paddingLeft: 5 },
                    ]}
                  >
                    {strings.CompleteAssignment}
                  </Text>
                </View>
              </TouchableHighlight>
              <TouchableHighlight
                style={styles.cardButtonStyle}
                onPress={() => {
                  //if the current staus is not started and the student open the mus7af @ assignment
                  // change status to "working on it"
                  //if (item.isReadyEnum === "NOT_STARTED") {
                  updateCurrentAssignmentStatus("WORKING_ON_IT", index);
                  //}

                  props.navigation.push("MushafReadingScreen", {
                    popOnClose: true,
                    isTeacher: false,
                    assignToAllClass: false,
                    userID: props.navigation.state.params.userID,
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
                <View style={styles.openBookIconContainer}>
                  <Icon
                    name="open-book"
                    type="entypo"
                    color={colors.primaryDark}
                    size={15}
                  />
                  <Text
                    style={[
                      fontStyles.mainTextStylePrimaryDark,
                      { paddingLeft: 5 },
                    ]}
                  >
                    {strings.OpenAssignment}
                  </Text>
                </View>
              </TouchableHighlight>
            </View>
          </View>
        </View>
        {renderAudioRecordingUI(index)}
        {renderAudioPlaybackUI(index)}
      </View>
    );
  }

  const renderCurrentAssignmentCards = () => {
    return (
      <View>
        {renderAssignmentsSectionHeader(
          strings.currentAssignments,
          "book-open-outline"
        )}

        <FlatList
          style={styles.assignmentCardsFlatList}
          extraData={studentClassInfo.currentAssignments}
          data={studentClassInfo.currentAssignments}
          keyExtractor={(item, index) => item.name + index + Math.random() * 10}
          renderItem={({ item, index }) =>
            renderCurrentAssignmentCard(item, index)
          }
        />
      </View>
    );
  }

  const renderEmptyAssignmentCard = () => {
    return (
      <View>
        <View
          style={[
            styles.currentAssignment,
            {
              backgroundColor: colors.primaryVeryLight,
            },
          ]}
        >
          <View
            style={styles.noAssignmentsTextContainer}
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
                { paddingBottom: 30 },
              ]}
            >
              {strings.EnjoyYourTime}
            </Text>
          </View>
        </View>
        <View
          style={styles.readQuranMotivationContainer}
        >
          <Text
            style={[
              fontStyles.bigTextStylePrimaryDark,
              {
                textAlign: "center"
              },
            ]}
          >
            {strings.ReadQuranMotivation}
          </Text>
          <Text
            style={[
              fontStyles.mainTextStyleDarkGrey,
              {
                textAlign: "center"
              },
            ]}
          >
            {strings.ReadQuranMotivationDesc}
          </Text>

          <Image
            source={require("assets/emptyStateIdeas/student-read.png")}
            style={styles.studentReadingImage}
          />

          <QcActionButton
            text={strings.OpenMushaf}
            onPress={async () => {
               setIsLoading(true)

              props.navigation.push("MushafReadingScreen", {
                popOnClose: true,
                isTeacher: false,
                assignToAllClass: false,
                userID: props.navigation.state.params.userID,
                classID: currentClassID,
                studentID: userID,
                currentClass: studentClassInfo,
                imageID: studentClassInfo.profileImageID,
              });
            }}
          />
        </View>
      </View>
    );
  }

  const renderStudentProgressChart = () => {
    let sum = 0;
    return (
      <View>
        {wordsPerAssignmentData.length > 0 && (
          <View style={styles.wordsPerAssignmentContainer}>
            <Text style={fontStyles.bigTextStyleBlack}>
              {strings.WordsPerAssignment}
            </Text>
            <View style={styles.wordsPerAssignmentFiller} />
            <LineChart
              data={{
                labels:
                  wordsPerAssignmentData.length > 1
                    ? [
                        wordsPerAssignmentData[0].completionDate.substring(
                          0,
                          wordsPerAssignmentData[0].completionDate.lastIndexOf(
                            "/"
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
                            "/"
                          )
                        ),
                      ],
                datasets: [
                  {
                    data: wordsPerAssignmentData.map(data => {
                      sum += data.assignmentLength;
                      return sum;
                    }),
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
              height={170}
            />
          </View>
        )}
      </View>
    );
  }

  const onDatePressed = (date, untoggleAction) => {
    let dailyPracticeLog = dailyPracticeLog;

    if (untoggleAction) {
      delete dailyPracticeLog[date.dateString];
    } else {
      dailyPracticeLog = {
        ...dailyPracticeLog,
        [date.dateString]: {
          type: strings.Reading,
        },
      };
    }

    //we only send notification if user toggled a new day
    let sendNotifications = !untoggleAction;
    FirebaseFunctions.call('addPracticeLogForStudentByWeek', {
      classID: currentClassID,
      studentID: userID,
      practiceLog: dailyPracticeLog,
      day: determineWeekBeginning()
    });

    setDailyPracticeLog(dailyPracticeLog)
  }
  //-------------------------- render method: Main UI entry point for the component ------------
  //Renders the screen

    if (isLoading === true) {
      return (
        <View
          style={styles.loadingSpinnerContainer}
        >
          <LoadingSpinner isVisible={true} />
        </View>
      );
    }

    if (noCurrentClass) {
      return renderEmptyState();
    }

    // UI to show
    return (
      <SideMenu
        onChange={isOpen => {
           setIsOpen(isOpen)
        }}
        isOpen={isOpen}
        menu={
          <LeftNavPane
            student={student}
            userID={userID}
            classes={classes}
            edgeHitWidth={0}
            navigation={props.navigation}
          />
        }
      >
        <Toast
          position={"bottom"}
          ref={refs.toast}
          fadeInDuration={3000}
          positionValue={100}
          style={themeStyles.toastStyle}
        />
        <ScrollView style={screenStyle.container}>
          {renderTopView()}
          {renderAssignmentsSectionHeader(
            strings.DailyPracticeLog,
            "calendar-check-outline",
            strings.DailyPracticeLogDec
          )}

          <DailyTracker
            data={dailyPracticeLog}
            onDatePressed={onDatePressed.bind(this)}
          />
          {studentClassInfo.currentAssignments &&
          studentClassInfo.currentAssignments.length !== 0
            ? renderCurrentAssignmentCards()
            : renderEmptyAssignmentCard()}
          <View>
            <ScrollView>
              {renderStudentProgressChart()}
              {assignmentHistory &&
                assignmentHistory.length > 0 &&
                renderAssignmentsSectionHeader(
                  strings.PastAssignments,
                  "history"
                )}
              <FlatList
                data={assignmentHistory}
                keyExtractor={(item, index) => item.name + index}
                renderItem={({ item, index }) => {
                  return renderHistoryItem(item, index, studentClassInfo);
                }}
              />
            </ScrollView>
          </View>
        </ScrollView>
      </SideMenu>
    );
}
//------------------ Component styles ----------------------------
//Styles for the entire container along with the top banner

export default StudentMainScreen;
