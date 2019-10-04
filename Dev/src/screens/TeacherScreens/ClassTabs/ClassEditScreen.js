import React from "react";
import { ScrollView, View, StyleSheet, FlatList, Dimensions, Text, Alert, Share, TextInput, PixelRatio } from "react-native";
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
import LoadingSpinner from 'components/LoadingSpinner';
import QCView from 'components/QCView';
import fontStyles from "config/fontStyles";

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

  defaultImageId = this.getRandomGenderNeutralImage();

  getHighlightedImages = () => {

    // get a second gender neutral image, make sure it is different than the first one
    do {
      secondGenericImageId = this.getRandomGenderNeutralImage();
    } while (secondGenericImageId === this.defaultImageId)

    //initialize the array of suggested images
    let proposedImages = [this.defaultImageId, secondGenericImageId, this.getRandomFemaleImage(), this.getRandomMaleImage()]
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

    if (this.state.newStudentName.trim() === '') {

      Alert.alert(strings.Whoops, strings.PleaseInputAName);

    } else {

      this.setState({ isLoading: true, newStudentName: '' });

      //First pushes the manual student to the firebase database
      const { newStudentName, profileImageID } = this.state;
      const newStudent = await FirebaseFunctions.addManualStudent(newStudentName, profileImageID, this.state.classID);

      //Appends the student to the current state
      let newArrayOfStudents = this.state.students;
      newArrayOfStudents.push(newStudent);

      //Sets the new state
      this.setState({
        isLoading: false,
        students: newArrayOfStudents
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

  }

  // ------- Render method: Main entry to render the screen's UI ------------------

  render() {
    const { classID, students } = this.state;
    return (
      <QCView style={{
        flexDirection: 'column',
        backgroundColor: colors.lightGrey,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height
      }}>
        <ScrollView nestedScrollEnabled={true} style={styles.container}>
          <ImageSelectionModal
            visible={this.state.modalVisible}
            images={studentImages.images}
            cancelText="Cancel"
            setModalVisible={this.setModalVisible.bind(this)}
            onImageSelected={this.onImageSelected.bind(this)}
          />
          <View style={styles.shareCodeContainer}>
            <View style={{ flex: 0.8, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={fontStyles.bigTextStyleBlack}>{strings.AddYourStudents}</Text>
            </View>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1
            }}>
              <View style={{ flex: 0.6 }}></View>
              <View style={{ flexDirection: 'column', flex: 6, justifyContent: 'center' }}>
                <Text style={fontStyles.mainTextStyleBlack}>{strings.YourClassCode}</Text>
                <Text style={fontStyles.smallTextStylePrimaryDark}>{classID}</Text>
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
              <Text style={fontStyles.bigTextStyleBlack}>{strings.Or}</Text>
            </View>
            <View style={{ flex: 0.8, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={fontStyles.bigTextStyleBlack}>{strings.AddStudentsManually}</Text>
            </View>
            <View style={{ flex: 0.5, alignSelf: 'flex-start' }}>
              <Text style={fontStyles.mainTextStyleBlack}>{strings.EnterYourStudentsName}</Text>
            </View>
            <View style={{ flex: 0.7, alignSelf: 'flex-start' }}>
              <TextInput
                style={{
                  height: Dimensions.get('window').height * 0.07,
                  paddingLeft: 7,
                  fontSize: 14,
                  color: colors.darkGrey,
                }}
                placeholder={strings.StudentName}
                onChangeText={newStudentName => this.setState({ newStudentName })}
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
            <View style={{ flex: 2, justifyContent: 'flex-end', alignItems: 'center' }}>
              <QcActionButton
                text={strings.AddStudent}
                onPress={async () => {
                  FirebaseFunctions.logEvent('TEACHER_ADD_STUDENT_MANUAL');
                  await this.addManualStudent();
                }} />
            </View>
          </View>
          <View style={{ flex: 0.5 }}>
            <LoadingSpinner isVisible={this.state.isLoading} />
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
                onPress={() => { }}
                compOnPress={() => {
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

                }}
                comp={
                  <Icon
                    name='user-times'
                    size={PixelRatio.get() * 9}
                    type='font-awesome'
                    color={colors.primaryLight} />
                } />
            )} />
        </ScrollView>
      </QCView>
    );
  }
}

//Styles for the entire container along with the top banner
const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    backgroundColor: colors.lightGrey,
    flex: 1,
  },
  flatList: {
    flex: 1
  },
  shareCodeContainer: {
    flexDirection: "column",
    backgroundColor: colors.white,
    flex: 2.5,
    height: Dimensions.get('window').height * 0.5,
    alignItems: 'center',
  },
});

export default ClassEditScreen;
