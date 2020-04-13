import React from 'react';
import PropTypes from 'prop-types';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  View,
  FlatList,
} from 'react-native';
import colors from 'config/colors';
import FontLoadingComponent from './FontLoadingComponent';
import fontStyles from 'config/fontStyles';
import { screenHeight, screenWidth } from 'config/dimensions';
import { ListItem } from 'react-native-elements';
import strings from "config/strings";

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
      status,
    } = this.props;

    let actionItemConfig = [];
    actionItemConfig[strings.Memorization] = {
      color: colors.darkestGrey,
      iconName: "open-book",
      iconType: "entypo"
    };

    actionItemConfig[strings.Reading] = {
      color: colors.magenta,
      iconName: "book-open",
      iconType: "feather"
    };

    actionItemConfig[strings.Revision] = {
      color: colors.blue,
      iconName: "reminder",
      iconType: "material-community"
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
        <Image style={styles.profilePicStyle} source={profilePic} />
        <View style={styles.infoStyle}>
          <View
            style={{
              marginBottom: screenWidth * 0.004,
              marginLeft: 18,
            }}
          >
            <Text
              numberOfLines={1}
              style={[fontStyles.bigTextStyleDarkestGrey, { marginTop: 5 }]}
            >
              {studentName}
            </Text>
          </View>
          {currentAssignments &&
            currentAssignments.map((assignment, index) => (
              <ListItem
                key={assignment.name}
                title={assignment.name}
                titleStyle={[
                  fontStyles.mediumTextStyleDarkestGrey,
                  { flex: 1 }
                ]}
                subtitle={
                  assignment.isReadyEnum === 'NEED_HELP'
                    ? strings.NeedHelpNonCap
                    : assignment.isReadyEnum === 'READY'
                    ? strings.ReadyNonCap
                    : assignment.isReadyEnum === 'WORKING_ON_IT'
                    ? strings.WorkingOnItNonCap
                    : strings.NotStartedNonCap
                }
                subtitleStyle={[
                  fontStyles.smallTextStyleDarkGrey,
                  assignment.isReadyEnum === 'NEED_HELP'
                    ? { color: colors.darkRed }
                    : assignment.isReadyEnum === 'READY'
                    ? { color: colors.darkGreen }
                    : assignment.isReadyEnum === 'WORKING_ON_IT'
                    ? { color: colors.primaryDark }
                    : {},
                ]}
                chevron
                containerStyle={{
                  flex: 1,
                  borderRadius: 2,
                  marginLeft: 3,
                  width: screenWidth * 0.8,
                }}
                contentContainerStyle={{
                  flex: 2,
                }}
                //convert status to shorter strings to fit in the single line ListItem
                rightTitle={
                  assignment.type === strings.Memorization
                    ? strings.Memorize
                    : assignment.type === strings.Revision
                    ? strings.Review
                    : assignment.type === strings.Reading
                    ? strings.Read
                    : ""
                }
                rightTitleStyle={[
                  fontStyles.smallTextStyleDarkGrey,
                  { width: 65 },
                ]}
                bottomDivider={
                  index !== currentAssignments.length - 1 ? true : false
                }
                onPress={() => this.props.onAssignmentPress(index)}
              />
            ))}
        </View>
        {comp ? (
          <View style={styles.removeStudentStyle}>
            <TouchableOpacity
              style={{
                justifyContent: "center",
                alignItems: "center",
                height: screenHeight * 0.2,
                width: screenWidth * 0.2
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
  currentAssignments: PropTypes.string,
  onPress: PropTypes.func.isRequired,
};

//Styles that control the look of the card, and everything within it
const styles = StyleSheet.create({
  cardStyle: {
    flexDirection: 'row',
    marginRight: screenWidth * 0.017,
    minHeight: screenHeight * 0.112,
    alignItems: 'center',
    marginLeft: screenWidth * 0.017,
    marginTop: screenHeight * 0.01,
    fontFamily: 'Montserrat-Regular'
  },
  removeStudentStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginRight: screenWidth * 0.05,
    flex: 1
  },
  infoStyle: {
    flexDirection: 'column',
    justifyContent: 'center',
    fontFamily: 'Montserrat-Regular',
    flex: 4
  },
  profilePicStyle: {
    width: screenWidth * 0.12,
    height: screenWidth * 0.12,
    borderRadius: screenWidth * 0.06,
    marginLeft: screenWidth * 0.05
  },
});
