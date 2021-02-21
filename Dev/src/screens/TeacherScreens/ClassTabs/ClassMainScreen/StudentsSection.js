const StudentSection = props => (
    sectionTitle,
    sectionIcon,
    sectionIconType,
    studentsList,
    sectionColor,
    sectionBackgroundColor
  ) {
    const { currentClass, currentClassID, isEditing, userID } = this.state;

    return (
      <View>
        <View style={styles.studentSectionContainer}>
          <Icon
            name={sectionIcon}
            type={sectionIconType}
            color={sectionColor}
          />
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
                this.props.navigation.push("TeacherStudentProfile", {
                  userID: userID,
                  studentID: item.ID,
                  currentClass: currentClass,
                  classID: currentClassID
                })
              }
              onAssignmentPress={assignmentIndex => {
                if (assignmentIndex < 0) {
                  //go to the screen to a new assignment
                  this.props.navigation.push("MushafAssignmentScreen", {
                    newAssignment: true,
                    popOnClose: true,
                    onSaveAssignment: this.updateStateWithNewAssignmentInfo.bind(
                      this
                    ),
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
                  this.props.navigation.push("MushafAssignmentScreen", {
                    isTeacher: true,
                    assignToAllClass: false,
                    popOnClose: true,
                    onSaveAssignment: this.updateStateWithNewAssignmentInfo.bind(
                      this
                    ),
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
                this.removeStudent(item.ID);
              }}
            />
          )}
        />
      </View>
    );
  }