import React from "react";
import { View, TextInput, Image, KeyboardAvoidingView, StyleSheet, Keyboard, TouchableWithoutFeedback, Alert } from "react-native";
import colors from "config/colors";
import classImages from "config/classImages";
import QcActionButton from "components/QcActionButton";
import QcParentScreen from "screens/QcParentScreen";
import ImageSelectionModal from "components/ImageSelectionModal"
import LoadingSpinner from 'components/LoadingSpinner';
import FirebaseFunctions from 'config/FirebaseFunctions';
import strings from 'config/strings';
import TopBanner from 'components/TopBanner';
import LeftNavPane from '../LeftNavPane';
import SideMenu from 'react-native-side-menu';

export class AddClassScreen extends QcParentScreen {

  //----------------------- state -------------------------------------
  state = {
    className: "",
    classImageId: Math.floor(Math.random() * 10),
    modalVisible: false,
    isLoading: true,
    userID: "",
    teacher: "",
    isOpen: false,
    classes: ''
  };

  //Sets the current screen for firebase analytics
  async componentDidMount() {

    if (this.props.navigation.state.params && this.props.navigation.state.params.userID && this.props.navigation.state.params.teacher) {
      const classes = await FirebaseFunctions.getClassesByIDs(this.props.navigation.state.params.teacher.classes);
      this.setState({
        isLoading: false,
        userID: this.props.navigation.state.params.userID,
        teacher: this.props.navigation.state.params.teacher,
        classes
      })
    } else {
      this.setState({ isLoading: true });
    }
    FirebaseFunctions.setCurrentScreen("Add Class", "AddClassScreen");

  }


  // -------- event handlers, respond to user initiated events ----------
  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  onImageSelected(imageId) {
    this.setState({ classImageId: imageId })
    this.setModalVisible(false);
  }

  //---- helper function to determine if the entered class name is duplicate -------
  classNameAlreadyExists() {
    let { classes } = this.state;
    for (let i = 0; i < classes.length; i++) {
      if (classes[i].name.toLowerCase() === this.state.className.toLowerCase()) {
        return true;
      }
    }

    return false;
  }

  // saves the class into firebase
  async addNewClass() {

    if (!this.state.className || this.state.className.trim().length === 0) {
      Alert.alert(strings.Whoops, strings.PleaseMakeSureAllFieldsAreFilledOut);
      return;
    }

    if (this.classNameAlreadyExists()) {
      Alert.alert(strings.Whoops,
        /*Message to say that it is an invalid input:*/
        "Class Name already exists!",
        [/*Button to exit */
          { text: "OK" }
        ]
      )
      return;
    }

    let classInfo = {
      name: this.state.className,
      classImageID: this.state.classImageId,
      students: [],
      teachers: [this.state.userID]
    };

    const newClassID = await FirebaseFunctions.addNewClass(classInfo, this.state.userID);
    const newClass = await FirebaseFunctions.getClassByID(newClassID);

    //Navigates to the class
    this.props.navigation.push("ClassEdit", {
      classID: newClassID,
      currentClass: newClass,
      userID: this.state.userID
    });
  }

  // ------------ renders the UI of the screen ---------------------------
  render() {
    if (this.state.isLoading === true) {
      return (
        <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
          <LoadingSpinner isVisible={true} />
        </View>
      )
    }
    return (
      <SideMenu isOpen={this.state.isOpen} menu={<LeftNavPane
        teacher={this.state.teacher}
        userID={this.state.userID}
        classes={this.state.classes}
        edgeHitWidth={0}
        navigation={this.props.navigation} />}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <KeyboardAvoidingView style={styles.container} behavior="padding">
            <View
              style={styles.container}>
              <TopBanner
                LeftIconName="navicon"
                LeftOnPress={() => this.setState({ isOpen: true })}
                Title={strings.AddNewClass} />

              <ImageSelectionModal
                visible={this.state.modalVisible}
                images={classImages.images}
                cancelText={strings.Cancel}
                setModalVisible={this.setModalVisible.bind(this)}
                onImageSelected={this.onImageSelected.bind(this)}
                screen={this.name}
              />

              <View style={styles.picContainer}>
                <Image
                  style={styles.profilePic}
                  source={classImages.images[this.state.classImageId]}
                  ResizeMode="contain" />
                <TouchableText
                  text={strings.EditClassImage}
                  onPress={() => this.setModalVisible(true)} />
              </View>

              <View style={styles.bottomContainer}>
                <TextInput
                  style={styles.textInputStyle}
                  placeholder={strings.WriteClassNameHere}
                  onChangeText={classInput =>
                    this.setState({
                      className: classInput
                    })
                  }
                />

                <QcActionButton
                  text={strings.AddClass}
                  onPress={() => {
                    this.addNewClass();
                  }}
                  screen={this.name}
                />
              </View>
            </View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
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
    paddingTop: 25,
    alignItems: 'center',
    paddingBottom: 20,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: colors.white,
  },
  profilePic: {
    width: 130,
    height: 130,
    borderRadius: 65,
  },
  bottomContainer: {
    paddingTop: 15,
    flex: 1,
    backgroundColor: colors.white,
    alignItems: "center",
    flex: 1
  },
  textInputStyle: {
    backgroundColor: colors.lightGrey,
    borderColor: colors.darkGrey,
    width: 250,
    height: 40,
    textAlign: "center",
    alignItems: "center",
    justifyContent: "center"
  }

}
);

export default AddClassScreen;