/* eslint-disable no-extra-semi */
import React from "react";
import { View, FlatList, ScrollView, StyleSheet, Text } from "react-native";
import colors from "config/colors";
import classImages from "config/classImages";
import FirebaseFunctions from 'config/FirebaseFunctions';
import { SafeAreaView } from "react-navigation";
import QcAppBanner from "components/QcAppBanner";
import QcDrawerItem from "components/QcDrawerItem";
import teacherImages from "../../../config/teacherImages";
import strings from '../../../config/strings';
import QcParentScreen from "screens/QcParentScreen";
import QcActionButton from 'components/QcActionButton';
import QCView from 'components/QCView';
import screenStyle from 'config/screenStyle';
import fontStyles from 'config/fontStyles';

class LeftNavPane extends QcParentScreen {

  state = {
    teacher: this.props.teacher,
    userID: this.props.userID,
    classes: this.props.classes,
    deleteOrStopDeleteText: strings.deleteClass,
    backColor: colors.white,
    deleteBool: false
  }

  //Sets the screen name
  async componentDidMount() {

    FirebaseFunctions.setCurrentScreen("Teacher Left Nav Pane", "LeftNavPane");

  }

  async openClass(classID) {

    await FirebaseFunctions.updateTeacherObject(this.state.userID, {
      currentClassID: classID
    });
    FirebaseFunctions.logEvent("TEACHER_OPEN_CLASS");

    //navigate to the selected class by first getting the new teacher object
    this.props.navigation.push("TeacherCurrentClass", {
      userID: this.state.userID
    });
  };

  triggerDeleteClass() {
    let newText = this.state.deleteOrStopDeleteText === strings.deleteClass ? strings.finishDeleteClass : strings.deleteClass;
    let newColor = this.state.backColor === colors.white ? colors.red : colors.white;
    this.setState({
      deleteOrStopDeleteText: newText,
      backColor: newColor,
      deleteBool: !this.state.deleteBool
    });
  }

  //todo: change the ListItem header and footer below to the shared drawer component intead
  // generalize the QcDrawerItem to accept either an image or an icon
  render() {
    const { name, profileImageID } = this.state.teacher;
    const { classes } = this.state;
    const profileCaption = name + strings.sProfile;
    const teacherImageId = profileImageID ? profileImageID : 0;

    return (
      <QCView style={[screenStyle.container, { alignItems: 'flex-start' }]}>
        <ScrollView>
          <SafeAreaView
            forceInset={{ top: "always", horizontal: "never" }}
          >
            <View
              style={{
                padding: 10,
                alignContent: "center",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <View style={{ flexDirection: 'row' }}>
                <Text style={fontStyles.hugeTextStylePrimaryDark}>{strings.AppTitle}</Text>
              </View>
            </View>

            <QcDrawerItem
              title={profileCaption}
              image={teacherImages.images[teacherImageId]}
              onPress={() => {
                this.triggerDeleteClass();
                this.props.navigation.push("Profile", {
                  accountObject: this.state.teacher,
                  userID: this.state.userID,
                  classes: this.state.classes,
                  isTeacher: true
                })
              }}
            />

            <QcDrawerItem
              title={strings.Mushaf}
              image={classImages.images[8]}
              onPress={() => {
                this.props.navigation.push("MushafScreen")
              }} />

            <FlatList
              data={classes}
              extraData={this.state.deleteOrStopDeleteText}
              keyExtractor={(item, index) => item.name} // fix, should be item.id (add id to classes)
              renderItem={({ item, index }) => (
                <QcDrawerItem
                  title={item.name}
                  image={classImages.images[item.classImageID]}
                  onPress={async () => {
                    if (this.state.deleteBool === true) {
                      //Deletes the class
                      await FirebaseFunctions.deleteClass(item.ID, this.state.userID);
                      this.props.navigation.push("TeacherCurrentClass", {
                        userID: this.state.userID
                      });
                    } else {
                      this.openClass(item.ID);
                    }
                  }}
                  backColor={this.state.backColor}
                />
              )} />

            <QcDrawerItem
              title={strings.AddNewClass}
              icon="plus"
              onPress={() => {
                this.props.navigation.push("AddClass", {
                  userID: this.state.userID,
                  teacher: this.state.teacher
                })
              }} />

            <QcDrawerItem
              title={strings.Settings}
              icon="cogs"
              onPress={() => this.props.navigation.push("Settings", {
                isTeacher: true,
                teacher: this.state.teacher,
                userID: this.state.userID,
                classes: this.state.classes
              })} />

            <QcActionButton
              text={this.state.deleteOrStopDeleteText}
              onPress={() => this.triggerDeleteClass()} />

          </SafeAreaView>
        </ScrollView>
      </QCView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default LeftNavPane;

