import React from "react";
import PropTypes from "prop-types";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  View,
  FlatList
} from "react-native";
import colors from "config/colors";
import FontLoadingComponent from "./FontLoadingComponent";
import fontStyles from "config/fontStyles";
import { screenHeight, screenWidth } from "config/dimensions";
import { ListItem } from "react-native-elements";
import strings from 'config/strings';
import { Avatar } from "react-native-elements";

/*Class represents the student card that will show up in the list of students
 *from the teachers view.
 *Each card will have a student name, a profile picture for the student, and the student's
 *current assignment.
 *The card will also be able to be pressed which controls the color of the card (Student Status)
 */
export default class StudentMultiAssignmentsCard extends FontLoadingComponent {
  render() {
    //The properties of the component.
    const {
      studentName,
      profilePic,
      currentAssignments,
      background,
      onPress,
      comp,
      compOnPress,
      status
    } = this.props;

    let assignmentTypes = [];
    assignmentTypes[strings.Memorization] = {
      color: colors.darkGreen,
      iconName: 'brain',
      iconType: 'material-community',
      name: strings.Memorize
    };

    assignmentTypes[strings.Reading] = {
      color: colors.magenta,
      iconName: 'book-open',
      iconType: 'feather',
      name: strings.Read
    };

    assignmentTypes[strings.Revision] = {
      color: colors.blue,
      iconName: 'redo',
      iconType: 'evilicon',
      name: strings.Review
    };

    return (
      //The style of the card as a whole. Inside the card, you have the image,
      //student name, and student assignment
      <TouchableOpacity
        style={[styles.cardStyle, { backgroundColor: colors.white }]}
        borderColor={colors.black}
        //The on press function is for when the teacher clicks the card, the color of it
        //should change depending on the behavior (i.e attendance screen)
        onPress={() => {
          onPress();
        }}
      >
        <View
          style={{
            alignItems: "flex-start",
            alignSelf: "flex-start",
            justifyContent: "flex-start",
            marginTop: 10,
          }}
        >
          <Image style={styles.profilePicStyle} source={profilePic} />
        </View>
        <View style={styles.infoStyle}>
          <ListItem
            key={studentName}
            title={studentName}
            titleStyle={[fontStyles.bigTextStyleDarkestGrey, { flex: 1 }]}
            chevron
            containerStyle={{
              flex: 1,
              borderRadius: 2,
              marginLeft: 3,
              width: screenWidth * 0.8
            }}
            contentContainerStyle={{
              flex: 2
            }}
            //convert status to shorter strings to fit in the single line ListItem
            rightTitle={strings.GoToProfile}
            rightTitleStyle={[
              fontStyles.smallTextStylePrimaryDark,
              { width: 85 }
            ]}
          />
          {currentAssignments && currentAssignments.length > 0 && (
            <View
              style={{
                flexDirection: 'row',
                paddingLeft: 18,
                paddingBottom: 10,
              }}
            >
              {/* <Icon
                name="book-open-outline"
                type="material-community"
                size={15}
                color={colors.darkGrey}
              /> */}
              <Text style={[fontStyles.mainTextStyleDarkGrey]}>
                {currentAssignments.length === 1
                  ? strings.CurrentAssignment + ":"
                  : strings.CurrentAssignments + ":"}
              </Text>
            </View>
          )}
          {currentAssignments &&
            currentAssignments.map((assignment, index) => (
              <ListItem
                key={assignment.name}
                title={assignment.name}
                titleStyle={[
                  fontStyles.mediumTextStyleDarkestGrey,
                  { flex: 1 },
                ]}
                subtitle={
                  assignment.isReadyEnum === "NEED_HELP"
                    ? strings.NeedHelpNonCap
                    : assignment.isReadyEnum === "READY"
                    ? strings.ReadyNonCap
                    : assignment.isReadyEnum === "WORKING_ON_IT"
                    ? strings.WorkingOnItNonCap
                    : strings.NotStartedNonCap
                }
                subtitleStyle={[
                  fontStyles.smallTextStyleDarkGrey,
                  assignment.isReadyEnum === "NEED_HELP"
                    ? { color: colors.darkRed }
                    : assignment.isReadyEnum === "READY"
                    ? { color: colors.darkGreen }
                    : assignment.isReadyEnum === "WORKING_ON_IT"
                    ? { color: colors.primaryDark }
                    : {}
                ]}
                chevron
                containerStyle={{
                  flex: 1,
                  borderRadius: 2,
                  marginLeft: 3,
                  width: screenWidth * 0.8
                }}
                contentContainerStyle={{
                  flex: 2
                }}
                leftElement={
                  <View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: 40,
                    }}
                  >
                    <Avatar
                      rounded
                      icon={{
                        name: assignmentTypes[assignment.type].iconName,
                        type: assignmentTypes[assignment.type].iconType,
                        color: colors.white,
                      }}
                      overlayContainerStyle={{
                        backgroundColor: assignmentTypes[assignment.type].color,
                      }}
                    />
                    <Text
                      style={[
                        fontStyles.smallestTextStyleDarkGrey,
                        { width: 45, textAlign: "center", paddingTop: 3 },
                      ]}
                    >
                      {assignmentTypes[assignment.type].name}
                    </Text>
                  </View>
                }
                //convert status to shorter strings to fit in the single line ListItem
                rightTitle="Open"
                rightTitleStyle={[
                  fontStyles.smallestTextStyleDarkGrey,
                  { width: 25 }
                ]}
                bottomDivider={
                  index !== currentAssignments.length - 1 ? true : false
                }
                topDivider={index === 0 ? true : false}
                onPress={() => this.props.onAssignmentPress(index)}
              />
            ))}
        </View>
        {comp ? (
          <View style={styles.removeStudentStyle}>
            <TouchableOpacity
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                height: screenHeight * 0.2,
                width: screenWidth * 0.2,
              }}
              onPress={() => {
                compOnPress();
              }}
            >
              {comp}
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.removeStudentStyle} />
        )}
      </TouchableOpacity>
    );
  }
}

/*
 *Makes sure properties that are passed into component are valid. The student name must be a string,
 *the source of the image must be a number, the current assignment is also a string, and the onPress
 *must be a function
 */
StudentMultiAssignmentsCard.propTypes = {
  studentName: PropTypes.string.isRequired,
  profilePic: PropTypes.number.isRequired,
  currentAssignments: PropTypes.array,
  onPress: PropTypes.func.isRequired
};

//Styles that control the look of the card, and everything within it
const styles = StyleSheet.create({
  cardStyle: {
    flexDirection: "row",
    marginRight: screenWidth * 0.017,
    minHeight: screenHeight * 0.112,
    alignItems: "center",
    marginLeft: screenWidth * 0.017,
    marginTop: screenHeight * 0.01,
    fontFamily: "Montserrat-Regular"
  },
  removeStudentStyle: {
    flexDirection: "row",
    justifyContent: "center",
    marginRight: screenWidth * 0.05,
    flex: 1,
  },
  infoStyle: {
    flexDirection: "column",
    justifyContent: "center",
    fontFamily: "Montserrat-Regular",
    flex: 4,
  },
  profilePicStyle: {
    width: screenWidth * 0.12,
    height: screenWidth * 0.12,
    borderRadius: screenWidth * 0.06,
    marginLeft: screenWidth * 0.05,
  }
});
