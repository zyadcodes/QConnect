import React from "react";
import { ScrollView, StyleSheet, FlatList, View, Text, Image, PixelRatio, Alert } from "react-native";
import StudentCard from "components/StudentCard";
import colors from "config/colors";
import studentImages from "config/studentImages"
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
    isOpen: false,
    classes: '',
    isEditing: false
  }

  async componentDidMount() {

    FirebaseFunctions.setCurrentScreen("Class Main Screen", "ClassMainScreen");
    this.setState({ isLoading: true });
    const { userID } = this.props.navigation.state.params;
    const teacher = await FirebaseFunctions.getTeacherByID(userID);
    const { currentClassID } = teacher;
    const currentClass = await FirebaseFunctions.getClassByID(currentClassID);
    const classes = await FirebaseFunctions.getClassesByIDs(teacher.classes);
    this.setState({
      isLoading: false,
      teacher,
      userID,
      currentClass,
      currentClassID,
      classes
    });

  }

  removeStudent(studentID) {
    Alert.alert(
      strings.RemoveStudent,
      strings.AreYouSureYouWantToRemoveStudent,
      [
        {
          text: strings.Remove, onPress: () => {

            //Removes the student from the database and updates the local state
            let { currentClass, currentClassID } = this.state;
            FirebaseFunctions.removeStudent(currentClassID, studentID);
            let arrayOfClassStudents = currentClass.students;
            let indexOfStudent = arrayOfClassStudents.findIndex((student) => {
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

  render() {
    const { isLoading, teacher, userID, currentClass, currentClassID } = this.state;
    if (isLoading === true) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <LoadingSpinner isVisible={true} />
        </View>
      )
    }
    //---------------------------------no class state---------------------------------
    else if (currentClass === -1 || currentClassID === "") {
      return (
        <SideMenu isOpen={this.state.isOpen} menu={<LeftNavPane
          teacher={teacher}
          userID={userID}
          classes={this.state.classes}
          edgeHitWidth={0}
          navigation={this.props.navigation} />}>
          <QCView style={screenStyle.container}>
            <View style={{ flex: 1, width: screenWidth }}>
              <TopBanner
                LeftIconName="navicon"
                LeftOnPress={() => this.setState({ isOpen: true })}
                Title={"Quran Connect"}
              />
            </View>
            <View style={{ alignItems: "center", justifyContent: "flex-start", alignSelf: 'center', flex: 2 }}>
              <Image
                source={require('assets/emptyStateIdeas/ghostGif.gif')}
                style={{
                  width: 0.73 * screenWidth,
                  height: 0.22 * screenHeight,
                  resizeMode: 'contain',
                }}
              />
              <Text style={fontStyles.hugeTextStylePrimaryDark}>{strings.NoClass}</Text>
              <QcActionButton
                text={strings.AddClassButton}
                onPress={() => {
                  this.props.navigation.push("AddClass", {
                    userID: this.state.userID,
                    teacher: this.state.teacher
                  })
                }} />
            </View>
          </QCView>
        </SideMenu>
      )
    }
    else if (currentClass.students.length === 0) {
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
        <SideMenu isOpen={this.state.isOpen} menu={<LeftNavPane
          teacher={teacher}
          userID={userID}
          classes={this.state.classes}
          edgeHitWidth={0}
          navigation={this.props.navigation} />}>
          <QCView style={screenStyle.container}>
            <View style={{ flex: 1, width: screenWidth }}>
              <TopBanner
                LeftIconName="navicon"
                LeftOnPress={() => this.setState({ isOpen: true })}
                Title={this.state.currentClass.name}
              />
            </View>
            <View style={{ flex: 2, justifyContent: 'flex-start', alignItems: 'center', alignSelf: 'center' }}>
              <Image
                source={require('assets/emptyStateIdeas/ghostGif.gif')}
                style={{
                  width: 0.73 * screenWidth,
                  height: 0.22 * screenHeight,
                  resizeMode: 'contain',
                }}
              />

              <Text style={fontStyles.hugeTextStylePrimaryDark}>{strings.EmptyClass}</Text>
              <QcActionButton
                text={strings.AddStudentButton}
                onPress={() => this.props.navigation.push("ShareClassCode", {
                  currentClassID: this.state.currentClassID,
                  userID: this.state.userID,
                  currentClass: this.state.currentClass
                })} />
            </View>
          </QCView>
        </SideMenu>
      )
    }


    else {
      const studentsNeedHelp = currentClass.students.filter((student) => student.isReadyEnum === "NEED_HELP");
      const studentsReady = currentClass.students.filter((student) => student.isReadyEnum === "READY");
      const studentsWorkingOnIt = currentClass.students.filter((student) => student.isReadyEnum === "WORKING_ON_IT");
      const { isEditing, currentClassID, userID } = this.state;
      return (
        <SideMenu isOpen={this.state.isOpen} menu={<LeftNavPane
          teacher={teacher}
          userID={userID}
          classes={this.state.classes}
          edgeHitWidth={0}
          navigation={this.props.navigation} />}>
          <ScrollView style={styles.container}>
            <View>
              <TopBanner
                LeftIconName="navicon"
                LeftOnPress={() => this.setState({ isOpen: true })}
                Title={this.state.currentClass.name}
                RightIconName={this.state.isEditing === false ? "edit" : null}
                RightTextName={this.state.isEditing === true ? strings.Done : null}
                RightOnPress={() => {
                  const { isEditing } = this.state;
                  this.setState({ isEditing: !isEditing })
                }}
              />
            </View>
            {
              isEditing === true ? (
                <View style={styles.AddStudentButton}>
                  <QcActionButton
                    text={"+"}
                    onPress={() => {
                      //Goes to add students screen
                      this.props.navigation.push("ShareClassCode", {
                        currentClassID,
                        userID,
                        currentClass: this.state.currentClass
                      });
                    }} />
                </View>
              ) : (
                  <View style={styles.AddStudentButton}></View>
                )
            }
            {
              studentsNeedHelp.length > 0 ? (
                <View>
                  <Text style={[{ marginLeft: screenWidth * 0.017 }, fontStyles.bigTextStyleDarkRed]}>{strings.NeedHelp}</Text>
                </View>
              ) : (
                  <View></View>
                )
            }
            <FlatList
              data={studentsNeedHelp}
              keyExtractor={(item) => item.name} // fix, should be item.id (add id to classes)
              renderItem={({ item }) => (
                <StudentCard
                  key={item.ID}
                  studentName={item.name}
                  profilePic={studentImages.images[item.profileImageID]}
                  currentAssignment={item.currentAssignment}
                  onPress={() =>
                    this.props.navigation.push("TeacherStudentProfile", {
                      userID: userID,
                      studentID: item.ID,
                      currentClass: currentClass,
                      classID: currentClassID
                    })
                  }
                  background={colors.red}
                  comp={isEditing === true ? (
                    <Icon
                      name='user-times'
                      size={PixelRatio.get() * 9}
                      type='font-awesome'
                      color={colors.primaryDark} />) : (null)}
                  compOnPress={() => { this.removeStudent(item.ID) }} />)}
            />
            {
              studentsReady.length > 0 ? (
                <View style={{ paddingTop: screenHeight * 0.025 }}>
                  <Text style={[{ marginLeft: screenWidth * 0.017 }, fontStyles.bigTextStyleGreen]}>{strings.Ready}</Text>
                </View>
              ) : (
                  <View></View>
                )
            }
            <FlatList
              data={studentsReady}
              keyExtractor={(item) => item.name} // fix, should be item.id (add id to classes)
              renderItem={({ item }) => (
                <StudentCard
                  key={item.id}
                  studentName={item.name}
                  profilePic={studentImages.images[item.profileImageID]}
                  currentAssignment={item.currentAssignment}
                  onPress={() =>
                    this.props.navigation.push("TeacherStudentProfile", {
                      userID: userID,
                      studentID: item.ID,
                      currentClass: currentClass,
                      classID: currentClassID
                    })
                  }
                  background={colors.green}
                  comp={isEditing === true ? (
                    <Icon
                      name='user-times'
                      size={PixelRatio.get() * 9}
                      type='font-awesome'
                      color={colors.primaryDark} />) : (null)}
                  compOnPress={() => { this.removeStudent(item.ID) }} />
              )} />
            {
              studentsWorkingOnIt.length > 0 ? (
                <View style={{ paddingTop: screenHeight * 0.025 }}>
                  <Text style={[{ marginLeft: screenWidth * 0.017 }, fontStyles.bigTextStyleBlack]}>{strings.WorkingOnIt}</Text>
                </View>
              ) : (
                  <View></View>
                )
            }
            <FlatList
              data={studentsWorkingOnIt}
              keyExtractor={(item) => item.name} // fix, should be item.id (add id to classes)
              renderItem={({ item }) => (
                <StudentCard
                  key={item.id}
                  studentName={item.name}
                  profilePic={studentImages.images[item.profileImageID]}
                  currentAssignment={item.currentAssignment}
                  onPress={() =>
                    this.props.navigation.push("TeacherStudentProfile", {
                      userID: userID,
                      studentID: item.ID,
                      currentClass: currentClass,
                      classID: currentClassID
                    })
                  }
                  background={colors.white}
                  comp={isEditing === true ? (
                    <Icon
                      name='user-times'
                      size={PixelRatio.get() * 9}
                      type='font-awesome'
                      color={colors.primaryDark} />) : (null)}
                  compOnPress={() => { this.removeStudent(item.ID) }} />
              )} />
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
    height: screenHeight * 0.08,
    alignItems: 'flex-end',
    paddingRight: screenWidth * 0.025
  }
});

export default ClassMainScreen;