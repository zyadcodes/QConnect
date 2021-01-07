//This will be the actual drawer items that will display from the student side when the click on
//the hamburger icon
import React from "react";
import {
  View,
  FlatList,
  ScrollView,
  StyleSheet,
  Modal,
  Text,
  Alert,
  TextInput,
  Image
} from "react-native";
import colors from "config/colors";
import classImages from "config/classImages";
import { SafeAreaView } from "react-navigation";
import QcDrawerItem from "components/QcDrawerItem";
import studentImages from "config/studentImages";
import strings from "config/strings";
import QcParentScreen from "screens/QcParentScreen";
import { Input } from "react-native-elements";
import { screenHeight, screenWidth } from "config/dimensions";
import QcActionButton from "components/QcActionButton";
import FirebaseFunctions from "config/FirebaseFunctions";
import LoadingSpinner from "components/LoadingSpinner";
import QCView from "components/QCView";
import screenStyle from "config/screenStyle";
import CodeInput from "react-native-confirmation-code-input";
import fontStyles from "config/fontStyles";

class LeftNavPane extends QcParentScreen {
  state = {
    student: this.props.student,
    userID: this.props.userID,
    classes: this.props.classes,
    modalVisible: false,
    classCode: "",
    isLoading: false,
  };

  //Sets the screen name for firebase analytics
  componentDidMount() {
    FirebaseFunctions.setCurrentScreen("Student Left Nav Pane", "LeftNavPane");
  }

  //Joins the class by first testing if this class exists. If the class doesn't exist, then it will
  //alert the user that it does not exist. If the class does exist, then it will join the class, and
  //navigate to the current class screen.
  async joinClass() {
    this.setState({ isLoading: true });
    const { userID, classCode, student } = this.state;

    if (student.classes.includes(classCode)) {
      Alert.alert(strings.Whoops, strings.ClassAlreadyJoined);
      this.setState({ isLoading: false });
    } else {
      const didJoinClass = await FirebaseFunctions.joinClass(
        student,
        classCode
      );
      if (didJoinClass === -1) {
        this.setState({ isLoading: false, modalVisible: false }, () => {
          //todo: hack hack.. alerts and modals don't play well with each other.
          // currently we show an infinite spinner in this case.
          // this is an ugly quick workaround.
          // the right fix is to display an error string right in the modal instead.
          setTimeout(() => {
            Alert.alert(strings.Whoops, strings.IncorrectClassCode);
          }, 200);
        });
      } else {
        //Refetches the student object to reflect the updated database
        this.setState({
          isLoading: false,
          modalVisible: false,
        });
        this.props.navigation.push("StudentCurrentClass", {
          userID
        });
      }
    }
  }

  async openClass(id) {
    //update current class index in firebase
    await FirebaseFunctions.updateStudentObject(this.state.userID, {
      currentClassID: id,
    });

    //navigate to the selected class
    this.props.navigation.push("StudentCurrentClass", {
      userID: this.state.userID,
    });
  }

  //todo: change the ListItem header and footer below to the shared drawer component intead
  //generalize the QcDrawerItem to accept either an image or an icon
  render() {
    const { student, classes } = this.state;
    const { name, profileImageID } = student;

    const profileCaption = name + strings.sProfile;
    const studentImageId = profileImageID;
    const { classCode } = this.state;

    return (
      <ScrollView bounces={false}>
        <SafeAreaView forceInset={{ top: "always", horizontal: "never" }}>
          <View
            style={{
              paddingTop: 0.015 * screenHeight,
              paddingBottom: 0.015 * screenHeight,
              paddingLeft: screenWidth * 0.025,
              paddingRight: screenWidth * 0.025,
              alignContent: "center",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <Text style={fontStyles.hugeTextStylePrimaryDark}>
                {strings.AppTitle}
              </Text>
            </View>
          </View>

          <QcDrawerItem
            title={profileCaption}
            image={studentImages.images[studentImageId]}
            onPress={() =>
              this.props.navigation.push("Profile", {
                isTeacher: false,
                accountObject: this.state.student,
                classes: this.state.classes,
                userID: this.state.userID
              })
            }
          />

          <FlatList
            data={classes}
            accessibilityLabel="StudentLeftNavMenu"
            keyExtractor={(item, index) => item.name}
            renderItem={({ item, index }) => (
              <QcDrawerItem
                title={item.name}
                image={classImages.images[item.classImageID]}
                onPress={() => this.openClass(item.ID)}
              />
            )}
          />

          <QcDrawerItem
            title={strings.JoinClass}
            icon="plus"
            onPress={() => {
              this.setState({ modalVisible: true });
            }}
          />
          <QcDrawerItem
            title={strings.Settings}
            icon="cogs"
            onPress={() =>
              this.props.navigation.push("Settings", {
                isStudent: true,
                userID: this.state.userID,
                student: this.state.student,
                classes: this.state.classes
              })
            }
          />
          <Modal
            animationType="fade"
            style={{ alignItems: "center", justifyContent: "center" }}
            transparent={true}
            presentationStyle="overFullScreen"
            visible={this.state.modalVisible}
            onRequestClose={() => {}}
          >
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                alignSelf: "center",
                paddingTop: screenHeight / 3
              }}
            >
              <View style={styles.modal}>
                {this.state.isLoading === true ? (
                  <View>
                    <LoadingSpinner isVisible={true} />
                  </View>
                ) : (
                  <View>
                    <View
                      style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center"
                      }}
                    >
                      <Image
                        source={require("assets/emptyStateIdeas/welcome-girl.png")}
                        style={{
                          width: 50,
                          height: 100,
                          resizeMode: "contain",
                          marginTop: 20,
                        }}
                      />
                      <Text
                        style={[
                          fontStyles.mainTextStyleDarkGrey,
                          { marginBottom: 20 },
                        ]}
                      >
                        {strings.TypeInAClassCode}
                      </Text>
                    </View>
                    <View
                      style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center"
                      }}
                    >
                      <TextInput
                        style={[
                          styles.textInputStyle,
                          fontStyles.hugeTextStyleBlack
                        ]}
                        underlineColorAndroid="transparent"
                        selectionColor={colors.primaryDark}
                        keyboardType={"name-phone-pad"}
                        returnKeyType={"done"}
                        autoCapitalize="none"
                        autoFocus={true}
                        onChangeText={code =>
                          this.setState({ classCode: code })
                        }
                        maxLength={5}
                      />
                      {/* <CodeInput
                        space={2}
                        size={50}
                        codeLength={5}
                        activeColor={colors.primaryDark}
                        inactiveColor={colors.primaryLight}
                        autoFocus={true}
                        inputPosition="center"
                        className="border-circle"
                        containerStyle={{ marginBottom: 60 }}
                        codeInputStyle={{ borderWidth: 1.5 }}
                        onFulfill={code => this.setState({ classCode: code })}
                      /> */}
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between"
                      }}
                    >
                      <QcActionButton
                        text={strings.Cancel}
                        onPress={() => {
                          this.setState({ modalVisible: false });
                        }}
                      />
                      <QcActionButton
                        text={strings.Confirm}
                        onPress={() => {
                          //Joins the class
                          this.joinClass();
                        }}
                      />
                    </View>
                  </View>
                )}
              </View>
            </View>
          </Modal>
        </SafeAreaView>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  modal: {
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    height: 300,
    width: screenWidth * 0.75,
    borderWidth: screenHeight * 0.003,
    borderRadius: screenHeight * 0.003,
    borderColor: colors.grey,
    shadowColor: colors.darkGrey,
    shadowOffset: { width: 0, height: screenHeight * 0.003 },
    shadowOpacity: 0.8,
    shadowRadius: screenHeight * 0.0045,
    elevation: screenHeight * 0.003,
  },
  textInputStyle: {
    marginLeft: 2,
    marginTop: screenHeight * 0.01,
    paddingVertical: screenHeight * 0.01,
    paddingLeft: screenWidth * 0.03,
    width: screenWidth * 0.7,
    backgroundColor: colors.veryLightGrey,
    borderRadius: 1,
    textAlign: "center",
    color: colors.black,
  },
  CodeInputCell: {
    width: 40,
    height: 40,
    lineHeight: 38,
    fontSize: 24,
    borderWidth: 2,
    borderColor: "#00000030",
    textAlign: "center",
  },
  OnCellFocus: {
    backgroundColor: "#fff",
  }
});

export default LeftNavPane;
