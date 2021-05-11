//This screen will be accessed from the ShareClassCodeScreen if the teacher elects to create a manual
//student. Manual students will be given a name and a profile picture selected by the teacher. Once the
//teacher clicks "Add Student", that student will be added to the screen. Clicking "Done" takes the teacher
//to the ClassMainScreen
import React, { Component } from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  FlatList,
  Dimensions,
  Text,
  Alert,
  Share,
  TextInput,
  PixelRatio,
  Platform,
} from "react-native";
import StudentCard from "components/StudentCard/StudentCard";
import colors from "config/colors";
import studentImages from "config/studentImages";
import { Icon } from 'react-native-elements';
import strings from "config/strings";
import QcActionButton from 'components/QcActionButton/QcActionButton';
import ImageSelectionModal from 'components/ImageSelectionModal/ImageSelectionModal';
import ImageSelectionRow from 'components/ImageSelectionRow/ImageSelectionRow';
import FirebaseFunctions from 'config/FirebaseFunctions';
import LoadingSpinner from 'components/LoadingSpinner/LoadingSpinner';
import QCView from 'QCView/QCView';
import fontStyles from "config/fontStyles";
import { screenHeight, screenWidth } from 'config/dimensions';

class AddManualStudentsScreen extends Component {
  componentDidMount() {
    //Sets the screen for firebase analytics
    FirebaseFunctions.setCurrentScreen(
      'Add Students Manually Screen',
      'AddManualStudentsScreen'
    );
  }

  //Helpers to retrieve the selected image index
  getRandomGenderNeutralImage = () => {
    index = Math.floor(
      Math.random() * Math.floor(studentImages.genderNeutralImages.length)
    );
    imageIndex = studentImages.genderNeutralImages[index];
    return imageIndex;
  };

  getRandomMaleImage = () => {
    index = Math.floor(
      Math.random() * Math.floor(studentImages.maleImages.length)
    );
    imageIndex = studentImages.maleImages[index];
    return imageIndex;
  };

  getRandomFemaleImage = () => {
    index = Math.floor(
      Math.random() * Math.floor(studentImages.femaleImages.length)
    );
    imageIndex = studentImages.femaleImages[index];
    return imageIndex;
  };

  defaultImageId = this.getRandomGenderNeutralImage();

  getHighlightedImages = () => {
    // get a second gender neutral image, make sure it is different than the first one
    do {
      secondGenericImageId = this.getRandomGenderNeutralImage();
    } while (secondGenericImageId === this.defaultImageId);

    //initialize the array of suggested images
    let proposedImages = [
      this.defaultImageId,
      secondGenericImageId,
      this.getRandomFemaleImage(),
      this.getRandomMaleImage(),
    ];
    return proposedImages;
  };

  onImageSelected(index) {
    let candidateImages = this.state.highlightedImagesIndices;

    if (!this.state.highlightedImagesIndices.includes(index)) {
      candidateImages.splice(0, 1);
      candidateImages.splice(0, 0, index);
    }

    this.setState({
      profileImageID: index,
      highlightedImagesIndices: candidateImages
    });

    this.setModalVisible(false);
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  //This method adds a student manually without them actually having to have a profile
  async addManualStudent() {
    if (this.state.newStudentName.trim() === '') {
      Alert.alert(strings.Whoops, strings.PleaseInputAName);
    } else {
      this.setState({ isLoading: true, newStudentName: '' });

      //First pushes the manual student to the firebase database
      const { newStudentName, profileImageID } = this.state;
      const newStudent = await FirebaseFunctions.addManualStudent(
        newStudentName,
        profileImageID,
        this.state.classID
      );

      //Appends the student to the current state
      let newArrayOfStudents = this.state.students;
      newArrayOfStudents.push(newStudent);

      //Sets the new state
      this.setState({
        isLoading: false,
        students: newArrayOfStudents,
        highlightedImagesIndices: this.getHighlightedImages()
      });
    }

    return 0;
  }

  //State containing the passed in props as well as the current state of the entered text and the selected
  //profile image
  state = {
    classID: this.props.navigation.state.params.classID,
    currentClass: this.props.navigation.state.params.currentClass,
    students: this.props.navigation.state.params.currentClass.students,
    newStudentName: '',
    isLoading: false,
    profileImageID: this.defaultImageId,
    highlightedImagesIndices: this.getHighlightedImages(),
    modalVisible: false
  };

  // ------- Render method: Main entry to render the screen's UI ------------------

  render() {
    const { classID, students } = this.state;
    return (
      <QCView
        style={{
          flexDirection: 'column',
          backgroundColor: colors.lightGrey,
          width: screenWidth,
          height: screenHeight
        }}
      >
        <ScrollView nestedScrollEnabled={true} style={styles.container}>
          <ImageSelectionModal
            visible={this.state.modalVisible}
            images={studentImages.images}
            cancelText="Cancel"
            setModalVisible={this.setModalVisible.bind(this)}
            onImageSelected={this.onImageSelected.bind(this)}
          />
          <View style={styles.addStudentsView}>
            <View style={styles.enterStudentNameText}>
              <Text
                style={{ ...fontStyles.mainTextStyleBlack, marginBottom: 3 }}
              >
                {strings.EnterYourStudentsName}
              </Text>
            </View>
            <View style={{ flex: 0.7, alignSelf: 'flex-start' }}>
              <TextInput
                style={[
                  fontStyles.mainTextStyleDarkGrey,
                  styles.studentNameTextInput,
                ]}
                placeholder={strings.StudentName}
                autoCorrect={false}
                onChangeText={newStudentName =>
                  this.setState({ newStudentName })
                }
                value={this.state.newStudentName}
              />
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
            <View
              style={{
                flex: 2,
                justifyContent: 'flex-end',
                alignItems: 'center'
              }}
            >
              <QcActionButton
                text={strings.AddStudent}
                onPress={async () => {
                  FirebaseFunctions.logEvent('TEACHER_ADD_STUDENT_MANUAL');
                  await this.addManualStudent();
                }}
              />
            </View>
          </View>
          <View style={styles.doneButton}>
            {this.state.isLoading === true ? (
              <LoadingSpinner isVisible={this.state.isLoading} />
            ) : (
              <QcActionButton
                text={strings.Done}
                onPress={() =>
                  this.props.navigation.push('TeacherCurrentClass', {
                    userID: this.props.navigation.state.params.userID
                  })
                }
              />
            )}
          </View>
          <FlatList
            data={students}
            keyExtractor={(item, index) => item.ID}
            extraData={this.state}
            renderItem={({ item, index }) => (
              <StudentCard
                key={index}
                studentName={item.name}
                profilePic={studentImages.images[item.profileImageID]}
                background={colors.white}
                onPress={() => {}}
                compOnPress={() => {
                  Alert.alert(
                    strings.RemoveStudent,
                    strings.AreYouSureYouWantToRemoveStudent,
                    [
                      {
                        text: strings.Remove,
                        onPress: () => {
                          //Removes the student from the database and updates the local state
                          FirebaseFunctions.removeStudent(classID, item.ID);
                          let arrayOfClassStudents = students;
                          let indexOfStudent = arrayOfClassStudents.findIndex(
                            student => {
                              return student.ID === item.ID;
                            }
                          );
                          arrayOfClassStudents.splice(indexOfStudent, 1);
                          this.setState({ students: arrayOfClassStudents });
                        }
                      },

                      { text: strings.Cancel, style: 'cancel' },
                    ]
                  );
                }}
                comp={
                  <Icon
                    name="user-times"
                    size={PixelRatio.get() * 9}
                    type="font-awesome"
                    color={colors.primaryLight}
                  />
                }
              />
            )}
          />
        </ScrollView>
      </QCView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    backgroundColor: colors.lightGrey,
    flex: 1,
  },
  addStudentsView: {
    backgroundColor: colors.white,
    paddingTop: screenHeight * 0.05,
  },
  enterStudentNameText: {
    paddingLeft: screenWidth * 0.05,
    flex: 0.5,
    alignSelf: 'flex-start'
  },
  studentNameTextInput: {
    marginLeft: screenWidth * 0.02,
    paddingLeft: screenWidth * 0.03,
    width: screenWidth * 0.95,
    backgroundColor: colors.veryLightGrey,
    height: screenHeight * 0.06,
    borderRadius: 1
  },
  doneButton: {
    alignItems: 'center',
    justifyContent: 'center',
    height: screenHeight * 0.125
  },
});

export default AddManualStudentsScreen;
