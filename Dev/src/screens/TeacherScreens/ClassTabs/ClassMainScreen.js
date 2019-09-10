import React from "react";
import { ScrollView, StyleSheet, FlatList, View, Text, Image, Dimensions } from "react-native";
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

export class ClassMainScreen extends QcParentScreen {

  state = {
    isLoading: true,
    teacher: '',
    userID: '',
    currentClass: '',
    currentClassID: '',
    isOpen: false,
    classes: ''
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
            <View style={{ flex: 1 }}>
              <View>
                <TopBanner
                  LeftIconName="navicon"
                  LeftOnPress={() => this.setState({ isOpen: true })}
                  Title={"Quran Connect"}
                />
              </View>
            </View>
            <View style={{ alignItems: "center", justifyContent: "flex-start", alignSelf: 'center', flex: 2 }}>
              <Image
                source={require('assets/emptyStateIdeas/ghostGif.gif')}
                style={{
                  width: 300,
                  height: 150,
                  resizeMode: 'contain',
                }}
              />
              <Text
                style={{
                  fontSize: 30,
                  color: colors.primaryDark,
                  flexDirection: "row",
                }}
              >
                {strings.NoClass}
              </Text>
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
            <View style={{ flex: 1, width: Dimensions.get('window').width }}>
              <TopBanner
                LeftIconName="navicon"
                LeftOnPress={() => this.setState({ isOpen: true })}
                Title={this.state.currentClass.name}
                RightIconName="edit"
                RightOnPress={() => this.props.navigation.push('ClassEdit', {
                  classID: currentClassID,
                  currentClass,
                  userID: this.state.userID
                })}
              />
            </View>
            <View style={{ flex: 2, justifyContent: 'flex-start', alignItems: 'center', alignSelf: 'center' }}>
              <Image
                source={require('assets/emptyStateIdeas/ghostGif.gif')}
                style={{
                  width: 300,
                  height: 150,
                  resizeMode: 'contain',
                }}
              />

              <Text
                style={{
                  fontSize: 30,
                  color: colors.primaryDark,
                  flexDirection: "row",
                }}
              >
                {strings.EmptyClass}
              </Text>

              <QcActionButton
                text={strings.AddStudentButton}
                onPress={() => this.props.navigation.push("ClassEdit", {
                  classID: this.state.currentClassID,
                  currentClass,
                  userID: this.state.userID
                })} />
            </View>
          </QCView>
        </SideMenu>
      )
    }


    else {

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
                RightIconName="edit"
                RightOnPress={() => this.props.navigation.push('ClassEdit', {
                  classID: currentClassID,
                  currentClass,
                  userID: this.state.userID
                })}
              />
            </View>
            <FlatList
              data={currentClass.students}
              keyExtractor={(item) => item.name} // fix, should be item.id (add id to classes)
              renderItem={({ item }) => (
                <StudentCard
                  key={item.id}
                  studentName={item.name}
                  background={colors.white}
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
                  background={item.isReady === true ? colors.green : colors.red}
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
  classTitle: {
    color: colors.primaryDark,
    fontSize: 25
  }
});

export default ClassMainScreen;