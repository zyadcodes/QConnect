import React from 'react'
import { StyleSheet, View, Text, TextInput, Image, Alert, ScrollView } from 'react-native'
import { AirbnbRating } from 'react-native-elements';
import colors from 'config/colors';
import QcActionButton from 'components/QcActionButton';
import strings from 'config/strings';
import studentImages from 'config/studentImages';
import QcParentScreen from 'screens/QcParentScreen';
import FlowLayout from 'components/FlowLayout';
import TopBanner from 'components/TopBanner';
import FirebaseFunctions from 'config/FirebaseFunctions';
import LoadingSpinner from 'components/LoadingSpinner';
import QCView from 'components/QCView';
import screenStyle from 'config/screenStyle';
import fontStyles from 'config/fontStyles';


export class EvaluationPage extends QcParentScreen {

  //Default improvement areas
  areas = [strings.Memorization, strings.Makharej, strings.Edgham, strings.Ekhfae, strings.RulingsOfRaa, strings.Muduud, strings.Qalqalah]

  state = {
    notes: this.props.navigation.state.params.notes ? this.props.navigation.state.params.notes : "",
    improvementAreas: this.props.navigation.state.params.readOnly === true ? this.props.navigation.state.params.improvementAreas : this.areas,
    readOnly: this.props.navigation.state.params.readOnly,
    classID: this.props.navigation.state.params.classID,
    studentID: this.props.navigation.state.params.studentID,
    classStudent: this.props.navigation.state.params.classStudent,
    assignmentName: this.props.navigation.state.params.assignmentName,
    isLoading: true,
    rating: this.props.navigation.state.params.rating ? this.props.navigation.state.params.rating : 0,
    studentObject: ''
  }

  //Sets the screen name according to whether this is a new assignment evaluation or an old one
  async componentDidMount() {

    if (this.state.readOnly === true) {
      FirebaseFunctions.setCurrentScreen("Past Evaluation Page", "EvaluationPage");
    } else {
      FirebaseFunctions.setCurrentScreen("New Evaluation Page", "EvaluationPage");
    }

    //Refetches the class ID in order to fetch the most up to date of the student object
    const currentClass = await FirebaseFunctions.getClassByID(this.state.classID);
    const classStudent = await currentClass.students.find((eachStudent) => {
      return eachStudent.ID === this.state.studentID;
    });

    const studentObject = await FirebaseFunctions.getStudentByID(this.state.studentID);

    //Fetches the ID for the evaluation (if there is none, it is created)
    const evaluationID = this.props.navigation.state.params.evaluationID ? this.props.navigation.state.params.evaluationID : (this.state.studentID + (this.state.classStudent.totalAssignments + 1) + "");
    this.setState({ studentObject, isLoading: false, evaluationID, classStudent });

  }
  // --------------  Updates state to reflect a change in a category rating --------------

  //Saves the evaluation as a new assignment
  async doSubmitRating() {

    let { rating, notes, improvementAreas, assignmentName, classID, studentID, classStudent, evaluationID } = this.state;
    notes = notes.trim();
    let evaluationDetails = {
      ID: evaluationID,
      name: assignmentName,
      assignmentType: classStudent.currentAssignmentType ? classStudent.currentAssignmentType : "None",
      completionDate: new Date().toLocaleDateString("en-US", {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }),
      evaluation: {
        rating,
        notes,
        improvementAreas,
      }
    }
    this.setState({ isLoading: true });
    await FirebaseFunctions.completeCurrentAssignment(classID, studentID, evaluationDetails);
    const currentClass = await FirebaseFunctions.getClassByID(this.state.classID);
    this.setState({ isLoading: false });

    this.props.navigation.push("TeacherStudentProfile", {
      studentID: this.state.studentID,
      currentClass,
      userID: this.props.navigation.state.params.userID,
      classID: this.state.classID
    });

  }

  //Overwrites a previously saved assignment with the new data
  async overwriteOldEvaluation() {

    const { classID, studentID, evaluationID, notes, rating, improvementAreas, classStudent } = this.state;

    this.setState({ isLoading: true });
    let evaluationDetails = {
      rating,
      notes,
      improvementAreas,
      assignmentType: classStudent.currentAssignmentType ? classStudent.currentAssignmentType : "None",
    }

    await FirebaseFunctions.overwriteOldEvaluation(classID, studentID, evaluationID, evaluationDetails);

    const currentClass = await FirebaseFunctions.getClassByID(this.state.classID);
    this.props.navigation.push("TeacherStudentProfile", {
      studentID: this.state.studentID,
      currentClass,
      userID: this.props.navigation.state.params.userID,
      classID: this.state.classID
    });

  }

  //------------  Ensures a rating is inputted before submitting it -------
  submitRating() {
    if (this.state.rating === 0) {
      Alert.alert(
        'No Rating',
        strings.AreYouSureYouWantToProceed,
        [
          {
            text: 'Yes', style: 'cancel', onPress: () => {
              if (this.props.navigation.state.params.newAssignment === true) {
                this.doSubmitRating()
              } else {
                this.overwriteOldEvaluation();
              }
            }
          },
          { text: 'No', style: 'cancel' }
        ]
      );
    } else {
      this.setState({ isLoading: true });
      if (this.props.navigation.state.params.newAssignment === true) {
        this.doSubmitRating()
      } else {
        this.overwriteOldEvaluation();
      }
    }
  }

  // --------------  Renders Evaluation scree UI --------------
  render() {
    if (isLoading === true) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <LoadingSpinner isVisible={true} />
        </View>
      )
    }
    const { notes, improvementAreas, readOnly, rating, classID, studentID, classStudent, assignmentName, isLoading, studentObject } = this.state;
    const { profileImageID } = studentObject;
    headerTitle = readOnly ? strings.Completed + ": " + this.props.navigation.state.params.completionDate : strings.HowWas + classStudent.name + strings.sTasmee3;
    return (
      //----- outer view, gray background ------------------------
      //Makes it so keyboard is dismissed when clicked somewhere else

      <QCView style={screenStyle.container}>
        <ScrollView>
          {this.props.navigation.state.params.newAssignment === true ? <TopBanner
            LeftIconName="angle-left"
            LeftOnPress={() => this.props.navigation.goBack()}
            Title={strings.Evaluation}
          /> :
            readOnly === true && !this.props.navigation.state.params.isStudentSide ? <TopBanner
              LeftIconName="angle-left"
              LeftOnPress={() => this.props.navigation.goBack()}
              Title={strings.Evaluation}
              RightIconName="edit"
              RightOnPress={() => { this.setState({ readOnly: false, improvementAreas: this.state.improvementAreas }) }}
            /> : <TopBanner
                LeftIconName="angle-left"
                LeftOnPress={() => this.props.navigation.goBack()}
                Title={strings.Evaluation}
              />}
          <View style={styles.evaluationContainer}>
            <View style={styles.section}>
              <Image source={studentImages.images[profileImageID]}
                style={styles.profilePic} />
              <Text style={fontStyles.bigTextStyleDarkGrey}>{classStudent.name}</Text>
              <Text style={fontStyles.mainTextStylePrimaryDark}>{assignmentName}</Text>
            </View>

            <View style={styles.section}>
              <Text style={fontStyles.mainTextStyleDarkGrey}>{headerTitle}</Text>
              <View style={{ paddingVertical: 15 }}>
                <AirbnbRating
                  defaultRating={rating}
                  size={30}
                  showRating={false}
                  onFinishRating={(value) => this.setState({
                    rating: value
                  })}
                  isDisabled={readOnly}
                />
              </View>

              <TextInput
                style={styles.notesStyle}
                multiline={true}
                height={100}
                onChangeText={(teacherNotes) => this.setState({
                  notes: teacherNotes
                })}
                returnKeyType={"done"}
                blurOnSubmit={true}
                placeholder={strings.WriteANote}
                placeholderColor={colors.black}
                editable={!readOnly}
                value={notes}
              />

              {/**
                  The Things to work on button.
              */}

              <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                <Text style={fontStyles.mainTextStyleDarkGrey}>{strings.ImprovementAreas}</Text>
              </View>
              <FlowLayout ref="flow"
                dataValue={improvementAreas}
                initialSelectedValues={this.props.navigation.state.params.newAssignment === false ? this.props.navigation.state.params.evaluationObject.improvementAreas : []}
                title="Improvement Areas"
                readOnly={readOnly}
                onSelectionChanged={(improvementAreas) => this.setState({ improvementAreas: improvementAreas })}
              />
            </View>
          </View>
        </ScrollView>
        <View style={styles.buttonsContainer}>
          {!readOnly ?
            <QcActionButton
              text={strings.Submit}
              onPress={() => {
                this.submitRating()
              }}
              disabled={this.state.isLoading}
              screen={this.name} /> : <View></View>}
        </View>
        <View style={styles.filler}></View>
      </QCView>
    )
  }
}

//--------------- Styles used on this screen -------------------
const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    backgroundColor: colors.lightGrey,
    flex: 1,
    justifyContent: "flex-end"
  },
  evaluationContainer: {
    flexDirection: 'column',
    paddingTop: 25,
    paddingBottom: 25,
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 10,
    marginHorizontal: 10,
    backgroundColor: colors.white,
    borderColor: colors.lightGrey,
    borderWidth: 1,
  },
  section: {
    alignItems: "center",
    alignSelf: 'stretch',
    padding: 10
  },
  profilePic: {
    width: 65,
    height: 65,
    borderRadius: 35,
    marginTop: -65,
    marginLeft: 10,
    borderColor: colors.white,
    borderWidth: 3
  },
  box: {
    borderWidth: 1,
    borderColor: colors.lightGrey,
    alignItems: "center",
    alignSelf: 'stretch',
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginHorizontal: 10,
    marginVertical: 5,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.00,
    elevation: 1,
  },
  buttonsContainer: {
    alignItems: 'center',
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    backgroundColor: colors.white,
  },
  notesStyle: {
    backgroundColor: colors.lightGrey,
    alignSelf: 'stretch',
    margin: 5,
    textAlignVertical: 'top'
  },
  filler: {
    flexDirection: 'column',
    flex: 1
  }
});
export default EvaluationPage;