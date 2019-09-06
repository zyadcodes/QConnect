import React from "react";
import { ScrollView, View, StyleSheet, FlatList, TouchableWithoutFeedback, Keyboard, Text, Alert, Share } from "react-native";
import StudentCard from "components/StudentCard";
import colors from "config/colors";
import studentImages from "config/studentImages";
import { Icon } from 'react-native-elements';
import strings from "config/strings";
import QcParentScreen from "screens/QcParentScreen";
import FirebaseFunctions from 'config/FirebaseFunctions';

export class ClassEditScreen extends QcParentScreen {

  state = {

    classID: this.props.navigation.state.params.classID,
    currentClass: this.props.navigation.state.params.currentClass,
    students: this.props.navigation.state.params.currentClass.students

  }

  componentDidMount() {

    //Sets the screen for firebase analytics
    FirebaseFunctions.setCurrentScreen("Class Edit Screen", "ClassEditScreen");

  }

  // ------- Render method: Main entry to render the screen's UI ------------------

  render() {
    const { students, classID } = this.state;

    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container}>
          <View style={styles.shareCodeContainer}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontSize: 20 }}>{strings.AddStudents}</Text>
            </View>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1
            }}>
              <View style={{ flex: 1 }}></View>
              <View style={{ flexDirection: 'column', flex: 6, justifyContent: 'center' }}>
                <Text style={{ fontSize: 18 }}>{strings.YourClassCode}</Text>
                <Text style={{ fontSize: 16, color: colors.primaryDark }}>{classID}</Text>
              </View>
              <View style={{ flex: 1 }}></View>
              <View style={{ flex: 1, justifyContent: 'center' }}>
                <Icon
                  raised
                  name='share'
                  type='font-awesome'
                  color={colors.primaryDark}
                  size={20}
                  onPress={() => { 
                    FirebaseFunctions.logEvent("TEACHER_SHARE_CLASS_CODE");
                    Share.share({ message: strings.JoinMyClass + classID }) 
                    }} />
              </View>
              <View style={{ flex: 1 }}></View>
            </View>
          </View>
          <ScrollView style={styles.flatList}>
            <FlatList
              data={students}
              keyExtractor={(item, index) => item.id}
              renderItem={({ item, index }) => (
                <StudentCard
                  key={index}
                  studentName={item.name}
                  profilePic={studentImages.images[item.imageId]}
                  background={colors.white}
                  onPress={() => { }}
                  comp={<Icon
                    name='user-times'
                    size={25}
                    type='font-awesome'
                    color={colors.primaryLight}
                    onPress={() => {
                      Alert.alert(
                        strings.RemoveStudent,
                        strings.AreYouSureYouWantToRemoveStudent,
                        [
                          {
                            text: strings.Remove, onPress: () => {

                              //Removes the student from the database and updates the local state
                              FirebaseFunctions.removeStudent(classID, item.ID);
                              let arrayOfClassStudents = students;
                              let indexOfStudent = arrayOfClassStudents.findIndex((student) => {
                                return student.ID === item.ID;
                              });
                              arrayOfClassStudents.splice(indexOfStudent, 1);
                              this.setState({ students: arrayOfClassStudents });
                            }
                          },

                          { text: strings.Cancel, style: 'cancel' },
                        ]
                      );
                    }} />} />
              )} />
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

//Styles for the entire container along with the top banner
const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    backgroundColor: colors.lightGrey,
    flex: 1
  },
  flatList: {
    flex: 1
  },
  shareCodeContainer: {
    flexDirection: "column",
    backgroundColor: colors.white,
    flex: 0.25,
    alignItems: 'center',
  },
});

export default ClassEditScreen;
