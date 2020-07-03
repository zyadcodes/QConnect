import React from "react";
import { View, TextInput, Image, StyleSheet, Alert } from "react-native";
import colors from "config/colors";
import classImages from "config/classImages";
import QcActionButton from "components/QcActionButton/QcActionButton";
import QcParentScreen from "screens/QcParentScreen";
import ImageSelectionModal from "components/ImageSelectionModal/ImageSelectionModal"
import LoadingSpinner from 'components/LoadingSpinner/LoadingSpinner';
import FirebaseFunctions from 'config/FirebaseFunctions';
import strings from 'config/strings';
import TopBanner from 'components/TopBanner/TopBanner';
import QCView from 'QCView/QCView';
import screenStyle from 'config/screenStyle';
import { screenHeight, screenWidth } from 'config/dimensions';

export class AddClassScreen extends QcParentScreen {

  //----------------------- state -------------------------------------
  state = {
    className: "",
    classImageID: Math.floor(Math.random() * 10),
    modalVisible: false,
    isLoading: true,
    userID: "",
    teacher: "",
    isOpen: false,
    classes: '',
    addClassButton: false
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
  //disable add class button to prohibit duplication of a class feom having the same name
  disableAddClassButton(){
    this.setState({
      addClassButton: !this.state.addClassButton    
    });
  }


  // -------- event handlers, respond to user initiated events ----------
  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  onImageSelected(imageId) {
    this.setState({ classImageID: imageId })
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
    //End of check for bad input--------------------------------------------
    
    this.disableAddClassButton();
    
    let classInfo = {
      name: this.state.className,
      classImageID: this.state.classImageID,
      students: [],
      classInviteCode: '',
      teachers: [this.state.userID]
    };

    const newClassID = await FirebaseFunctions.addNewClass(classInfo, this.state.userID);
    const newClass = await FirebaseFunctions.getClassByID(newClassID);

    //Navigates to the class
    this.props.navigation.push("ShareClassCode", {
      classInviteCode: newClass.classInviteCode,
      currentClassID: newClassID,
      userID: this.state.userID,
      currentClass: newClass
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
      <QCView style={screenStyle.container}>
        <View style={{ flex: 1 }}>
          <TopBanner
            LeftIconName="angle-left"
            LeftOnPress={() => this.props.navigation.push("TeacherCurrentClass", {
              userID: this.state.userID
            })}
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
              source={classImages.images[this.state.classImageID]}
              ResizeMode="contain" />
            <TouchableText
              text={strings.EditClassImage}
              onPress={() => this.setModalVisible(true)} />
          </View>

          <View style={styles.bottomContainer}>
            <TextInput
              style={styles.textInputStyle}
              autoCorrect={false}
              placeholder={strings.WriteClassNameHere}
              onChangeText={classInput =>
                this.setState({
                  className: classInput
                })
              } />

            <QcActionButton
              disabled={this.state.addClassButton}
              text={strings.AddClass}
              onPress={() => {
                this.addNewClass();
                
              }}
              screen={this.name}
            />
          </View>
        </View>
      </QCView>
    );
  }
}

//Styles for the Teacher profile class
const styles = StyleSheet.create({
  picContainer: {
    paddingVertical: screenHeight * 0.033,
    alignItems: 'center',
    marginVertical: screenHeight * 0.015,
    backgroundColor: colors.white,
  },
  profilePic: {
    width: screenHeight * 0.10,
    height: screenHeight * 0.10,
    borderRadius: screenHeight * 0.10 / 2,
    marginBottom: screenHeight * 0.01
  },
  bottomContainer: {
    paddingTop: screenHeight * 0.022,
    flex: 1,
    backgroundColor: colors.white,
    alignItems: "center",
    flex: 1
  },
  textInputStyle: {
    marginLeft: screenWidth * 0.02,
    marginTop: screenHeight * 0.01,
    paddingVertical: screenHeight * 0.01,
    paddingLeft: screenWidth * 0.03,
    width: screenWidth * 0.95,
    backgroundColor: colors.veryLightGrey,
    borderRadius: 1
  },
});

export default AddClassScreen;