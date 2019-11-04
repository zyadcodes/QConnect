import React from "react";
import { View, StyleSheet, Dimensions, ImageBackground } from "react-native";
import QcActionButton from "components/QcActionButton";
import QcAppBanner from "components/QcAppBanner";
import strings from "../../../config/strings";
import QcParentScreen from "screens/QcParentScreen";
import FirebaseFunctions from 'config/FirebaseFunctions';
import QCView from 'components/QCView';
import screenStyle from 'config/screenStyle';
import { screenHeight, screenWidth } from 'config/dimensions';

const BG_IMAGE = require("assets/images/read_child_bg.jpg");

class AccountTypeScreen extends QcParentScreen {

  componentDidMount() {
    FirebaseFunctions.setCurrentScreen("Account Type Screen", "AccountTypeScreen");
  }

  //Navigates to the teacher side
  onTeacherFlow() {
    this.props.navigation.push('TeacherWelcomeScreen');
  }

  //Navigates to the student side
  onStudentFlow() {
    this.props.navigation.push('StudentWelcomeScreen');
  }

  render() {
    const { navigation } = this.props;
    return (
      <QCView style={screenStyle.container}>
        <ImageBackground source={BG_IMAGE} style={styles.bgImage}>
          <View style={{ flex: 3 }} />
          <QcAppBanner />
          <View style={styles.spacer} />
          <View style={{ flex: 1 }}>
            <QcActionButton
              navigation={navigation}
              text={strings.IAmATeacher}
              onPress={() => this.onTeacherFlow()}
              screen={this.name}
            />
            <View style={{ flex: 1 }} />
            <QcActionButton
              navigation={navigation}
              text={strings.IAmAStudent}
              onPress={() => this.onStudentFlow()}
              screen={this.name}
            />
          </View>
          <View style={{ flex: 1 }} />
        </ImageBackground>
      </QCView>
    );
  }
}

const styles = StyleSheet.create({
  spacer: {
    flex: 3
  },
  bgImage: {
    flex: 5,
    top: 0,
    left: 0,
    width: screenWidth,
    height: screenHeight,
    justifyContent: "center",
    alignItems: "center"
  }
});

export default AccountTypeScreen;
