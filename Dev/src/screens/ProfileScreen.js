import React from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Text,
  Alert,
  ScrollView,
} from 'react-native';
import Toast, { DURATION } from 'react-native-easy-toast';
import QcActionButton from 'components/QcActionButton';
import TouchableText from 'components/TouchableText';
import teacherImages from 'config/teacherImages';
import studentImages from 'config/studentImages';
import colors from 'config/colors';
import TopBanner from 'components/TopBanner';
import ImageSelectionModal from 'components/ImageSelectionModal';
import TeacherInfoEntries from 'components/TeacherInfoEntries';
import strings from 'config/strings';
import QcParentScreen from 'screens/QcParentScreen';
import FirebaseFunctions from 'config/FirebaseFunctions';
import SideMenu from 'react-native-side-menu';
import TeacherLeftNavPane from '../screens/TeacherScreens/LeftNavPane';
import StudentLeftNavPane from '../screens/StudentScreens/LeftNavPane';
import QCView from 'components/QCView';
import fontStyles from 'config/fontStyles';
import { screenHeight, screenWidth } from 'config/dimensions';

export class ProfileScreen extends QcParentScreen {
  //Sets the current screen for firebase analytics
  componentDidMount() {
    if (this.props.navigation.state.params.isTeacher === true) {
      FirebaseFunctions.setCurrentScreen(
        'Teacher Profile Screen',
        'ProfileScreen'
      );
    } else {
      FirebaseFunctions.setCurrentScreen(
        'Student Profile Screen',
        'ProfileScreen'
      );
    }
  }

  state = {
    accountObject: this.props.navigation.state.params.accountObject,
    userID: this.props.navigation.state.params.userID,
    name: this.props.navigation.state.params.accountObject.name,
    phoneNumber: this.props.navigation.state.params.accountObject.phoneNumber,
    emailAddress: this.props.navigation.state.params.accountObject.emailAddress,
    profileImageID: this.props.navigation.state.params.accountObject
      .profileImageID,
    classes: this.props.navigation.state.params.classes,
    isTeacher: this.props.navigation.state.params.isTeacher,
    isPhoneValid: true,
    isOpen: false,
    modalVisible: false
  };

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  //to-do: method must be able to update the profile picture
  editProfilePic() {
    this.setModalVisible(true);
  }

  //this method saves the new profile information to the firestore database
  async saveProfileInfo() {
    let {
      userID,
      name,
      phoneNumber,
      emailAddress,
      profileImageID,
    } = this.state;
    name = name.trim();
    phoneNumber = phoneNumber.trim();
    emailAddress = emailAddress.trim();
    if (
      !name ||
      !phoneNumber ||
      !emailAddress ||
      name.trim() === '' ||
      phoneNumber.trim() === '' ||
      emailAddress.trim() === ''
    ) {
      Alert.alert(strings.Whoops, strings.PleaseMakeSureAllFieldsAreFilledOut);
    } else if (!this.state.isPhoneValid) {
      Alert.alert(strings.Whoops, strings.InvalidPhoneNumber);
    } else {
      // teacherCustomTags = [];
      //await FirebaseFunctions.updateTeacherObject{userID, { customTags: teacherCustomTags}}

      if (this.state.isTeacher === true) {
        await FirebaseFunctions.updateTeacherObject(userID, {
          name,
          phoneNumber,
          profileImageID
        });
        this.refs.toast.show(
          strings.YourProfileHasBeenSaved,
          DURATION.LENGTH_SHORT
        );
        //Just goes to the first class
        this.props.navigation.push('TeacherCurrentClass', {
          userID: userID
        });
      } else {
        await FirebaseFunctions.updateStudentProfileInfo(
          userID,
          this.state.classes,
          name,
          phoneNumber,
          profileImageID
        );
        this.refs.toast.show(
          strings.YourProfileHasBeenSaved,
          DURATION.LENGTH_SHORT
        );
        //Just goes to the first class
        this.props.navigation.push('StudentCurrentClass', {
          userID: userID
        });
      }
    }
  }

  //------ event handlers to capture user input into state as user modifies the entries -----
  onNameChanged = value => {
    this.setState({ name: value });
  };

  onPhoneNumberChanged = phone => {
    this.setState({
      isPhoneValid: phone.isValidNumber(),
      phoneNumber: phone.getValue()
    });
  };

  onImageSelected(index) {
    this.setState({ profileImageID: index });
    this.setModalVisible(false);
  }

  //-----------renders the teacher profile UI ------------------------------------
  render() {
    const {
      userID,
      emailAddress,
      name,
      phoneNumber,
      profileImageID,
    } = this.state;
    return (
      <SideMenu
        isOpen={this.state.isOpen}
        menu={
          this.state.isTeacher === true ? (
            <TeacherLeftNavPane
              teacher={this.state.accountObject}
              teacherID={userID}
              classes={this.state.classes}
              edgeHitWidth={0}
              navigation={this.props.navigation}
            />
          ) : (
            <StudentLeftNavPane
              student={this.state.accountObject}
              userID={userID}
              classes={this.state.classes}
              edgeHitWidth={0}
              navigation={this.props.navigation}
            />
          )
        }
      >
        <QCView
          style={{
            flexDirection: 'column',
            backgroundColor: colors.lightGrey,
            width: screenWidth,
            height: screenHeight
          }}
        >
          <ScrollView style={styles.container}>
            <TopBanner
              LeftIconName="navicon"
              LeftOnPress={() => this.setState({ isOpen: true })}
              Title={strings.MyProfile}
            />
            <View>
              <ImageSelectionModal
                visible={this.state.modalVisible}
                images={
                  this.state.isTeacher === true
                    ? teacherImages.images
                    : studentImages.images
                }
                cancelText={strings.Cancel}
                setModalVisible={this.setModalVisible.bind(this)}
                onImageSelected={this.onImageSelected.bind(this)}
              />
              <View style={styles.picContainer}>
                <Image
                  style={styles.profilePic}
                  source={this.state.isTeacher === true
                    ? teacherImages.images[profileImageID]
                    : studentImages.images[profileImageID]}
                />
                <TouchableText
                  text={strings.UpdateProfileImage}
                  onPress={() => this.editProfilePic()}
                />
              </View>

              <TeacherInfoEntries
                name={name}
                phoneNumber={phoneNumber}
                emailAddress={emailAddress}
                onNameChanged={this.onNameChanged}
                noEmailField={true}
                onPhoneNumberChanged={this.onPhoneNumberChanged}
                onEmailAddressChanged={() => {}}
              />
              <View style={styles.buttonsContainer}>
                <QcActionButton
                  text={strings.Cancel}
                  onPress={() => {
                    if (this.state.isTeacher === true) {
                      //Just goes back without saving anything
                      this.props.navigation.push('TeacherCurrentClass', {
                        userID: this.state.userID
                      });
                    } else {
                      this.props.navigation.push('StudentCurrentClass', {
                        userID: this.state.userID
                      });
                    }
                  }}
                />
                <QcActionButton
                  text={strings.Save}
                  onPress={() => this.saveProfileInfo()}
                />
              </View>
              <Toast position={'center'} ref="toast" />
            </View>
            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                style={styles.cardStyle}
                onPress={async () => {
                  await FirebaseFunctions.logOut(this.state.userID);
                  this.props.navigation.push("FirstScreenLoader");
                }}
              >
                <Text style={fontStyles.bigTextStyleBlack}>
                  {strings.LogOut}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </QCView>
      </SideMenu>
    );
  }
}

//Styles for the Teacher profile class
const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    backgroundColor: colors.lightGrey,
    flex: 1,
  },
  picContainer: {
    paddingTop: screenHeight * 0.04,
    alignItems: 'center',
    paddingBottom: screenHeight * 0.03,
    marginTop: screenHeight * 0.015,
    marginBottom: screenHeight * 0.015,
    backgroundColor: colors.white,
  },
  profilePic: {
    width: screenHeight * 0.1,
    height: screenHeight * 0.1,
    borderRadius: screenHeight * 0.1,
    marginBottom: screenHeight * 0.01,
  },
  cardStyle: {
    flexDirection: 'row',
    marginRight: screenWidth * 0.017,
    height: screenHeight * 0.07,
    alignItems: 'center',
    justifyContent: 'center',
    justifyContent: 'space-between',
    fontFamily: 'Montserrat-Regular',
    backgroundColor: colors.white
  },
  buttonsContainer: {
    paddingVertical: screenHeight * 0.015,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    marginTop: screenHeight * 0.015,
    backgroundColor: colors.white,
  }
});

export default ProfileScreen;
