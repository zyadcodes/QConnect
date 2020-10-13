import React from "react";
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Alert,
  ScrollView,
  LayoutAnimation,
  Platform,
  Dimensions,
} from "react-native";
import QcActionButton from "components/QcActionButton";
import Toast, { DURATION } from "react-native-easy-toast";
import colors from "config/colors";
import ImageSelectionRow from "components/ImageSelectionRow";
import ImageSelectionModal from "components/ImageSelectionModal";
import TeacherInfoEntries from "components/TeacherInfoEntries";
import studentImages from "config/studentImages";
import strings from "config/strings";
import QcParentScreen from "screens/QcParentScreen";
import FadeInView from "../../components/FadeInView";
import FirebaseFunctions from "config/FirebaseFunctions";
import { Icon } from "react-native-elements";
import QCView from "components/QCView";
import screenStyle from "config/screenStyle";
import { screenHeight, screenWidth } from "config/dimensions";
import firebase from "react-native-firebase";

export class StudentWelcomeScreen extends QcParentScreen {
  getRandomGenderNeutralImage = () => {
    let index = Math.floor(
      Math.random() * Math.floor(studentImages.genderNeutralImages.length)
    );
    let imageIndex = studentImages.genderNeutralImages[index];
    return imageIndex;
  };

  getRandomMaleImage = () => {
    let index = Math.floor(
      Math.random() * Math.floor(studentImages.maleImages.length)
    );
    let imageIndex = studentImages.maleImages[index];
    return imageIndex;
  };

  getRandomFemaleImage = () => {
    let index = Math.floor(
      Math.random() * Math.floor(studentImages.femaleImages.length)
    );
    let imageIndex = studentImages.femaleImages[index];
    return imageIndex;
  };

  initialDefaultImageId = this.getRandomGenderNeutralImage();

  getHighlightedImages = () => {
    let defaultImageId = this.initialDefaultImageId;
    let secondGenericImageId = this.getRandomGenderNeutralImage();
    // get a second gender neutral image, make sure it is different than the first one
    while (secondGenericImageId === defaultImageId){
      secondGenericImageId = this.getRandomGenderNeutralImage();
    }

    //initialize the array of suggested images
    let proposedImages = [
      defaultImageId,
      secondGenericImageId,
      this.getRandomFemaleImage(),
      this.getRandomMaleImage(),
    ];
    return proposedImages;
  };

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

  // this method saves the new profile information to the firestore database
  // This is reused for student profile page and studnet welcome page
  // In studnet welcome page, student ID will be passed as undefined, in which case
  // we will generate a new ID before saving to the store.
  async saveProfileInfo() {
    let {
      name,
      phoneNumber,
      emailAddress,
      password,
      profileImageID,
    } = this.state;
    name = name.trim();
    phoneNumber = phoneNumber.trim();
    emailAddress = emailAddress.trim();
    password = password.trim();

    //Creates the student object to be sent up to the database
    const studentObject = {
      classes: [],
      currentClassID: "",
      emailAddress,
      name,
      phoneNumber,
      profileImageID
    };

    const ID = await FirebaseFunctions.signUp(
      emailAddress,
      password,
      false,
      studentObject
    );
    this.props.navigation.push("StudentCurrentClass", {
      userID: ID,
    });
  }

  //Creates new account, or launches confirmation dialog if account was created but not confirmed yet.
  async onCreateOrConfirmAccount() {
    //validate entries first
    const { name, phoneNumber, emailAddress, password } = this.state;
    if (
      !name ||
      !phoneNumber ||
      !emailAddress ||
      !password ||
      name.trim() === "" ||
      phoneNumber.trim() === "" ||
      emailAddress.trim() === "" ||
      password.trim() === ""
    ) {
      Alert.alert(strings.Whoops, strings.PleaseMakeSureAllFieldsAreFilledOut);
    } else if (!this.state.isPhoneValid) {
      Alert.alert(strings.Whoops, strings.InvalidPhoneNumber);
    } else if (!emailAddress.includes("@")) {
      Alert.alert(strings.Whoops, strings.BadEmail);
    } else if (password.length <= 6) {
      Alert.alert(strings.Whoops, strings.PasswordError);
    } else {
      const doesThisUserExist = await firebase
        .auth()
        .fetchSignInMethodsForEmail(emailAddress);
      if (doesThisUserExist.length > 0) {
        Alert.alert(strings.Whoops, strings.EmailExists);
      } else {
        //else, create account and save profile info
        this.saveProfileInfo();
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

  onEmailAddressChanged = value => {
    this.setState({ emailAddress: value });
  };
  onPasswordChanged = value => {
    this.setState({ password: value });
  };

  componentWillMount() {
    FirebaseFunctions.setCurrentScreen(
      "Student Welcome Screen",
      "StudentWelcomeScreen"
    );
    if (Platform.OS === "ios") {
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
      <QCView style={screenStyle.container}>
        <ScrollView>
          <View>
            <ImageSelectionModal
              visible={this.state.modalVisible}
              images={studentImages.images}
              cancelText={strings.Cancel}
              setModalVisible={this.setModalVisible.bind(this)}
              onImageSelected={this.onImageSelected.bind(this)}
              screen={this.name}
            />

            <View style={styles.picContainer}>
              <View style={{ flex: 1 }} />
              <View
                style={{
                  flex: 1,
                  alignSelf: "flex-start",
                  flexDirection: "row",
                }}
              >
                <View style={{ flex: 0.1 }} />
                <TouchableOpacity
                  style={{
                    flex: 2,
                    paddingTop: screenHeight * 0.025,
                    justifyContent: "flex-start",
                    alignItems: "flex-start",
                  }}
                  onPress={() => {
                    this.props.navigation.goBack();
                  }}
                >
                  <Icon name={"angle-left"} type="font-awesome" />
                </TouchableOpacity>
                <View style={{ flex: 3 }} />
              </View>
              <View
                style={{
                  flex: 1,
                  paddingLeft: screenWidth * 0.05,
                  paddingRight: screenWidth * 0.05,
                }}
              >
                <FadeInView
                  style={{ alignItems: "center", justifyContent: "center" }}
                >
                  <Image
                    style={styles.welcomeImage}
                    source={require("assets/images/salam.png")}
                  />
                </FadeInView>
              </View>
            </View>
            <View style={styles.editInfo} behavior="padding">
              <TeacherInfoEntries
                name={this.state.name}
                phoneNumber={this.state.phoneNumber}
                emailAddress={this.state.emailAddress}
                password={this.state.password}
                onNameChanged={this.onNameChanged}
                onPhoneNumberChanged={this.onPhoneNumberChanged}
                onEmailAddressChanged={this.onEmailAddressChanged}
                showPasswordField={true}
                onPasswordChanged={this.onPasswordChanged}
              />
              <ImageSelectionRow
                images={studentImages.images}
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
            <Toast position={"center"} ref="toast" />
          </View>
        </ScrollView>
      </QCView>
    );
  }
}

//-----------------   Styles for the student profile class-----------------------------------
const styles = StyleSheet.create({
  picContainer: {
    paddingTop: screenHeight * 0.015,
    alignItems: "center",
    marginTop: screenHeight * 0.022,
    marginBottom: screenHeight * 0.015,
    backgroundColor: colors.white,
    width: screenWidth,
    flexDirection: "column",
  },
  welcomeImage: {
    marginTop: screenHeight * 0.022,
    width: screenWidth * 0.44,
    resizeMode: "contain"
  },
  editInfo: {
    flexDirection: "column",
    backgroundColor: colors.white,
    color: colors.darkGrey,
    width: screenWidth
  },
  buttonsContainer: {
    flexDirection: "column",
    marginTop: screenHeight * 0.015,
    backgroundColor: colors.white,
    justifyContent: "center",
    width: screenWidth
  },
  filler: {
    flexDirection: "column",
    flex: 1
  },
});

export default StudentWelcomeScreen;
