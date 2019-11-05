import React from 'react';
import { View, Image, Text, StyleSheet, ScrollView, FlatList, TouchableHighlight, TouchableOpacity } from 'react-native';
import colors from 'config/colors';
import { Rating } from 'react-native-elements';
import strings from 'config/strings';
import studentImages from 'config/studentImages';
import QcParentScreen from 'screens/QcParentScreen';
import FirebaseFunctions from 'config/FirebaseFunctions';
import LoadingSpinner from 'components/LoadingSpinner';
import QCView from 'components/QCView';
import screenStyle from 'config/screenStyle';
import fontStyles from 'config/fontStyles';
import { screenHeight, screenWidth } from 'config/dimensions';

class StudentProfileScreen extends QcParentScreen {

  state = {
    studentID: this.props.navigation.state.params.studentID,
    currentClass: this.props.navigation.state.params.currentClass,
    classID: this.props.navigation.state.params.classID,
    currentAssignment: '',
    classStudent: '',
    isDialogVisible: false,
    isLoading: true,
    hasCurrentAssignment: ''
  }

  //Sets the screen for firebase analytics & fetches the correct student from this class
  async componentDidMount() {

    FirebaseFunctions.setCurrentScreen("Student Profile Screen", "StudentProfileScreen");
    const { currentClass, studentID } = this.state;
    const student = await currentClass.students.find((eachStudent) => {
      return eachStudent.ID === studentID;
    });

    this.setState({
      classStudent: student,
      currentAssignment: student.currentAssignment === "None"? strings.NoAssignmentsYet : student.currentAssignment,
      isLoading: false,
      hasCurrentAssignment: student.currentAssignment === 'None' ? false : true
    });

  }

  setDialogueVisible(visible) {
    this.setState({ isDialogVisible: visible })
  }

  getRatingCaption() {
    let caption = strings.GetStarted;

    const { averageRating } = this.state.classStudent;

    if (averageRating > 4) {
      caption = strings.OutStanding
    }
    else if (averageRating >= 3) {
      caption = strings.GreatJob
    }
    else if (averageRating > 0) {
      caption = strings.PracticePerfect
    }

    return caption
  }

  editAssignment(assignmentName){
    this.setState({
      currentAssignment: assignmentName
    });
  }


  //---------- main UI render ===============================
  render() {
    const { classStudent, isLoading, classID, studentID, hasCurrentAssignment, currentAssignment } = this.state;
    let { assignmentHistory, averageRating, name } = classStudent;

    //Sorts the assignments by date completed
    if (classStudent) {
      assignmentHistory = assignmentHistory.reverse();
    }

    //If the screen is loading, a spinner will display
    if (isLoading === true) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <LoadingSpinner isVisible={true} />
        </View>
      )
    }

    return (
      <QCView style={screenStyle.container}>
        <View style={styles.studentInfoContainer}>

          <View style={styles.profileInfo}>

            <View style={styles.profileInfoTop}>
              <View style={{ width: screenWidth * 0.24 }}>
              </View>
              <View style={styles.profileInfoTopRight}>
                <Text numberOfLines={1} style={fontStyles.bigTextStyleBlack}>{name.toUpperCase()}</Text>
                <View style={{ flexDirection: 'row', height: 0.037 * screenHeight }}>
                  <Rating readonly={true} startingValue={averageRating} imageSize={25} />
                  <View style={{ flexDirection: 'column', justifyContent: 'center' }}>
                    <Text style={fontStyles.bigTextStyleDarkGrey}>{averageRating === 0 ? "" : parseFloat(averageRating).toFixed(1)}</Text>
                  </View>
                </View>
                <Text style={fontStyles.mainTextStylePrimaryDark}>{this.getRatingCaption()}</Text>
              </View>
            </View>

            <View style={styles.profileInfoBottom}>
              <View style={styles.profileInfoTopLeft}>
                <Image
                  style={styles.profilePic}
                  source={studentImages.images[classStudent.profileImageID]} />
              </View>
              <View style={{ flex: 1, flexDirection: 'column', height: 0.086 * screenHeight, paddingLeft: screenWidth * 0.05 }}>
                <Text numberOfLines={1} style={[fontStyles.bigTextStyleDarkGrey, { textAlign: 'left' }]}>{this.state.currentAssignment.toUpperCase()}</Text>
                <View style={{ flexDirection: 'row' }}>

                  <TouchableHighlight
                    onPress={() => { this.props.navigation.push("MushafScreen", {
                      invokedFromProfileScreen: true,
                      assignToAllClass: false,
                      userID: this.props.navigation.state.params.userID,
                      classID, 
                      studentID, 
                      assignmentLocation: classStudent.currentAssignmentLocation,
                      assignmentType: classStudent.currentAssignmentType,
                      assignmentName: currentAssignment,
                      imageID: classStudent.profileImageID,
                      onSaveAssignment: this.editAssignment.bind(this) }) 
                      }}>
                    <Text style={fontStyles.mainTextStylePrimaryDark}>{classStudent.currentAssignment === "None" ? strings.AddAssignment : strings.EditAssignment}</Text>
                  </TouchableHighlight>

                  {hasCurrentAssignment ? <TouchableHighlight onPress={() =>
                    this.props.navigation.push("EvaluationPage", {
                      classID: classID,
                      studentID: studentID,
                      assignmentName: currentAssignment,
                      userID: this.props.navigation.state.params.userID,
                      classStudent: classStudent,
                      assignmentLocation: classStudent.currentAssignmentLocation,
                      assignmentType: classStudent.currentAssignmentType,
                      newAssignment: true,
                      readOnly: false,
                    })} >
                    <View style={{ paddingLeft: screenWidth * 0.02 }}>
                      <Text style={fontStyles.mainTextStylePrimaryDark}>{strings.Grade}</Text>
                    </View>
                  </TouchableHighlight> : <View />}
                </View>
              </View>
            </View>

          </View>

          <ScrollView style={styles.prevAssignments}>

            <FlatList
              data={assignmentHistory}
              keyExtractor={(item, index) => item.name + index}
              renderItem={({ item, index }) => (
                <TouchableOpacity onPress={() => this.props.navigation.push("EvaluationPage", {
                  classID: classID,
                  studentID: studentID,
                  classStudent: classStudent,
                  assignmentName: item.name,
                  completionDate: item.completionDate,
                  rating: item.evaluation.rating,
                  notes: item.evaluation.notes,
                  improvementAreas: item.evaluation.improvementAreas,
                  userID: this.props.navigation.state.params.userID,
                  evaluationObject: item.evaluation,
                  evaluationID: item.ID,
                  readOnly: true,
                  newAssignment: false,
                })}>
                  <View style={{...styles.prevAssignmentCard, minHeight: 0.1 * screenHeight}} key={index}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                      <View style={{ flex: 2, justifyContent: 'center', alignItems: 'flex-start' }}>
                        <Text style={fontStyles.smallTextStylePrimaryDark}>{item.completionDate}</Text>
                      </View>
                      <View style={{ alignItems: 'center', justifyContent: 'center', flex: 5 }}>
                        <Text numberOfLines={1} style={fontStyles.mainTextStyleBlack}>{item.name}</Text>
                      </View>
                      <View style={{ flex: 2, justifyContent: 'center', alignItems: 'flex-end', paddingLeft: screenWidth * 0.005 }}>
                        <Rating readonly={true} startingValue={item.evaluation.rating} imageSize={15} />
                      </View>
                    </View>
                    {item.evaluation.notes ?
                      <Text numberOfLines={2} style={fontStyles.mainTextStyleBlack}>{strings.NotesColon + item.evaluation.notes}</Text>
                      : <View />
                    }
                    {
                      item.assignmentType !== undefined && item.assignmentType !=="None" ? (
                        <View style={{ flexWrap: 'wrap', paddingTop: screenHeight * 0.005, justifyContent: 'flex-start', height: screenHeight * 0.03 }}>
                          <Text style={[styles.corner, {
                            backgroundColor: item.assignmentType === strings.Reading ? colors.grey :
                              (item.assignmentType === strings.Memorization ? colors.green : colors.darkishGrey)
                          }]}>{item.assignmentType}</Text>
                        </View>
                      ) : (
                          <View></View>
                        )
                    }
                    {item.evaluation.improvementAreas && item.evaluation.improvementAreas.length > 0 ?
                      <View style={{ flexDirection: 'row', paddingTop: screenHeight * 0.005, justifyContent: 'flex-start', height: screenHeight * 0.04 }}>
                        <Text style={[fontStyles.smallTextStyleBlack, { alignSelf: 'center' }]}>{strings.ImprovementAreas}</Text>
                        {item.evaluation.improvementAreas.map((tag) => { return (<Text key={tag} style={styles.corner}>{tag}</Text>) })}
                      </View>
                      : <View style={{height: 10}}></View>
                    }
                  </View>
                </TouchableOpacity>
              )}
            />
          </ScrollView>
        </View>
      </QCView>
    );
  }
};

//styles for the entire page
const styles = StyleSheet.create({
  studentInfoContainer: {
    marginVertical: 0.005 * screenHeight,
    backgroundColor: colors.white,
    flex: 1,
    borderColor: colors.lightGrey,
    borderWidth: 1,
    justifyContent: "flex-end"
  },
  profileInfo: {
    flexDirection: 'column',
    backgroundColor: colors.white,
    marginBottom: 0.001 * screenHeight
  },
  corner: {
    borderColor: '#D0D0D0',
    borderWidth: 1,
    borderRadius: screenHeight * 0.004,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: screenWidth * 0.012,
    marginRight: screenHeight * 0.012,
    marginVertical: screenHeight * 0.004,
  },
  profileInfoTop: {
    paddingHorizontal: screenWidth * 0.024,
    paddingTop: screenHeight * 0.015,
    flexDirection: 'row',
    borderBottomColor: colors.lightGrey,
    borderBottomWidth: 1,
  },
  profileInfoTopLeft: {
    flexDirection: 'column',
    marginLeft: 0.007 * screenWidth,
    marginTop: -0.097 * screenHeight,
    alignItems: 'center',
    width: 0.24 * screenWidth
  },
  profileInfoTopRight: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    paddingLeft: screenWidth * 0.05,
    paddingBottom: 0.007 * screenHeight,
  },
  profileInfoBottom: {
    flexDirection: 'row',
    paddingHorizontal: 0.024 * screenWidth,
    borderBottomColor: colors.grey,
    borderBottomWidth: 1
  },
  profilePic: {
    width: 0.10 * screenHeight,
    height: 0.10 * screenHeight,
    borderRadius: 0.075 * screenHeight,
    paddingBottom: 0.015 * screenHeight
  },
  prevAssignments: {
    flexDirection: 'column',
    backgroundColor: colors.white,
    marginHorizontal: 0.017 * screenWidth
  },
  prevAssignmentCard: {
    flexDirection: 'column',
    borderBottomColor: colors.lightGrey,
    borderBottomWidth: 1,
    paddingHorizontal: screenWidth * 0.007,
    paddingVertical: screenHeight * 0.005
  },
});

export default StudentProfileScreen;