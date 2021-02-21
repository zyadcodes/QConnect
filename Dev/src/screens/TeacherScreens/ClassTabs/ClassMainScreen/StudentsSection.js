import React from "react";
import { View, Text, FlatList, StyleSheet, PixelRatio } from "react-native";
import { Icon } from "react-native-elements";
import fontStyles from "config/fontStyles";
import StudentMultiAssignmentsCard from "components/StudentMultiAssignmentsCard";
import { screenHeight, screenWidth } from "config/dimensions";
import colors from "config/colors";
import studentImages from "config/studentImages";

const StudentSection = props => {
  const {
    currentClass,
    currentClassID,
    isEditing,
    userID,
    sectionTitle,
    sectionIcon,
    sectionIconType,
    studentsList,
    sectionColor,
    sectionBackgroundColor,
    navigation,
    removeStudent,
    updateAssignment
  } = props;

  if (!studentsList || studentsList.length === 0) {
    return null;
  }

  
  return (
    <View>
      <View style={styles.studentSectionContainer}>
        <Icon name={sectionIcon} type={sectionIconType} color={sectionColor} />
        <Text
          style={[
            { marginLeft: screenWidth * 0.017 },
            fontStyles.mainTextStyleDarkRed,
            { color: sectionColor }
          ]}
        >
          {sectionTitle}
        </Text>
      </View>
      <FlatList
        data={studentsList}
        keyExtractor={item => item.name} // fix, should be item.id (add id to classes)
        renderItem={({ item }) => (
          <StudentMultiAssignmentsCard
            key={item.ID}
            studentName={item.name}
            profilePic={studentImages.images[item.profileImageID]}
            currentAssignments={item.currentAssignments}
            onPress={() =>
              navigation.push("TeacherStudentProfile", {
                userID: userID,
                studentID: item.ID,
                currentClass: currentClass,
                classID: currentClassID
              })
            }
            onAssignmentPress={assignmentIndex => {
              if (assignmentIndex < 0) {
                //go to the screen to a new assignment
                navigation.push("MushafAssignmentScreen", {
                  newAssignment: true,
                  popOnClose: true,
                  onSaveAssignment: updateAssignment,
                  isTeacher: true,
                  assignToAllClass: false,
                  userID: userID,
                  classID: currentClassID,
                  studentID: item.ID,
                  currentClass,
                  imageID: item.profileImageID
                });
              } else {
                //go to the passed in assignment
                let assignment = item.currentAssignments[assignmentIndex];
                navigation.push("MushafAssignmentScreen", {
                  isTeacher: true,
                  assignToAllClass: false,
                  popOnClose: true,
                  onSaveAssignment: updateAssignment,
                  userID: userID,
                  classID: currentClassID,
                  studentID: item.ID,
                  currentClass,
                  assignmentLocation: assignment.location,
                  assignmentType: assignment.type,
                  assignmentName: assignment.name,
                  assignmentIndex: assignmentIndex,
                  newAssignment: false,
                  imageID: item.profileImageID
                });
              }
            }}
            background={sectionBackgroundColor}
            comp={
              isEditing === true ? (
                <Icon
                  name="user-times"
                  size={PixelRatio.get() * 9}
                  type="font-awesome"
                  color={colors.primaryDark}
                />
              ) : null
            }
            compOnPress={() => {
              removeStudent(item.ID);
            }}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  studentSectionContainer: {
    alignItems: "center",
    marginLeft: screenWidth * 0.017,
    flexDirection: "row",
    paddingTop: screenHeight * 0.025
  }
});
export default StudentSection;
