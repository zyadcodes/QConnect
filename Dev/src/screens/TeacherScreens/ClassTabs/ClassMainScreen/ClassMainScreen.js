/* eslint-disable comma-dangle */
import React from "react";
import {
  ScrollView,
  StyleSheet,
  FlatList,
  View,
  Text,
  Image,
  PixelRatio,
  Alert
} from "react-native";
import StudentMultiAssignmentsCard from "components/StudentMultiAssignmentsCard";
import colors from "config/colors";
import studentImages from "config/studentImages";
import LoadingSpinner from "../../../../components/LoadingSpinner";
import strings from "config/strings";
import QcParentScreen from "screens/QcParentScreen";
import QcActionButton from "components/QcActionButton";
import FirebaseFunctions from "config/FirebaseFunctions";
import TopBanner from "components/TopBanner";
import LeftNavPane from "../../LeftNavPane";
import SideMenu from "react-native-side-menu";
import QCView from "components/QCView";
import screenStyle from "config/screenStyle";
import fontStyles from "config/fontStyles";
import { Icon } from "react-native-elements";
import { screenHeight, screenWidth } from "config/dimensions";
import Toast, { DURATION } from "react-native-easy-toast";
import themeStyles from "config/themeStyles";
import ErrorComponent from "components/ErrorComponent";
import { ASSIGNMENT_DELETED } from "utils/consts";
import TouchableText from "components/TouchableText";
import NoClassScreen from "./NoClassScreen";
import EmptyClassScreen from "./EmptyClassScreen";

export class ClassMainScreen extends QcParentScreen {
  state = {
    isLoading: true,
    teacher: "",
    userID: "",
    currentClass: "",
    currentClassID: "",
    classInviteCode: "",
    isOpen: false,
    classes: "",
    isEditing: false,
    titleHasChanged: false
  };

  async componentDidMount() {
    FirebaseFunctions.setCurrentScreen("Class Main Screen", "ClassMainScreen");
    await this.initScreen();
  }

  async initScreen() {
    try {
      const { userID } = this.props.navigation.state.params;
      const teacher = await FirebaseFunctions.getTeacherByID(userID);
      const { currentClassID } = teacher;

      let {
        currentClass,
        showAssignmentSentNotification,
        assignedToAllClass,
        notificationType
      } = this.props.navigation.state.params;

      if (currentClass === undefined) {
        currentClass = await FirebaseFunctions.getClassByID(currentClassID);
      }

      const classInviteCode = currentClass.classInviteCode;
      const classes = await FirebaseFunctions.getClassesByIDs(teacher.classes);
      this.setState({
        isLoading: false,
        teacher,
        userID,
        classInviteCode,
        currentClass,
        currentClassID,
        classes
      });

      if (showAssignmentSentNotification) {
        this.showToast(assignedToAllClass, notificationType);
      }
    } catch (error) {
      this.setState({
        isLoading: false,
        showError: true,
        error:
          "Error initializing teacher's main screen: " + error.toString() ||
          error
      });
      console.log(
        "ERROR_INITIALIZING_TEACHER_MAIN",
        +error.toString() || error
      );
      FirebaseFunctions.logEvent("ERROR_INITIALIZING_TEACHER_MAIN", {
        error,
        trace: +error.toString() || error
      });
    }
  }

  showToast(assignedToAllClass, notificationType) {
    let toastMsg = assignedToAllClass
      ? strings.ClassAssignmentSent
      : strings.AssignmentSent;
    if (notificationType === ASSIGNMENT_DELETED) {
      toastMsg = strings.AssignmentDeleted;
    }
    this.refs.toast.show(toastMsg, DURATION.LENGTH_LONG);
  }

  updateStateWithNewAssignmentInfo(
    newAssignment,
    index,
    currentClass,
    showToast,
    assignedToAllClass,
    notificationType
  ) {
    if (showToast === true) {
      this.showToast(assignedToAllClass, notificationType);
    }

    //re-fetch data
    this.initScreen();
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  onImageSelected(imageId) {
    this.setState({ classImageId: imageId });
    this.setModalVisible(false);
  }

  removeStudent(studentID) {
    Alert.alert(
      strings.RemoveStudent,
      strings.AreYouSureYouWantToRemoveStudent,
      [
        {
          text: strings.Remove,
          onPress: () => {
            //Removes the student from the database and updates the local state
            let { currentClass, currentClassID } = this.state;
            FirebaseFunctions.removeStudent(currentClassID, studentID);
            let arrayOfClassStudents = currentClass.students;
            let indexOfStudent = arrayOfClassStudents.findIndex(student => {
              return student.ID === studentID;
            });
            arrayOfClassStudents.splice(indexOfStudent, 1);
            this.setState({ currentClass });
          }
        },
        { text: strings.Cancel, style: "cancel" }
      ]
    );
  }
  //to write implemntation of the function, updates class name
  updateTitle(newTitle) {
    this.setState({ titleHasChanged: true });
    this.setState({
      currentClass: { ...this.state.currentClass, name: newTitle }
    });
  }
  async updatePicture(newPicture) {
    this.setState({ pictureHasChanged: true });
    this.setState({
      currentClass: { ...this.state.currentClass, classImageID: newPicture }
    });
    await FirebaseFunctions.updateClassObject(this.state.currentClassID, {
      classImageID: newPicture
    });
  }

  //---------------------------
  //render subcomponents
  //----------------------------

  /**
   * ------Overview:
   * The Page will display a message that will redirect the teacher to the
   * add student page if the class does not contain any students.
   *
   * ------Components:
   * We are using a touchable opacity with a large message telling the
   * teacher that there are no students in the class, and a smaller message
   * telling the teacher to click the text to add students.
   *
   * ------Conditonal:
   * The conditional will check to see if the length of the students array is 0,
   * if it is, then there is no students in the class, and thus the class is empty,
   * triggering the message. */
  renderEmptyClass() {
    const {
      teacher,
      userID,
      currentClass,
      currentClassID,
      classInviteCode
    } = this.state;

    return (
      <SideMenu
        isOpen={this.state.isOpen}
        menu={
          <LeftNavPane
            teacher={teacher}
            userID={userID}
            classes={this.state.classes}
            edgeHitWidth={0}
            navigation={this.props.navigation}
          />
        }
      >
        <QCView style={screenStyle.container}>
          <View style={styles.flexWide}>
            <TopBanner
              LeftIconName="navicon"
              LeftOnPress={() => this.setState({ isOpen: true })}
              isEditingTitle={this.state.isEditing}
              isEditingPicture={this.state.isEditing}
              Title={currentClass.name}
              onTitleChanged={newTitle => this.updateTitle(newTitle)}
              onEditingPicture={newPicture => this.updatePicture(newPicture)}
              profileImageID={currentClass.classImageID}
              RightIconName="edit"
              RightOnPress={() =>
                this.props.navigation.push("ShareClassCode", {
                  classInviteCode,
                  currentClassID,
                  userID: this.state.userID,
                  currentClass
                })
              }
            />
          </View>
          <View style={styles.emptyClassStyle}>
            <Text style={fontStyles.hugeTextStylePrimaryDark}>
              {strings.EmptyClass}
            </Text>

            <Image
              source={require("assets/emptyStateIdeas/welcome-girl.png")}
              style={styles.welcomeGirlImageStyle}
            />

            <QcActionButton
              text={strings.AddStudentButton}
              onPress={() =>
                this.props.navigation.push("ShareClassCode", {
                  classInviteCode,
                  currentClassID,
                  userID: this.state.userID,
                  currentClass
                })
              }
            />
          </View>
        </QCView>
      </SideMenu>
    );
  }

  renderTopBanner() {
    const { currentClass } = this.state;
    return (
      <TopBanner
        LeftIconName="navicon"
        LeftOnPress={() => this.setState({ isOpen: true })}
        Title={this.state.currentClass.name}
        RightIconName={this.state.isEditing === false ? "edit" : null}
        RightTextName={this.state.isEditing === true ? strings.Done : null}
        isEditingTitle={this.state.isEditing}
        isEditingPicture={this.state.isEditing}
        onTitleChanged={newTitle => this.updateTitle(newTitle)}
        onEditingPicture={newPicture => this.updatePicture(newPicture)}
        profileImageID={currentClass.classImageID}
        RightOnPress={() => {
          const { isEditing, titleHasChanged } = this.state;
          //node/todo: setting isOpen is a hack to workaround what seems to be a bug in the SideMenu component
          // where flipping isEditing bit seems to flip isOpen as well when isOpen was true earlier
          this.setState({ isEditing: !isEditing, isOpen: false });
          if (this.state.currentClass.name.trim().length === 0) {
            Alert.alert(strings.Whoops, strings.AddText);
          } else {
            if (isEditing && titleHasChanged) {
              FirebaseFunctions.updateClassObject(this.state.currentClassID, {
                name: this.state.currentClass.name
              });
              this.setState({ titleHasChanged: false });
            }

            this.setState({ isEditing: !isEditing });
          }
        }}
      />
    );
  }

  showClassEditHeader() {
    const {
      currentClassID,
      userID,
      classInviteCode,
      currentClass
    } = this.state;

    return (
      <View style={styles.AddStudentButton}>
        <TouchableText
          text={strings.AddStudents}
          onPress={() => {
            //Goes to add students screen
            this.props.navigation.push("ShareClassCode", {
              currentClassID,
              userID,
              classInviteCode,
              currentClass
            });
          }}
          style={styles.touchableTextWithPadding}
        />
      </View>
    );
  }

  //-----------------------------------------------------------------------------------------
  // render main screen
  //-----------------------------------------------------------------------------------------
  render() {
    const {
      isLoading,
      teacher,
      currentClass,
      currentClassID,
      isEditing,
      userID,
      showError,
      error,
      isOpen,
      classes,
      classInviteCode
    } = this.state;

    //----- If there is an error, show the error message
    // this is the screen with the person holding a wire
    // and explaining the error
    //------------------------------------------------
    if (showError === true) {
      return (
        <ErrorComponent
          error={error}
          retry={() => {
            this.setState({ isLoading: true, showError: false });
            this.initScreen();
          }}
        />
      );
    }

    // flag holding whether the teacher didn't add any class yet
    const noClassAddedYet = currentClass === -1 || currentClassID === "";

    // if we are still loading data, show spinner
    if (isLoading === true) {
      return (
        <View style={styles.spinnerContainer}>
          <LoadingSpinner isVisible={true} />
        </View>
      );
    } else if (noClassAddedYet) {
      //---------------------------------
      // if teacher didn't add any class yet, show screen asking them to add a class
      //------------------------------
      return (
        <NoClassScreen
          teacher={teacher}
          userID={userID}
          currentClass={currentClass}
          isEditing={isEditing}
          navigation={this.props.navigation}
        />
      );
    } else if (currentClass.students.length === 0) {
      //---------------------------------
      // if teacher didn't add any class yet, show screen asking them to add a class
      //------------------------------
      return (
        <EmptyClassScreen
          teacher={teacher}
          isOpen={isOpen}
          userID={userID}
          classes={classes}
          navigation={this.props.navigation}
          isEditing={isEditing}
          setIsOpen={flag => {
            this.setState({ isOpen: flag });
          }}
          updateTitle={this.updateTitle}
          updatePicture={this.updatePicture}
          currentClass={currentClass}
          currentClassID={currentClassID}
          classInviteCode={classInviteCode}
        />
      );
    } else {
      //---------------------------------steady state (class has students)---------------------------------
      let {
        studentsNeedHelp,
        studentsReady,
        studentsWorkingOnIt,
        studentsNotStarted,
        studentsWithNoAssignments
      } = this.getStudentsByStatus(currentClass);

      return (
        <SideMenu
          isOpen={this.state.isOpen}
          menu={
            <LeftNavPane
              teacher={teacher}
              userID={userID}
              classes={this.state.classes}
              edgeHitWidth={0}
              navigation={this.props.navigation}
            />
          }
        >
          <Toast
            position={"bottom"}
            ref="toast"
            fadeInDuration={3000}
            positionValue={200}
            style={themeStyles.toastStyle}
          />
          <ScrollView
            bounces={false}
            alwaysBounceVertical={false}
            style={styles.container}
          >
            <View>{this.renderTopBanner()}</View>
            {isEditing && this.showClassEditHeader()}
            {//render students who need help with their assignments
            studentsNeedHelp.length > 0 &&
              this.renderStudentSection(
                strings.NeedHelp,
                "issue-opened",
                "octicon",
                studentsNeedHelp,
                colors.darkRed,
                colors.red
              )}
            {//render students who are ready for tasmee'
            studentsReady.length > 0 &&
              this.renderStudentSection(
                strings.Ready,
                "check-circle-outline",
                "material-community",
                studentsReady,
                colors.darkGreen,
                colors.green
              )}
            {//render section of students who don't have an active assignment yet
            studentsWithNoAssignments.length > 0 &&
              this.renderStudentSection(
                strings.NeedAssignment,
                "pencil-plus-outline",
                "material-community",
                studentsWithNoAssignments,
                colors.primaryDark,
                colors.white
              )}
            {//Remder section of students who haven't started on their homework yet
            studentsNotStarted.length > 0 &&
              this.renderStudentSection(
                strings.NotStarted,
                "bookmark-off-outline",
                "material-community",
                studentsNotStarted,
                colors.primaryDark,
                colors.white
              )}
            {//Remder section of students who haven't started on their homework yet
            studentsWorkingOnIt.length > 0 &&
              this.renderStudentSection(
                strings.WorkingOnIt,
                "update",
                "material-community",
                studentsWorkingOnIt,
                colors.primaryDark,
                colors.white
              )}
          </ScrollView>
        </SideMenu>
      );
    }
  }

  //--------- getStudentsByStatus -----------------------------
  // Returns the list of students classified by their assignment
  // status, ie: ready, no assignment yet, etc..
  //------------------------------------------------------------
  getAssignmentByStatus(currentClass) {
    //studentNeedHelp: students with any assignment with current status === NeedHelp
    let studentsNeedHelp = [];

    //studentsReady: students with any assignment with current status === Ready
    //or for old versions support, student object isReady === true
    let studentsReady = [];

    //studentsWorkingOnIt: students with any assignment with current status === WorkingOnIt
    let studentsWorkingOnIt = [];

    //studentsNotStarted: students with any assignment with current status === NotStarted
    let studentsNotStarted = [];

    //studentsWithNoAssignments: students with empty currentAssignments
    let studentsWithNoAssignments = [];

    currentClass.students.map(student => {
      if (
        student.currentAssignments &&
        student.currentAssignments.some(
          assignment => assignment.isReadyEnum === "NEED_HELP"
        )
      ) {
        studentsNeedHelp.push(student);
      } else if (
        student.currentAssignments.some(
          assignment => assignment.isReadyEnum === "READY"
        ) ||
        (!student.isReadyEnum && student.isReady === true)
      ) {
        studentsReady.push(student);
      } else if (
        student.currentAssignments.some(
          assignment => assignment.isReadyEnum === "WORKING_ON_IT"
        ) ||
        (!student.isReadyEnum && student.isReady === false)
      ) {
        studentsWorkingOnIt.push(student);
      } else if (
        student.currentAssignments &&
        student.currentAssignments.some(
          assignment =>
            assignment.isReadyEnum === "NOT_STARTED" ||
            assignment.isReadyEnum === undefined
        )
      ) {
        studentsNotStarted.push(student);
      } else if (
        !student.currentAssignments ||
        student.currentAssignments.length === 0
      ) {
        studentsWithNoAssignments.push(student);
      }
    });

    return {
      studentsNeedHelp,
      studentsReady,
      studentsWorkingOnIt,
      studentsNotStarted,
      studentsWithNoAssignments
    };
  }
}

//Styles for the entire container along with the top banner
const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    backgroundColor: colors.lightGrey,
    flex: 3
  },
  AddStudentButton: {
    height: screenHeight * 0.04,
    alignItems: "flex-end",
    paddingRight: screenWidth * 0.025
  },
  studentSectionContainer: {
    alignItems: "center",
    marginLeft: screenWidth * 0.017,
    flexDirection: "row",
    paddingTop: screenHeight * 0.025
  },
  emptyClassStyle: {
    flex: 2,
    justifyContent: "flex-start",
    alignItems: "center",
    alignSelf: "center"
  },
  welcomeGirlImageStyle: {
    width: 0.73 * screenWidth,
    height: 0.22 * screenHeight,
    resizeMode: "contain"
  },
  touchableTextWithPadding: {
    ...fontStyles.bigTextStylePrimaryDark,
    paddingTop: 10
  },
  flexWide: { flex: 1, width: screenWidth },
  spinnerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});

export default ClassMainScreen;
