import React from "react";
import { ScrollView, View, StyleSheet, FlatList, TouchableWithoutFeedback, Keyboard, Text, Alert, Share, TextInput } from "react-native";
import StudentCard from "components/StudentCard";
import colors from "config/colors";
import studentImages from "config/studentImages";
import { Icon } from 'react-native-elements';
import strings from "config/strings";
import QcActionButton from 'components/QcActionButton';
import ImageSelectionModal from 'components/ImageSelectionModal';
import ImageSelectionRow from 'components/ImageSelectionRow';
import QcParentScreen from "screens/QcParentScreen";
import FirebaseFunctions from 'config/FirebaseFunctions';

export class ClassEditScreen extends QcParentScreen {

  componentDidMount() {

    //Sets the screen for firebase analytics
    FirebaseFunctions.setCurrentScreen("Class Edit Screen", "ClassEditScreen");

  }

  //Helpers to retrieve the selected image index 
  getRandomGenderNeutralImage = () => {
    index = Math.floor(Math.random() * Math.floor(studentImages.genderNeutralImages.length));
    imageIndex = studentImages.genderNeutralImages[index];
    return imageIndex;
  }

  getRandomMaleImage = () => {
    index = Math.floor(Math.random() * Math.floor(studentImages.maleImages.length));
    imageIndex = studentImages.maleImages[index];
    return imageIndex;
  }

  getRandomFemaleImage = () => {
    index = Math.floor(Math.random() * Math.floor(studentImages.femaleImages.length));
    imageIndex = studentImages.femaleImages[index];
    return imageIndex;
  }

  getHighlightedImages = () => {
    defaultImageId = this.getRandomGenderNeutralImage();

    // get a second gender neutral image, make sure it is different than the first one
    do {
      secondGenericImageId = this.getRandomGenderNeutralImage();
    } while (secondGenericImageId === defaultImageId)

    //initialize the array of suggested images
    let proposedImages = [defaultImageId, secondGenericImageId, this.getRandomFemaleImage(), this.getRandomMaleImage()]
    return proposedImages;
  }

  onImageSelected(index) {
    let candidateImages = this.state.highlightedImagesIndices;

    if (!this.state.highlightedImagesIndices.includes(index)) {
      candidateImages.splice(0, 1);
      candidateImages.splice(0, 0, index);
    }

    this.setState({
      profileImageID: index,
      highlightedImagesIndices: candidateImages
    })

    this.setModalVisible(false);
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  //This method adds a student manually without them actually having to have a profile
  async addManualStudent() {

    this.setState({ isLoading: true });

  }

  //State containing the passed in props as well as the current state of the entered text and the selected
  //profile image
  state = {

    classID: this.props.navigation.state.params.classID,
    currentClass: this.props.navigation.state.params.currentClass,
    students: this.props.navigation.state.params.currentClass.students,
    newStudentName: '',
    isLoading: false,
    profileImageID: this.getRandomGenderNeutralImage(),
    highlightedImagesIndices: this.getHighlightedImages(),
    modalVisible: false

  }

  // ------- Render method: Main entry to render the screen's UI ------------------

  render() {
    const { students, classID } = this.state;

    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container}>
          <ImageSelectionModal
            visible={this.state.modalVisible}
            images={studentImages.images}
            cancelText="Cancel"
            setModalVisible={this.setModalVisible.bind(this)}
            onImageSelected={this.onImageSelected.bind(this)}
          />
          <View style={styles.shareCodeContainer}>
            <View style={{ flex: 0.8, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontSize: 20 }}>{strings.AddYourStudents}</Text>
            </View>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1
            }}>
              <View style={{ flex: 0.6 }}></View>
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
            <View style={{ flex: 0.5, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontSize: 20 }}>{strings.Or}</Text>
            </View>
            <View style={{ flex: 0.8, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontSize: 20 }}>{strings.AddStudentsManually}</Text>
            </View>
            <View style={{ flex: 0.5, alignSelf: 'flex-start' }}>
              <Text style={{ fontSize: 18 }}>  {strings.EnterYourStudentsName}</Text>
            </View>
            <View style={{ flex: 0.7, alignSelf: 'flex-start' }}>
              <View style={{ flex: 1, flexDirection: 'row' }}>
                <Text>  </Text>
                <TextInput
                  placeholder={strings.StudentName}
                  onChangeText={newStudentName => this.setState({ newStudentName })}
                  value={this.state.newStudentName}
                />
              </View>
            </View>
            <View style={{ flex: 1 }}>
              <ImageSelectionRow
                images={studentImages.images}
                highlightedImagesIndices={this.state.highlightedImagesIndices}
                onImageSelected={this.onImageSelected.bind(this)}
                onShowMore={() => this.setModalVisible(true)}
                selectedImageIndex={this.state.profileImageID}
              />
            </View>
            <View style={{ flex: 1.3, justifyContent: 'center', alignItems: 'center' }}>
              <QcActionButton
                text={strings.AddStudent}
                onPress={() => {
                  FirebaseFunctions.logEvent('TEACHER_ADD_STUDENT_MANUAL');
                  this.addManualStudent();
                }} />
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
                  profilePic={studentImages.images[item.profileImageID]}
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
      </TouchableWithoutFeedback >
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
    flex: 2,
    alignItems: 'center',
  },
});

export default ClassEditScreen;
