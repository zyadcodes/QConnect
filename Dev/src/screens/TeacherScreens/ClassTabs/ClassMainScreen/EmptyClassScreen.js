import React from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import strings from "config/strings";
import QcActionButton from "components/QcActionButton";
import TopBanner from "components/TopBanner";
import LeftNavPane from "../../LeftNavPane";
import SideMenu from "react-native-side-menu";
import QCView from "components/QCView";
import screenStyle from "config/screenStyle";
import fontStyles from "config/fontStyles";
import { screenHeight, screenWidth } from "config/dimensions";

const EmptyClassScreen = props => {
  const {
    teacher,
    userID,
    isOpen,
    classes,
    navigation,
    isEditing,
    setIsOpen,
    updateTitle,
    updatePicture,
    currentClass,
    currentClassID,
    classInviteCode
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
        <View style={styles.flexWide}>
          <TopBanner
            LeftIconName="navicon"
            LeftOnPress={() => setIsOpen(true)}
            isEditingTitle={isEditing}
            isEditingPicture={isEditing}
            Title={currentClass.name}
            onTitleChanged={newTitle => updateTitle(newTitle)}
            onEditingPicture={newPicture => updatePicture(newPicture)}
            profileImageID={currentClass.classImageID}
            RightIconName="edit"
            RightOnPress={() =>
              navigation.push("ShareClassCode", {
                classInviteCode,
                currentClassID,
                userID: userID,
                currentClass
              })
            }
          />
        </View>
        <View style={styles.emptyClassStyle}>
          <Text style={fontStyles.hugeTextStylePrimaryDark}>
            {strings.EmptyClass}
          </Text>

          <Image
            source={require("assets/emptyStateIdeas/welcome-girl.png")}
            style={styles.welcomeGirlImageStyle}
          />

          <QcActionButton
            text={strings.AddStudentButton}
            onPress={() =>
              navigation.push("ShareClassCode", {
                classInviteCode,
                currentClassID,
                userID: userID,
                currentClass
              })
            }
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
  },
  noClassStyle: {
    alignItems: "center",
    justifyContent: "flex-start",
    alignSelf: "center",
    flex: 2
  },
  welcomeImageStyle: {
    width: 0.73 * screenWidth,
    height: 0.22 * screenHeight,
    resizeMode: "contain",
    marginTop: 30
  },
  flexWide: { flex: 1, width: screenWidth },
  emptyClassStyle: {
    flex: 2,
    justifyContent: "flex-start",
    alignItems: "center",
    alignSelf: "center"
  },
  welcomeGirlImageStyle: {
    width: 0.73 * screenWidth,
    height: 0.22 * screenHeight,
    resizeMode: "contain"
  }
});
export default EmptyClassScreen;
