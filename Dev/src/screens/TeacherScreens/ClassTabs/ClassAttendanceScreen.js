import React from 'react';
import _ from 'lodash';
import {
  ScrollView,
  StyleSheet,
  View,
  Image,
  Text,
  Dimensions,
  Alert,
} from 'react-native';
import Toast, { DURATION } from 'react-native-easy-toast';
import StudentCard from 'components/StudentCard';
import QcActionButton from 'components/QcActionButton';
import colors from 'config/colors';
import studentImages from 'config/studentImages';
import strings from 'config/strings';
import QcParentScreen from 'screens/QcParentScreen';
import FirebaseFunctions from 'config/FirebaseFunctions';
import LoadingSpinner from 'components/LoadingSpinner';
import LeftNavPane from '../LeftNavPane';
import TopBanner from 'components/TopBanner';
import SideMenu from 'react-native-side-menu';
import QCView from 'components/QCView';
import screenStyle from 'config/screenStyle';
import { screenHeight, screenWidth } from 'config/dimensions';
import fontStyles from 'config/fontStyles';
import DailyTracker from 'components/DailyTracker';
import moment from 'moment';
import { Icon } from 'react-native-elements';

export class ClassAttendanceScreen extends QcParentScreen {
  state = {
    isLoading: true,
    currentClass: '',
    currentClassID: '',
    students: '',
    userID: '',
    teacher: '',
    absentStudents: [],
    selectedDate: new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }),
    classes: '',
    isOpen: false,
    classInviteCode: '',
    attendanceHistory: {},
    //passed in as a key to the calendar view
    // incremented when attendance record is saved to force
    // calendar to re-render and reflect the newly saved changes
    // as the view re-renders when its key changes.
    calendarRefreshCnt: 0
  };

  //Sets the screen name for firebase analytics and gets the initial students
  async componentDidMount() {
    FirebaseFunctions.setCurrentScreen(
      'Class Attendance Screen',
      'ClassAttendanceScreen'
    );

    const { userID } = this.props.navigation.state.params;
    const teacher = await FirebaseFunctions.getTeacherByID(userID);
    const classes = await FirebaseFunctions.getClassesByIDs(teacher.classes);
    const { currentClassID } = teacher;
    const currentClass = await FirebaseFunctions.getClassByID(currentClassID);
    const { students } = currentClass;
    const { selectedDate } = this.state;

    const {
      absentStudents,
      presentStudents,
    } = await FirebaseFunctions.getStudentsAttendanceStatusByDate(
      selectedDate,
      currentClassID
    );

    const classInviteCode = currentClass.classInviteCode;
    this.populateClassAttendanceHistory(students);

    this.setState({
      isLoading: false,
      currentClass,
      currentClassID,
      students,
      absentStudents,
      presentStudents,
      classInviteCode,
      userID,
      teacher,
      classes,
    });
  }

  async populateClassAttendanceHistory(students) {
    if (students === undefined || students.length === 0) {
      return;
    }

    let attendanceHistory = {};
    students.forEach(student => {
      if (!attendanceHistory) {
        return;
      }
      Object.entries(student.attendanceHistory).map(entry => {
        //first element of the entry is the key, which is for us holds the date.
        //second element is whether the student is present;
        let date = entry[0];
        let isPresent = entry[1];

        //format string in the format expected by the date picker
        let dateString = moment(date).format('YYYY-MM-DD');

        //build the sub-object path
        let path = dateString;
        if (isPresent) {
          path += ".present";
        } else {
          path += ".absent";
        }

        _.update(attendanceHistory, path, function(n) {
          if (n === undefined) {
            return 1;
          } else {
            return n + 1;
          }
        });
      });
    });

    this.setState({ attendanceHistory });
  }

  //This method will set the student selected property to the opposite of whatever it was
  //by either removing the student or adding them to the array of selected students
  //based on if they are already in the array or not
  onStudentSelected(id) {
    let tmp = this.state.absentStudents;

    if (tmp.includes(id)) {
      tmp.splice(tmp.indexOf(id), 1);
    } else {
      tmp.push(id);
    }

    let presentStudents = this.state.students
      .filter(student => !this.state.absentStudents.includes(student.ID))
      .map(student => student.ID);

    this.setState({
      absentStudents: tmp,
      presentStudents,
      selectedDate: this.state.selectedDate,
    });
  }

  //fetches the current selected students and the current selected date and adds the current
  //attendance to the database
  async saveAttendance() {
    let { absentStudents, selectedDate, students, currentClassID } = this.state;
    let updatedHistory = this.state.attendanceHistory;

    let date = selectedDate;
    let presentStudents = students
      .filter(student => !absentStudents.includes(student.ID))
      .map(student => student.ID);

    //format string in the format expected by the date picker
    let dateString = moment(date).format('YYYY-MM-DD');
    let path = dateString;
    path += ".absent";
    _.update(updatedHistory, path, function(n) {
      return absentStudents.length;
    });

    //now update the number of present students
    path = dateString;
    path += ".present";
    _.update(updatedHistory, path, function(n) {
      return presentStudents.length;
    });

    this.setState(oldState => {
      return {
        attendanceHistory: updatedHistory,
        presentStudents,
        calendarRefreshCnt: oldState.calendarRefreshCnt + 1,
      };
    });

    await FirebaseFunctions.saveAttendanceForClass(
      absentStudents,
      selectedDate,
      currentClassID
    );
    this.refs.toast.show(
      strings.AttendanceFor + selectedDate + strings.HasBeenSaved,
      DURATION.LENGTH_SHORT
    );
  }

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
      classInviteCode,
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
          <View style={{ flex: 1, width: screenWidth }}>
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
                this.props.navigation.push('ShareClassCode', {
                  classInviteCode,
                  currentClassID,
                  userID: this.state.userID,
                  currentClass,
                })
              }
            />
          </View>
          <View
            style={{
              flex: 2,
              justifyContent: 'flex-start',
              alignItems: 'center',
              alignSelf: 'center'
            }}
          >
            <Text style={fontStyles.hugeTextStylePrimaryDark}>
              {strings.EmptyClass}
            </Text>

            <Image
              source={require('assets/emptyStateIdeas/welcome-girl.png')}
              style={{
                width: 0.73 * screenWidth,
                height: 0.22 * screenHeight,
                resizeMode: 'contain'
              }}
            />

            <QcActionButton
              text={strings.AddStudentButton}
              onPress={() =>
                this.props.navigation.push('ShareClassCode', {
                  classInviteCode,
                  currentClassID,
                  userID: this.state.userID,
                  currentClass,
                })
              }
            />
          </View>
        </QCView>
      </SideMenu>
    );
  }

  render() {
    if (this.state.isLoading === true) {
      return (
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <LoadingSpinner isVisible={true} />
        </View>
      );
    }

    //If the class doesn't currently have students
    if (this.state.currentClass.students.length === 0) {
      return this.renderEmptyClass();
    }

    let dateString = moment(this.state.selectedDate).format('YYYY-MM-DD');
    let absentCnt = this.state.absentStudents
      ? this.state.absentStudents.length
      : 0;
    let presentCnt = this.state.presentStudents
      ? this.state.presentStudents.length
      : 0;

    return (
      //The scroll view will have at the top a date picker which will be defaulted to the current
      //date and it will allow the user to view previous day's attendance along with setting
      //and changing them. The max possible date will be the current date.
      <SideMenu
        isOpen={this.state.isOpen}
        menu={
          <LeftNavPane
            teacher={this.state.teacher}
            userID={this.state.userID}
            classes={this.state.classes}
            edgeHitWidth={0}
            navigation={this.props.navigation}
          />
        }
      >
        <QCView style={screenStyle.container}>
          <ScrollView>
            <View style={{ flex: 1, width: screenWidth }}>
              <TopBanner
                LeftIconName="navicon"
                LeftOnPress={() => this.setState({ isOpen: true })}
                Title={this.state.currentClass.name}
              />
            </View>
            <View
              style={styles.saveAttendance}
              key={'' + this.state.calendarRefreshCnt}
            >
              <DailyTracker
                data={{
                  [dateString]: { type: 'attendance' },
                  ...this.state.attendanceHistory,
                }}
                selectedDate={dateString}
                trackingMode={false}
                onDatePressed={async date => {
                  let formattedDate = moment(date.dateString).format(
                    "MM/DD/YYYY"
                  );
                  this.setState({
                    selectedDate: formattedDate,
                    isLoading: true,
                  });
                  const {
                    absentStudents,
                    presentStudents,
                  } = await FirebaseFunctions.getStudentsAttendanceStatusByDate(
                    formattedDate,
                    this.state.currentClassID
                  );
                  this.setState({
                    isLoading: false,
                    absentStudents,
                    presentStudents,
                  });
                }}
              />
              <QcActionButton
                text={strings.SaveAttendance}
                onPress={() => this.saveAttendance()}
                style={{ paddingRight: 0.073 * screenWidth }}
                screen={this.name}
              />
            </View>
            {(absentCnt !== 0 || presentCnt !== 0) && (
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
                    { paddingLeft: 5, paddingRight: 10 },
                  ]}
                >
                  {strings.Attendance}:
                </Text>

                <View style={styles.present}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'flex-start'
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
                        { paddingLeft: 5, paddingRight: 10 },
                      ]}
                    >
                      {strings.Present}
                    </Text>
                    <Text style={[fontStyles.mainTextStyleDarkGreen]}>
                      {presentCnt}
                    </Text>
                  </View>
                </View>
                <View style={{ width: 20 }} />
                <View style={styles.absent}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'flex-start'
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
                        { paddingLeft: 5, paddingRight: 10 },
                      ]}
                    >
                      {strings.Absent}
                    </Text>
                    <Text style={[fontStyles.mainTextStyleDarkRed]}>
                      {absentCnt}
                    </Text>
                  </View>
                </View>
              </View>
            )}

            {this.state.students.map(student => {
              let color = this.state.absentStudents.includes(student.ID)
                ? colors.red
                : colors.green;
              let attendanceCaption = this.state.absentStudents.includes(
                student.ID
              )
                ? strings.Absent
                : strings.Present;
              return (
                <StudentCard
                  key={student.ID}
                  studentName={student.name}
                  currentAssignment={attendanceCaption}
                  profilePic={studentImages.images[student.profileImageID]}
                  background={color}
                  onPress={() => this.onStudentSelected(student.ID)}
                />
              );
            })}
            <Toast position={'center'} ref="toast" />
          </ScrollView>
        </QCView>
      </SideMenu>
    );
  }
}

//Styles for the entire container along with the top banner
const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    backgroundColor: colors.lightGrey,
    flex: 1,
  },
  saveAttendance: {
    alignItems: 'center',
    backgroundColor: colors.lightGrey,
    flex: 1,
    width: screenWidth,
  },
  present: {
    paddingLeft: 5,
    paddingRight: 5,
  },
  absent: {
    paddingRight: 5,
  },
});

export default ClassAttendanceScreen;
