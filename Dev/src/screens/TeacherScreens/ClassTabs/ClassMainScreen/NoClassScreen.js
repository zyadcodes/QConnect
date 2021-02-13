import React from "react";
import { View, StyleSheet, Text, Image } from "react-native";
import TopBanner from "components/TopBanner";
import LeftNavPane from "../../LeftNavPane";
import SideMenu from "react-native-side-menu";
import QCView from "components/QCView";
import screenStyle from "config/screenStyle";
import QcActionButton from "components/QcActionButton";
import fontStyles from "config/fontStyles";
import strings from "config/strings";
import { screenWidth } from "config/dimensions";

/**
 * ------Overview:
 * The Page will display a message that will redirect the teacher to the
 * create a new class
 *
 * ------Components:
 * We are using a touchable opacity with a large message telling the
 * teacher that there are no students in the class, and a smaller message
 * telling the teacher to click the text to create a new class.
 *
 * ------Conditonal:
 * The conditional will check to see if the length of the classes array is 0,
 * if it is, then teacher has no classes yet
 * triggering the message. */
const NoClassScreen = props => {
  const {
    teacher,
    userID,
    currentClass,
    isOpen,
    classes,
    isEditing,
    navigation
  } = props;
  return (
    <SideMenu
      isOpen={isOpen}
      menu={
        <LeftNavPane
          teacher={teacher}
          userID={userID}
          classes={classes}
          edgeHitWidth={0}
          navigation={navigation}
        />
      }
    >
      <QCView style={screenStyle.container}>
        <View style={styles.topBannerContainer}>
          <TopBanner
            LeftIconName="navicon"
            LeftOnPress={() => this.setState({ isOpen: true })}
            isEditingTitle={isEditing}
            isEditingPicture={isEditing}
            onEditingPicture={newPicture => this.updatePicture(newPicture)}
            Title={"Quran Connect"}
            onTitleChanged={newTitle => this.updateTitle(newTitle)}
            profileImageID={currentClass.classImageID}
          />
        </View>
        <View style={styles.noClassStyle}>
          <Text style={fontStyles.hugeTextStylePrimaryDark}>
            {strings.NoClass}
          </Text>

          <Image
            source={require("assets/emptyStateIdeas/welcome-girl.png")}
            style={styles.welcomeImageStyle}
          />

          <QcActionButton
            text={strings.AddClassButton}
            onPress={() => {
              navigation.push("AddClass", {
                userID: userID,
                teacher: teacher
              });
            }}
          />
        </View>
      </QCView>
    </SideMenu>
  );
};

const styles = StyleSheet.create({
  topBannerContainer: {
    flex: 1,
    width: screenWidth
  }
});
export default NoClassScreen;
