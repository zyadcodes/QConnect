import React from "react";
import { StyleSheet, View, Image, Text, TouchableOpacity, Alert, ScrollView, LayoutAnimation, Platform } from "react-native";
import QcActionButton from "components/QcActionButton";
import Toast, { DURATION } from "react-native-easy-toast";
import colors from "config/colors";
import ImageSelectionRow from "components/ImageSelectionRow";
import ImageSelectionModal from "components/ImageSelectionModal";
import TeacherInfoEntries from "components/TeacherInfoEntries";
import teacherImages from "config/teacherImages";
import strings from "config/strings";
import QcParentScreen from "screens/QcParentScreen";
import FadeInView from "../../components/FadeInView";
import FirebaseFunctions from 'config/FirebaseFunctions';
import { Icon } from 'react-native-elements';
import QCView from 'components/QCView';
import screenStyle from 'config/screenStyle';
import fontStyles from "config/fontStyles";
import { screenHeight, screenWidth } from 'config/dimensions';

const initialState = {
  authCode: '',
  password: '',
  passwordTwo: '',
}

//To-Do: All info in this class is static, still needs to be hooked up to data base in order
//to function dynamically
export class TeacherWelcomeScreen extends QcParentScreen {
  state = initialState;

  getRandomGenderNeutralImage = () => {
    index = Math.floor(Math.random() * Math.floor(teacherImages.genderNeutralImages.length));
    imageIndex = teacherImages.genderNeutralImages[index];
    return imageIndex;
  }

  getRandomMaleImage = () => {
    index = Math.floor(Math.random() * Math.floor(teacherImages.maleImages.length));
    imageIndex = teacherImages.maleImages[index];
    return imageIndex;
  }

  getRandomFemaleImage = () => {
    index = Math.floor(Math.random() * Math.floor(teacherImages.femaleImages.length));
    imageIndex = teacherImages.femaleImages[index];
    return imageIndex;
  }

  initialDefaultImageId = this.getRandomGenderNeutralImage()

  getHighlightedImages = () => {
    defaultImageId = this.initialDefaultImageId;

    // get a second gender neutral image, make sure it is different than the first one
    do {
      secondGenericImageId = this.getRandomGenderNeutralImage();
    } while (secondGenericImageId === defaultImageId)

    //initialize the array of suggested images
    let proposedImages = [defaultImageId, secondGenericImageId, this.getRandomFemaleImage(), this.getRandomMaleImage()]
    return proposedImages;
  }

  //--- state captures the inputted user info ------------------
  state = {
    phoneNumber: "",
    emailAddress: "",
    name: "",
    profileImageID: this.initialDefaultImageId,
    highlightedImagesIndices: this.getHighlightedImages(),
    modalVisible: false,
    isPhoneValid: false, //todo: this should be properly validated or saved
  };

  //--- event handlers, handle user interaction ------------------
  setModalVisible(isModalVisible) {
    this.setState({ modalVisible: isModalVisible });
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
    });

    this.setModalVisible(false);
  }

  onTeacherFlow = () => {
    this.props.navigation.push("AddClass");
  };

  // This method saves the new profile information to the firestore database
  // This is reused for teacher profile page and teacher welcome page
  // In teacher welcome page, teacher ID will be passed as undefined, in which case
  // we will generate a new ID before saving to the store.
  async saveProfileInfo() {

    let { name, phoneNumber, emailAddress, password, profileImageID } = this.state;
    name = name.trim();
    phoneNumber = phoneNumber.trim();
    emailAddress = emailAddress.trim();
    password = password.trim();

    //Creates the teacher object to be sent up to the database
    const teacherObject = {
      classes: [],
      currentClassID: "",
      emailAddress,
      name,
      phoneNumber,
      profileImageID,
      isTeacher: true
    }

    try {
      const ID = await FirebaseFunctions.signUp(
        emailAddress,
        password,
        true,
        teacherObject
      );
      this.props.navigation.push("TeacherCurrentClass", {
        userID: ID
      });
    } catch (err) {
      if (err && err.message) {
        Alert.alert(strings.Whoops, err.message);
      } else {
        Alert.alert(strings.Whoops, strings.SomethingWentWrong);
      }

      FirebaseFunctions.logEvent("CREATE_USER_FAILED", { err });
    }
  };

  //Creates new account, or launches confirmation dialog if account was created but not confirmed yet.
  onCreateOrConfirmAccount() {
    //validate entries first
    const { name, phoneNumber, emailAddress, password } = this.state;
    if (!name ||
      !phoneNumber ||
      !emailAddress ||
      !password ||
      name.trim() === ""
      || phoneNumber.trim() === ""
      || emailAddress.trim() === ""
      || password.trim() === "") {
      Alert.alert(strings.Whoops, strings.PleaseMakeSureAllFieldsAreFilledOut);
    } 
    /**
     * Phone input Check
     */
    else if (!this.state.isPhoneValid) {
      Alert.alert(strings.Whoops, strings.InvalidPhoneNumber);
    } 

    /**
     * Password Input Check
     */
    else if (!(this.state.password === this.state.passwordTwo)){
      Alert.alert(strings.Whoops, strings.PasswordsDontMatch)
    } 

    /**
     * Save Profile info
     */
    else {
      //else, create account and save profile info
      this.saveProfileInfo()
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

  onEmailAddressChanged = value => {
    this.setState({ emailAddress: value });
  };

  onPasswordChanged = value => {
    this.setState({ password: value })
  }

  onPasswordTwoChanged = value => {
    this.setState({
      passwordTwo: value
    });
  };

  componentWillMount() {
    if (Platform.OS === 'ios') {
      LayoutAnimation.easeInEaseOut();
    }
  }

  //---------- render method ---------------------------------
  // The following custom components are used below:
  // -    ImageSelectionModal: implements the pop up modal to allow users to customize their avatar
  // -    TeacherInfoEntries: contains entries to capture user info (name, email, and phone number)
  // -    ImageSelectionRow: a row with suggested avatars, and a button to invoke the pop up with more avatars
  //-----------------------------------------------------------
  render() {

    return (
      <View>
        <ScrollView>
          <View>
            <ImageSelectionModal
              visible={this.state.modalVisible}
              images={teacherImages.images}
              cancelText={strings.Cancel}
              setModalVisible={this.setModalVisible.bind(this)}
              onImageSelected={this.onImageSelected.bind(this)}
              screen={this.name}
            />
            <View style={styles.picContainer}>
              <View style={{ flex: 1, paddingTop: screenHeight * 0.04, alignSelf: 'flex-start', flexDirection: 'row' }}>
                <TouchableOpacity style={{ flex: 2, justifyContent: 'flex-start', alignItems: 'flex-start', paddingLeft: screenWidth*0.03 }} onPress={() => { this.props.navigation.goBack() }}>
                  <Icon
                    name={'angle-left'}
                    type="font-awesome" />
                </TouchableOpacity>
              </View>
              <View style={{ flex: 1, paddingLeft: screenWidth * 0.05, paddingRight: screenWidth * 0.05, paddingBottom: screenHeight * 0.02 }}>
                <FadeInView
                  style={{ alignItems: 'center', justifyContent: 'center' }}>
                  <Image
                    style={styles.welcomeImage}
                    source={require("assets/images/salam.png")}
                  />
                  <Text style={fontStyles.mainTextStyleDarkGrey}>{strings.TeacherWelcomeMessage}</Text>
                </FadeInView>
              </View>
            </View>
            <View style={styles.editInfo} behavior="padding">
              <TeacherInfoEntries 
                name={this.state.name}
                phoneNumber={this.state.phoneNumber}
                emailAddress={this.state.emailAddress}
                password={this.state.password}
                passwordTwo = {this.state.passwordTwo}
                onNameChanged={this.onNameChanged}
                onPhoneNumberChanged={this.onPhoneNumberChanged}
                onEmailAddressChanged={this.onEmailAddressChanged}
                showPasswordField={true}
                onPasswordChanged={this.onPasswordChanged}
                onPasswordTwoChanged={this.onPasswordTwoChanged}
              />
               <Text></Text>
              <ImageSelectionRow
                
                images={teacherImages.images}
                highlightedImagesIndices={this.state.highlightedImagesIndices}
                onImageSelected={this.onImageSelected.bind(this)}
                onShowMore={() => this.setModalVisible(true)}
                selectedImageIndex={this.state.profileImageID}
                screen={this.name}
              />
            </View>
            <View style={styles.buttonsContainer}>
              <QcActionButton
                text={strings.CreateAccount}
                onPress={() => this.onCreateOrConfirmAccount()}
                screen={this.name}
              />
            </View>
            <View style={styles.filler} />
            <Toast position={'center'} ref="toast" />
          </View>
        </ScrollView>
      </View>
    );
  }
}

//-----------------   Styles for the Teacher profile class-----------------------------------
const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    backgroundColor: colors.lightGrey,
    flex: 1,
    justifyContent: "flex-end"
  },
  picContainer: {
    alignItems: "center",
    marginBottom: 0.015 * screenHeight,
    backgroundColor: colors.white
  },
  welcomeImage: {
    marginTop: 0.022 * screenHeight,
    width: screenWidth * 0.44,
    resizeMode: "contain"
  },
  editInfo: {
    flexDirection: "column",
    backgroundColor: colors.white,
    color: colors.darkGrey,
  },
  buttonsContainer: {
    flexDirection: "column",
    marginTop: 0.015 * screenHeight,
    backgroundColor: colors.white,
    justifyContent: "center"
  },
  filler: {
    height: 20
   },
});

export default TeacherWelcomeScreen;
