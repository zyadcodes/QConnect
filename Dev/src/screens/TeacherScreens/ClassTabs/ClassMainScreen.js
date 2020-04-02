import React from "react";
import {
  ScrollView,
  StyleSheet,
  FlatList,
  View,
  Text,
  Image,
  PixelRatio,
  Alert,
} from "react-native";
import StudentCard from "components/StudentCard";
import colors from "config/colors";
import studentImages from "config/studentImages";
import LoadingSpinner from '../../../components/LoadingSpinner';
import strings from 'config/strings';
import QcParentScreen from "screens/QcParentScreen";
import QcActionButton from "components/QcActionButton";
import FirebaseFunctions from 'config/FirebaseFunctions';
import TopBanner from 'components/TopBanner';
import LeftNavPane from '../LeftNavPane';
import SideMenu from 'react-native-side-menu';
import QCView from 'components/QCView';
import screenStyle from 'config/screenStyle';
import fontStyles from "config/fontStyles";
import { Icon } from 'react-native-elements';
import { screenHeight, screenWidth } from 'config/dimensions';

export class ClassMainScreen extends QcParentScreen {
  state = {
    isLoading: true,
    teacher: '',
    userID: '',
    currentClass: '',
    currentClassID: '',
    classInviteCode: '',
    isOpen: false,
    classes: '',
    isEditing: false,
    titleHasChanged: false
  };

  async componentDidMount() {
    FirebaseFunctions.setCurrentScreen("Class Main Screen", "ClassMainScreen");
    this.setState({ isLoading: true });
    const { userID } = this.props.navigation.state.params;
    const teacher = await FirebaseFunctions.getTeacherByID(userID);
    const { currentClassID } = teacher;
    let { currentClass } = this.props.navigation.state.params;

    if (currentClass === undefined) {
      currentClass = await FirebaseFunctions.getClassByID(currentClassID);
    }

    const classInviteCode = currentClass.classInviteCode;
    console.log(classInviteCode);
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
        { text: strings.Cancel, style: 'cancel' },
      ]
    );
  }
  //to write implemntation of the function, updates class name
  updateTitle(newTitle) {
    this.setState({ titleHasChanged: true });
    this.setState({
      currentClass: { ...this.state.currentClass, name: newTitle },
    });
  }
  async updatePicture(newPicture) {
    this.setState({ pictureHasChanged: true });
    this.setState({
      currentClass: { ...this.state.currentClass, classImageID: newPicture },
    });
    await FirebaseFunctions.updateClassObject(this.state.currentClassID, {
      classImageID: newPicture,
    });
  }

  render() {
    const {
      isLoading,
      teacher,
      userID,
      currentClass,
      currentClassID,
      classInviteCode
    } = this.state;

    if (isLoading === true) {
      return (
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <LoadingSpinner isVisible={true} />
        </View>
      );
    }
    //---------------------------------no class state---------------------------------
    else if (currentClass === -1 || currentClassID === "") {
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
                onEditingPicture={newPicture => this.updatePicture(newPicture)}
                Title={"Quran Connect"}
                onTitleChanged={newTitle => this.updateTitle(newTitle)}
                profileImageID={currentClass.classImageID}
              />
            </View>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'flex-start',
                alignSelf: 'center',
                flex: 2,
              }}
            >
              <Text style={fontStyles.hugeTextStylePrimaryDark}>
                {strings.NoClass}
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
                text={strings.AddClassButton}
                onPress={() => {
                  this.props.navigation.push("AddClass", {
                    userID: this.state.userID,
                    teacher: this.state.teacher
                  });
                }}
              />
            </View>
          </QCView>
        </SideMenu>
      );
    } else if (currentClass.students.length === 0) {
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
                Title={this.state.currentClass.name}
                onTitleChanged={newTitle => this.updateTitle(newTitle)}
                onEditingPicture={newPicture => this.updatePicture(newPicture)}
                profileImageID={currentClass.classImageID}
                RightIconName="edit"
                RightOnPress={() => this.props.navigation.push("ShareClassCode", {
                  classInviteCode,
                  currentClassID,
                  userID: this.state.userID,
                  currentClass
                })}
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
                onPress={() => this.props.navigation.push("ShareClassCode", {
                  classInviteCode,
                  currentClassID,
                  userID: this.state.userID,
                  currentClass
                })} />
                }
              />
            </View>
          </QCView>
        </SideMenu>
      );
    } else {
      const studentsNeedHelp = currentClass.students.filter(
        student =>
          student.currentAssignments &&
          student.currentAssignments[0] &&
          student.currentAssignments[0].isReadyEnum === 'NEED_HELP'
      );
      const studentsReady = currentClass.students.filter(
        student =>
          student.currentAssignments &&
          student.currentAssignments[0] &&
          (student.currentAssignments[0].isReadyEnum === 'READY' ||
            (!student.isReadyEnum && student.isReady === true))
      );
      const studentsWorkingOnIt = currentClass.students.filter(
        student =>
          student.currentAssignments &&
          student.currentAssignments[0] &&
          (student.currentAssignments[0].isReadyEnum === 'WORKING_ON_IT' ||
            student.currentAssignments[0].isReady === false)
      );
      const studentsNotStarted = currentClass.students.filter(
        student =>
          student.currentAssignments &&
          student.currentAssignments[0] &&
          (student.currentAssignments[0].isReadyEnum === 'NOT_STARTED' ||
            student.currentAssignments[0].isReadyEnum === undefined)
      );

      const studentsWithNoAssignments = currentClass.students.filter(
        student =>
          !student.currentAssignments || student.currentAssignments.length === 0
      );
      const { isEditing, currentClassID, userID } = this.state;

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
          <ScrollView style={styles.container}>
            <View>
              <TopBanner
                LeftIconName="navicon"
                LeftOnPress={() => this.setState({ isOpen: true })}
                Title={this.state.currentClass.name}
                RightIconName={this.state.isEditing === false ? "edit" : null}
                RightTextName={
                  this.state.isEditing === true ? strings.Done : null
                }
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
                      FirebaseFunctions.updateClassObject(
                        this.state.currentClassID,
                        { name: this.state.currentClass.name }
                      );
                      this.setState({ titleHasChanged: false });
                    }

                    this.setState({ isEditing: !isEditing });
                  }
                }}
              />
            </View>
            {isEditing === true ? (
              <View style={styles.AddStudentButton}>
                <TouchableText
                  text={strings.AddStudents}
                  onPress={() => {
                    //Goes to add students screen
                    this.props.navigation.push("ShareClassCode", {
                      currentClassID,
                      userID,
                      classInviteCode,
                      currentClass: this.state.currentClass,
                    });
                  }}
                  style={{
                    ...fontStyles.bigTextStylePrimaryDark,
                    paddingTop: 10,
                  }}
                />
              </View>
            ) : (
              <View />
            )}
            {studentsNeedHelp.length > 0 ? (
              <View
                style={{
                  alignItems: 'center',
                  marginLeft: screenWidth * 0.017,
                  flexDirection: 'row',
                  paddingTop: screenHeight * 0.025,
                }}
              >
                <Icon
                  name="issue-opened"
                  type="octicon"
                  color={colors.darkRed}
                />
                <Text
                  style={[
                    { marginLeft: screenWidth * 0.017 },
                    fontStyles.mainTextStyleDarkRed,
                  ]}
                >
                  {strings.NeedHelp}
                </Text>
              </View>
            ) : (
              <View />
            )}
            <FlatList
              data={studentsNeedHelp}
              keyExtractor={item => item.name} // fix, should be item.id (add id to classes)
              renderItem={({ item }) => (
                <StudentCard
                  key={item.ID}
                  studentName={item.name}
                  profilePic={studentImages.images[item.profileImageID]}
                  currentAssignment={
                    item.currentAssignments && item.currentAssignments[0]
                      ? item.currentAssignments[0].name
                      : strings.NoAssignmentsYet
                  }
                  onPress={() =>
                    this.props.navigation.push("TeacherStudentProfile", {
                      userID: userID,
                      studentID: item.ID,
                      currentClass: currentClass,
                      classID: currentClassID
                    })
                  }
                  background={colors.red}
                  comp={
                    isEditing === true ? (
                      <Icon
                        name="user-times"
                        size={PixelRatio.get() * 9}
                        type="font-awesome"
                        color={colors.primaryDark}
                      />
                    ) : null
                  }
                  compOnPress={() => {
                    this.removeStudent(item.ID);
                  }}
                />
              )}
            />
            {studentsReady.length > 0 ? (
              <View
                style={{
                  alignItems: 'center',
                  marginLeft: screenWidth * 0.017,
                  flexDirection: 'row',
                  paddingTop: screenHeight * 0.025,
                }}
              >
                <Icon
                  name="check-circle-outline"
                  type="material-community"
                  color={colors.darkGreen}
                />
                <Text
                  style={[
                    { marginLeft: screenWidth * 0.017 },
                    fontStyles.mainTextStyleDarkGreen,
                  ]}
                >
                  {strings.Ready}
                </Text>
              </View>
            ) : (
              <View />
            )}
            <FlatList
              data={studentsReady}
              keyExtractor={item => item.name} // fix, should be item.id (add id to classes)
              renderItem={({ item }) => (
                <StudentCard
                  key={item.id}
                  studentName={item.name}
                  profilePic={studentImages.images[item.profileImageID]}
                  currentAssignment={
                    item.currentAssignments && item.currentAssignments[0]
                      ? item.currentAssignments[0].name
                      : strings.NoAssignmentsYet
                  }
                  onPress={() =>
                    this.props.navigation.push("TeacherStudentProfile", {
                      userID: userID,
                      studentID: item.ID,
                      currentClass: currentClass,
                      classID: currentClassID
                    })
                  }
                  background={colors.green}
                  comp={
                    isEditing === true ? (
                      <Icon
                        name="user-times"
                        size={PixelRatio.get() * 9}
                        type="font-awesome"
                        color={colors.primaryDark}
                      />
                    ) : null
                  }
                  compOnPress={() => {
                    this.removeStudent(item.ID);
                  }}
                />
              )}
            />
            {studentsWithNoAssignments.length > 0 ? (
              <View
                style={{
                  alignItems: 'center',
                  marginLeft: screenWidth * 0.017,
                  flexDirection: 'row',
                  paddingTop: screenHeight * 0.025,
                }}
              >
                <Icon
                  name="pencil-plus-outline"
                  type="material-community"
                  color={colors.primaryDark}
                />
                <Text
                  style={[
                    { marginLeft: screenWidth * 0.017 },
                    fontStyles.mainTextStylePrimaryDark,
                  ]}
                >
                  {strings.NeedAssignment}
                </Text>
              </View>
            ) : (
              <View />
            )}
            <FlatList
              data={studentsWithNoAssignments}
              keyExtractor={item => item.name} // fix, should be item.id (add id to classes)
              renderItem={({ item }) => (
                <StudentCard
                  key={item.id}
                  studentName={item.name.toUpperCase()}
                  profilePic={studentImages.images[item.profileImageID]}
                  currentAssignment={strings.NoAssignmentsYet}
                  onPress={() =>
                    this.props.navigation.push("TeacherStudentProfile", {
                      userID: userID,
                      studentID: item.ID,
                      currentClass: currentClass,
                      classID: currentClassID
                    })
                  }
                  background={colors.white}
                  comp={
                    isEditing === true ? (
                      <Icon
                        name="user-times"
                        size={PixelRatio.get() * 9}
                        type="font-awesome"
                        color={colors.primaryDark}
                      />
                    ) : null
                  }
                  compOnPress={() => {
                    this.removeStudent(item.ID);
                  }}
                />
              )}
            />

            {studentsNotStarted.length > 0 ? (
              <View
                style={{
                  alignItems: 'center',
                  marginLeft: screenWidth * 0.017,
                  flexDirection: 'row',
                  paddingTop: screenHeight * 0.025,
                }}
              >
                <Icon
                  name="bookmark-off-outline"
                  type="material-community"
                  color={colors.primaryDark}
                />
                <Text
                  style={[
                    { marginLeft: screenWidth * 0.017 },
                    fontStyles.mainTextStylePrimaryDark,
                  ]}
                >
                  {strings.NotStarted}
                </Text>
              </View>
            ) : (
              <View />
            )}
            <FlatList
              data={studentsNotStarted}
              keyExtractor={item => item.name} // fix, should be item.id (add id to classes)
              renderItem={({ item }) => (
                <StudentCard
                  key={item.id}
                  studentName={item.name}
                  profilePic={studentImages.images[item.profileImageID]}
                  currentAssignment={
                    item.currentAssignments && item.currentAssignments[0]
                      ? item.currentAssignments[0].name
                      : strings.NoAssignmentsYet
                  }
                  onPress={() =>
                    this.props.navigation.push("TeacherStudentProfile", {
                      userID: userID,
                      studentID: item.ID,
                      currentClass: currentClass,
                      classID: currentClassID
                    })
                  }
                  background={colors.white}
                  comp={
                    isEditing === true ? (
                      <Icon
                        name="user-times"
                        size={PixelRatio.get() * 9}
                        type="font-awesome"
                        color={colors.primaryDark}
                      />
                    ) : null
                  }
                  compOnPress={() => {
                    this.removeStudent(item.ID);
                  }}
                />
              )}
            />

            {studentsWorkingOnIt.length > 0 ? (
              <View
                style={{
                  alignItems: 'center',
                  marginLeft: screenWidth * 0.017,
                  flexDirection: 'row',
                  paddingTop: screenHeight * 0.025,
                }}
              >
                <Icon
                  name="update"
                  type="material-community"
                  color={colors.primaryDark}
                />
                <Text
                  style={[
                    { marginLeft: screenWidth * 0.017 },
                    fontStyles.mainTextStylePrimaryDark,
                  ]}
                >
                  {strings.WorkingOnIt}
                </Text>
              </View>
            ) : (
              <View />
            )}
            <FlatList
              data={studentsWorkingOnIt}
              keyExtractor={item => item.name} // fix, should be item.id (add id to classes)
              renderItem={({ item }) => (
                <StudentCard
                  key={item.id}
                  studentName={item.name}
                  profilePic={studentImages.images[item.profileImageID]}
                  currentAssignment={
                    item.currentAssignments && item.currentAssignments[0]
                      ? item.currentAssignments[0].name
                      : strings.NoAssignmentsYet
                  }
                  onPress={() =>
                    this.props.navigation.push("TeacherStudentProfile", {
                      userID: userID,
                      studentID: item.ID,
                      currentClass: currentClass,
                      classID: currentClassID
                    })
                  }
                  background={colors.white}
                  comp={
                    isEditing === true ? (
                      <Icon
                        name="user-times"
                        size={PixelRatio.get() * 9}
                        type="font-awesome"
                        color={colors.primaryDark}
                      />
                    ) : null
                  }
                  compOnPress={() => {
                    this.removeStudent(item.ID);
                  }}
                />
              )}
            />
          </ScrollView>
        </SideMenu>
      );
    }
  }
}

//Styles for the entire container along with the top banner
const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    backgroundColor: colors.lightGrey,
    flex: 3,
  },
  AddStudentButton: {
    height: screenHeight * 0.04,
    alignItems: 'flex-end',
    paddingRight: screenWidth * 0.025
  },
});

export default ClassMainScreen;
