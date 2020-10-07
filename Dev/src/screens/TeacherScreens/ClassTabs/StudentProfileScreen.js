import React from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableHighlight,
  TouchableOpacity
} from 'react-native';
import colors from 'config/colors';
import QcActionButton from 'components/QcActionButton';
import { Rating, ListItem } from 'react-native-elements';
import strings from 'config/strings';
import studentImages from 'config/studentImages';
import QcParentScreen from 'screens/QcParentScreen';
import FirebaseFunctions from 'config/FirebaseFunctions';
import LoadingSpinner from 'components/LoadingSpinner';
import fontStyles from 'config/fontStyles';
import { screenHeight, screenWidth } from 'config/dimensions';
import { LineChart } from 'react-native-chart-kit';
import { Icon } from 'react-native-elements';
import DailyTracker from "components/DailyTracker";
import Toast, { DURATION } from "react-native-easy-toast";
import themeStyles from 'config/themeStyles'


class StudentProfileScreen extends QcParentScreen {
  state = {
    studentID: this.props.navigation.state.params.studentID,
    currentClass: this.props.navigation.state.params.currentClass,
    classID: this.props.navigation.state.params.classID,
    currentAssignments: [],
    classStudent: '',
    isDialogVisible: false,
    isLoading: true,
    hasCurrentAssignment: '',
    classesAttended: '',
    classesMissed: '',
    dailyPracticeLog: {},
  };

  //Sets the screen for firebase analytics & fetches the correct student from this class
  async componentDidMount() {
    FirebaseFunctions.setCurrentScreen(
      'Student Profile Screen',
      'StudentProfileScreen'
    );
    await this.fetchStudentInfo();
  }

  setDialogueVisible(visible) {
    this.setState({ isDialogVisible: visible });
  }

  async fetchStudentInfo() {
    try {
      const { currentClass, studentID } = this.state;
      const student = await currentClass.students.find(eachStudent => {
        return eachStudent.ID === studentID;
      });

      //This constructs an array of the student's past assignments & only includes the "length" field which is how many
      //words that assignment was. The method returns that array which is then passed to the line graph below as the data
      let { assignmentHistory, dailyPracticeLog } = student;
      const data = [];
      for (const assignment of assignmentHistory) {
        if (assignment.assignmentLength && assignment.assignmentLength > 0) {
          data.push(assignment);
        }
      }

      //sort chart data from oldest to newest
      data.sort(function(a, b) {
        var dateA = new Date(a.completionDate),
          dateB = new Date(b.completionDate);
        return dateA - dateB;
      });

      //sort assignment history from newest to oldest
      assignmentHistory.sort(function(a, b) {
        var dateA = new Date(a.completionDate),
          dateB = new Date(b.completionDate);
        return dateB - dateA;
      });

      this.setState({
        classStudent: student,
        currentAssignments: student.currentAssignments,
        assignmentHistory,
        isLoading: false,
        wordsPerAssignmentData: data,
        dailyPracticeLog,
        hasCurrentAssignment:
          student.currentAssignments && student.currentAssignments.length > 0,
        classesAttended: student.classesAttended ? student.classesAttended : 0,
        classesMissed: student.classesMissed ? student.classesMissed : 0,
      });
    } catch (err) {
      console.log(
        'Failed to get student info: ' + JSON.stringify(err.toString())
      );
    }
  }

  showToast(assignedToAllClass) {
    let toastMsg = assignedToAllClass
      ? strings.ClassAssignmentSent
      : strings.AssignmentSent;
    this.refs.toast.show(toastMsg, DURATION.LENGTH_LONG);
  }

  getRatingCaption() {
    let caption = strings.GetStarted;

    const { averageRating } = this.state.classStudent;

    if (averageRating > 4) {
      caption = strings.OutStanding;
    } else if (averageRating >= 3) {
      caption = strings.GreatJob;
    } else if (averageRating > 0) {
      caption = strings.PracticePerfect;
    }

    return caption;
  }

  async updateStateWithNewAssignmentInfo(
    newAssignment,
    index,
    currentClass,
    showToast,
    assignedToAllClass
  ) {
    if (showToast === true) {
      this.showToast(assignedToAllClass);
    }
    await this.fetchStudentInfo();
  }

  //This function is going to return the labels for the graph which will be an array of 5 dates for when the assignments
  //were completed
  getDataLabels() {
    //If the amount of data is 5 or less, then the array returned will just be their completion dates, otherwise,
    //a label will be collected for each 5th of the data
    const { wordsPerAssignmentData } = this.state;
    if (wordsPerAssignmentData.length <= 5) {
      return wordsPerAssignmentData.map(data =>
        data.completionDate.substring(0, data.completionDate.lastIndexOf('/'))
      );
    } else {
      const increment = wordsPerAssignmentData.length % 5;
      const labels = [];
      for (let i = 0; i < wordsPerAssignmentData.length; i += increment) {
        let index = '';
        if (i >= wordsPerAssignmentData.length) {
          index = wordsPerAssignmentData.length - 1;
        } else {
          index = i;
        }
        labels.push(
          wordsPerAssignmentData[index].completionDate.substring(
            0,
            wordsPerAssignmentData[index].completionDate.lastIndexOf('/')
          )
        );
      }
      return labels;
    }
  }

  renderAssignmentsSectionHeader(label, iconName, desc) {
    return (
      <View
        style={{
          marginLeft: screenWidth * 0.017,
          paddingTop: screenHeight * 0.005,
          paddingBottom: screenHeight * 0.01,
        }}
      >
        <View
          style={{
            alignItems: 'center',
            flexDirection: "row"
          }}
        >
          <Icon
            name={iconName}
            type="material-community"
            color={colors.darkGrey}
          />
          <Text
            style={[
              { marginLeft: screenWidth * 0.017 },
              fontStyles.mainTextStyleDarkGrey,
            ]}
          >
            {label ? label.toUpperCase() : strings.Assignment}
          </Text>
        </View>
        {desc && <Text style={fontStyles.smallTextStyleDarkGrey}>{desc}</Text>}
      </View>
    );
  }

  //renders a past assignment info card
  renderHistoryItem(item, index, thisClassInfo) {
    return (
      <TouchableOpacity
        onPress={() => {
          //To-Do: Navigates to more specific evaluation for this assignment
          this.props.navigation.push("EvaluationPage", {
            classID: thisClassInfo.ID,
            studentID: this.state.studentID,
            classStudent: thisClassInfo,
            assignment: item,
            completionDate: item.completionDate,
            assignmentLocation: item.location,
            rating: item.evaluation.rating,
            notes: item.evaluation.notes,
            improvementAreas: item.evaluation.improvementAreas,
            userID: this.props.navigation.state.params.userID,
            highlightedWords: item.evaluation.highlightedWords,
            highlightedAyahs: item.evaluation.highlightedAyahs,
            evaluationObject: item.evaluation,
            submission: item.submission,
            isStudentSide: false,
            evaluationID: item.ID,
            readOnly: true,
            newAssignment: false,
            assignmentName: item.name
          });
        }}
      >
        <View style={styles.prevAssignmentCard} key={index}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <View
              style={{
                flex: 3,
                justifyContent: "center",
                alignItems: "flex-start"
              }}
            >
              <Text style={fontStyles.mainTextStylePrimaryDark}>
                {item.completionDate}
              </Text>
            </View>
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                flex: 3
              }}
            >
              <Text
                numberOfLines={1}
                style={[
                  fontStyles.mainTextStyleBlack,
                  {
                    color:
                      item.assignmentType === strings.Reading ||
                      item.assignmentType === strings.Read
                        ? colors.grey
                        : item.assignmentType === strings.Memorization ||
                          item.assignmentType === strings.Memorize ||
                          item.assignmentType == null
                        ? colors.darkGreen
                        : colors.darkishGrey
                  }
                ]}
              >
                {item.assignmentType ? item.assignmentType : strings.Memorize}
              </Text>
            </View>
            <View
              style={{
                flex: 3,
                justifyContent: "center",
                alignItems: "flex-end"
              }}
            >
              <Rating
                readonly={true}
                startingValue={item.evaluation.rating}
                imageSize={17}
              />
            </View>
          </View>
          <View
            style={{
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Text numberOfLines={1} style={fontStyles.bigTextStyleBlack}>
              {item.name}
            </Text>
          </View>
          {item.evaluation.notes ? (
            <Text numberOfLines={2} style={fontStyles.smallTextStyleDarkGrey}>
              {"Notes: " + item.evaluation.notes}
            </Text>
          ) : (
            <View />
          )}
          {item.evaluation.improvementAreas &&
          item.evaluation.improvementAreas.length > 0 ? (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: "center",
                height: screenHeight * 0.03,
              }}
            >
              <Text
                style={[
                  fontStyles.smallTextStyleDarkGrey,
                  { textVerticalAlign: 'center', paddingTop: 5 },
                ]}
              >
                {strings.ImprovementAreas}
              </Text>
              {item.evaluation.improvementAreas.map((tag, cnt) => {
                return (
                  <View
                    style={[
                      styles.corner,
                      {
                        flexDirection: 'row',
                        backgroundColor: colors.primaryVeryLight,
                      },
                    ]}
                  >
                    <Icon
                      name="tag"
                      size={10}
                      containerStyle={{ paddingRight: 5 }}
                      style={{ paddingRight: 3 }}
                      type="simple-line-icon"
                      color={colors.darkGrey}
                    />

                    <Text
                      key={tag}
                      style={[
                        fontStyles.smallTextStyleDarkGrey,
                        { textAlign: 'center' },
                      ]}
                    >
                      {tag}
                    </Text>
                  </View>
                );
              })}
            </View>
          ) : (
            <View />
          )}
          {item.submission ? (
            <View style={{ justifyContent: 'flex-end', flexDirection: 'row' }}>
              <Icon
                name="microphone"
                type="material-community"
                color={colors.darkRed}
              />
            </View>
          ) : (
            <View />
          )}
        </View>
      </TouchableOpacity>
    );
  }

  //---------- main UI render ===============================
  render() {
    const {
      classStudent,
      isLoading,
      classID,
      studentID,
      currentClass,
      currentAssignments,
      classesAttended,
      classesMissed,
      wordsPerAssignmentData,
      dailyPracticeLog,
      assignmentHistory,
    } = this.state;
    let { averageRating, name } = classStudent;

    //If the screen is loading, a spinner will display
    if (isLoading === true) {
      return (
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <LoadingSpinner isVisible={true} />
        </View>
      );
    }

    let assignmentTypes = [];
    assignmentTypes[strings.Memorization] = {
      color: colors.darkGreen,
      iconName: "brain",
      iconType: "material-community",
      name: strings.Memorize
    };

    assignmentTypes[strings.Reading] = {
      color: colors.magenta,
      iconName: "book-open",
      iconType: "feather",
      name: strings.Read,
    };

    assignmentTypes[strings.Revision] = {
      color: colors.blue,
      iconName: "redo",
      iconType: "evilicon",
      name: strings.Review,
    };

    let sumWordsWorkedOn = 0;

    return (
      <View style={{ flex: 1 }}>
        <Toast
          position={'bottom'}
          ref="toast"
          fadeInDuration={3000}
          positionValue={200}
          style={themeStyles.toastStyle}
        />
        <ScrollView containerStyle={styles.studentInfoContainer}>
          <View style={styles.profileInfo}>
            <View style={styles.profileInfoTop}>
              <View style={{ width: screenWidth * 0.24 }} />
              <View style={styles.profileInfoTopRight}>
                <Text numberOfLines={1} style={fontStyles.bigTextStyleBlack}>
                  {name.toUpperCase()}
                </Text>
                <View
                  style={{ flexDirection: 'row', height: 0.037 * screenHeight }}
                >
                  <Rating
                    readonly={true}
                    startingValue={averageRating}
                    imageSize={25}
                  />
                  <View
                    style={{
                      flexDirection: 'column',
                      justifyContent: 'center'
                    }}
                  >
                    <Text style={fontStyles.bigTextStyleDarkGrey}>
                      {averageRating === 0
                        ? ''
                        : parseFloat(averageRating).toFixed(1)}
                    </Text>
                  </View>
                </View>
                <Text style={fontStyles.mainTextStylePrimaryDark}>
                  {this.getRatingCaption()}
                </Text>
              </View>
            </View>
            <View style={styles.profileInfoBottom}>
              <View style={styles.profileInfoTopLeft}>
                <Image
                  style={styles.profilePic}
                  source={studentImages.images[classStudent.profileImageID]}
                />
              </View>
              <View
                style={{
                  paddingTop: 10,
                  flexDirection: "row",
                  justifyContent: "flex-start"
                }}
              >
                <Text
                  style={[
                    fontStyles.mainTextStyleDarkGrey,
                    { paddingLeft: 5, paddingRight: 10 },
                  ]}
                >
                  {strings.Attendance}:
                </Text>

                <View style={styles.classesAttended}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'flex-start'
                    }}
                  >
                    <Icon
                      name="account-check-outline"
                      type="material-community"
                      color={colors.darkGreen}
                      size={20}
                    />
                    <Text
                      style={[
                        fontStyles.mainTextStyleDarkGreen,
                        { paddingLeft: 5, paddingRight: 10 },
                      ]}
                    >
                      {strings.Attended}
                    </Text>
                    <Text style={[fontStyles.mainTextStyleDarkGreen]}>
                      {classesAttended}
                    </Text>
                  </View>
                </View>
                <View style={{ width: 20 }} />
                <View style={styles.classesMissed}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'flex-start'
                    }}
                  >
                    <Icon
                      name="account-remove-outline"
                      type="material-community"
                      color={colors.darkRed}
                      size={20}
                    />
                    <Text
                      style={[
                        fontStyles.mainTextStyleDarkRed,
                        { paddingLeft: 5, paddingRight: 10 },
                      ]}
                    >
                      {strings.Missed}
                    </Text>
                    <Text style={[fontStyles.mainTextStyleDarkRed]}>
                      {classesMissed}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
          {(currentAssignments === undefined ||
            currentAssignments.length === 0) &&
          (assignmentHistory === undefined ||
            assignmentHistory.length === 0) ? (
            <View
              style={{
                alignItems: "center",
                justifyContent: "flex-start",
                alignSelf: "center",
                flex: 2
              }}
            >
              <Text style={fontStyles.hugeTextStylePrimaryDark}>
                {strings.NoClass}
              </Text>

              <Image
                source={require("assets/emptyStateIdeas/welcome-girl.png")}
                style={{
                  width: 0.73 * screenWidth,
                  height: 0.22 * screenHeight,
                  resizeMode: "contain"
                }}
              />

              <QcActionButton
                text={strings.AddAssignment}
                onPress={() => {
                  this.props.navigation.push("MushafAssignmentScreen", {
                    newAssignment: true,
                    popOnClose: true,
                    isTeacher: true,
                    assignToAllClass: false,
                    userID: this.props.navigation.state.params.userID,
                    classID,
                    studentID,
                    currentClass,
                    imageID: classStudent.profileImageID,
                    onSaveAssignment: this.updateStateWithNewAssignmentInfo.bind(
                      this
                    ),
                  });
                }}
              />
            </View>
          ) : (
            <View />
          )}
          {this.renderAssignmentsSectionHeader(
            strings.DailyPracticeLog,
            "calendar-check-outline",
            strings.DailyPracticeLogDecTeacherView
          )}

          <DailyTracker data={dailyPracticeLog} readOnly={true} />
          {this.state.classStudent.currentAssignments &&
          this.state.classStudent.currentAssignments.length > 0 ? (
            this.renderAssignmentsSectionHeader(
              strings.CurrentAssignments,
              'book-open-outline'
            )
          ) : (
            <View />
          )}
          <FlatList
            style={{ flexGrow: 0 }}
            extraData={
              currentAssignments
                ? currentAssignments.map(value => value.name)
                : []
            }
            data={currentAssignments}
            keyExtractor={(item, index) =>
              item.name + index + Math.random() * 10
            }
            renderItem={({ item, index }) => (
              <View
                style={[
                  styles.currentAssignment,
                  {
                    backgroundColor:
                      item.isReadyEnum === 'WORKING_ON_IT'
                        ? colors.workingOnItColorBrown
                        : item.isReadyEnum === 'READY'
                        ? colors.green
                        : item.isReadyEnum === 'NOT_STARTED'
                        ? colors.primaryVeryLight
                        : colors.red
                  }
                ]}
              >
                {item.submission ? (
                  <View
                    style={{
                      paddingTop: 5,
                      justifyContent: "flex-end",
                      flexDirection: "row"
                    }}
                  >
                    <Icon
                      name="microphone"
                      type="material-community"
                      color={colors.darkRed}
                    />
                  </View>
                ) : (
                  <View />
                )}
                <View style={styles.middleView}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center"
                    }}
                  >
                    {item.type && (
                      <Icon
                        name={assignmentTypes[item.type].iconName}
                        type={assignmentTypes[item.type].iconType}
                        color={colors.darkGrey}
                        size={15}
                      />
                    )}
                    <Text
                      style={[
                        fontStyles.mainTextStyleBlack,
                        { paddingLeft: 5 }
                      ]}
                    >
                      {item.type ? item.type : strings.Memorize}
                    </Text>
                  </View>
                  <Text
                    style={[fontStyles.mainTextStyleBlack, { paddingTop: 5 }]}
                  >
                    {item.name.toUpperCase()}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    paddingLeft: screenWidth * 0.02,
                    justifyContent: 'center',
                    marginVertical: 5,
                  }}
                >
                  <Text style={fontStyles.mainTextStylePrimaryDark}>
                    {item.isReadyEnum === 'READY' && strings.Ready}
                    {item.isReadyEnum === 'WORKING_ON_IT' &&
                      strings.WorkingOnIt}
                    {item.isReadyEnum === 'NOT_STARTED' && strings.NotStarted}
                    {item.isReadyEnum === 'NEED_HELP' && strings.NeedHelp}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      height: 50,
                      justifyContent: 'center',
                      alignContent: 'center'
                    }}
                  >
                    <TouchableHighlight
                      style={styles.cardButtonStyle}
                      onPress={() => {
                        this.props.navigation.push("MushafAssignmentScreen", {
                          popOnClose: true,
                          isTeacher: true,
                          assignToAllClass: false,
                          userID: this.props.navigation.state.params.userID,
                          classID,
                          studentID,
                          newAssignment: false,
                          currentClass,
                          assignmentLocation: item.location,
                          assignmentType: item.type,
                          assignmentName: item.name,
                          assignmentIndex: index,
                          imageID: classStudent.profileImageID,
                          onSaveAssignment: this.updateStateWithNewAssignmentInfo.bind(
                            this
                          ),
                        });
                      }}
                    >
                      <Text style={fontStyles.mainTextStyleDarkGrey}>
                        {strings.EditAssignment}
                      </Text>
                    </TouchableHighlight>
                    <TouchableHighlight
                      style={styles.cardButtonStyle}
                      onPress={() => {
                        this.props.navigation.push('EvaluationPage', {
                          classID: classID,
                          studentID: studentID,
                          assignmentName: item.name,
                          userID: this.props.navigation.state.params.userID,
                          classStudent: classStudent,
                          assignmentLocation: item.location,
                          assignmentLength: item.location.length,
                          assignmentType: item.type,
                          submission: item.submission,
                          newAssignment: true,
                          readOnly: false,
                        });
                      }}
                    >
                      <View
                        style={{ paddingLeft: screenWidth * 0.02, opacity: 1 }}
                      >
                        <Text style={fontStyles.mainTextStyleDarkGrey}>
                          {strings.Grade}
                        </Text>
                      </View>
                    </TouchableHighlight>
                  </View>
                </View>
              </View>
            )}
          />
          <TouchableHighlight
            style={[styles.noOpacityCardButtonStyle, { flexDirection: "row" }]}
            onPress={() => {
              this.props.navigation.push("MushafAssignmentScreen", {
                popOnClose: true,
                newAssignment: true,
                isTeacher: true,
                assignToAllClass: false,
                userID: this.props.navigation.state.params.userID,
                classID,
                studentID,
                currentClass,
                imageID: classStudent.profileImageID,
                onSaveAssignment: this.updateStateWithNewAssignmentInfo.bind(
                  this
                ),
              });
            }}
          >
            <View
              style={{
                flexDirection: "row",
                flex: 1,
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <Icon
                name="addfile"
                type="antdesign"
                size={15}
                color={colors.primaryDark}
              />
              <Text
                style={[fontStyles.mainTextStylePrimaryDark, { marginLeft: 5 }]}
              >
                {strings.AddAssignment}
              </Text>
            </View>
          </TouchableHighlight>
          {wordsPerAssignmentData.length > 0 ? (
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <Text style={fontStyles.mainTextStyleBlack}>
                {strings.WordsPerAssignment}
              </Text>
              <View style={{ height: screenHeight * 0.0075 }} />
              <LineChart
                data={{
                  labels:
                    wordsPerAssignmentData.length > 1
                      ? [
                          wordsPerAssignmentData[0].completionDate.substring(
                            0,
                            wordsPerAssignmentData[0].completionDate.lastIndexOf(
                              '/'
                            )
                          ),
                          wordsPerAssignmentData[
                            wordsPerAssignmentData.length - 1
                          ].completionDate.substring(
                            0,
                            wordsPerAssignmentData[
                              wordsPerAssignmentData.length - 1
                            ].completionDate.lastIndexOf('/')
                          )
                        ]
                      : [
                          wordsPerAssignmentData[0].completionDate.substring(
                            0,
                            wordsPerAssignmentData[0].completionDate.lastIndexOf(
                              '/'
                            )
                          )
                        ],
                  datasets: [
                    {
                      data: wordsPerAssignmentData.map(data => {
                        sumWordsWorkedOn += data.assignmentLength;
                        return sumWordsWorkedOn;
                      })
                    }
                  ]
                }}
                fromZero={true}
                withInnerLines={false}
                chartConfig={{
                  backgroundColor: colors.primaryDark,
                  backgroundGradientFrom: colors.lightGrey,
                  backgroundGradientTo: colors.primaryDark,
                  decimalPlaces: 0,
                  color: (opacity = 1) => colors.primaryDark,
                  labelColor: (opacity = 1) => colors.black,
                  style: {
                    borderRadius: 16
                  }
                }}
                width={screenWidth}
                height={170}
              />
            </View>
          ) : (
            <View />
          )}
          <ScrollView>
            {assignmentHistory &&
              assignmentHistory.length > 0 &&
              this.renderAssignmentsSectionHeader(
                strings.PastAssignments,
                'history'
              )}
            <FlatList
              data={assignmentHistory}
              keyExtractor={(item, index) => item.name + index}
              renderItem={({ item, index }) => {
                return this.renderHistoryItem(item, index, currentClass);
              }}
            />
          </ScrollView>
        </ScrollView>
      </View>
    );
  }
}

//styles for the entire page
const styles = StyleSheet.create({
  studentInfoContainer: {
    marginVertical: 0.005 * screenHeight,
    backgroundColor: colors.white,
    flex: 1,
    borderColor: colors.lightGrey,
    borderWidth: 1,
    justifyContent: 'flex-end'
  },
  currentAssignment: {
    minHeight: 120,
    borderWidth: 0.5,
    borderColor: colors.grey,
    marginBottom: 5,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2
  },
  middleView: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  profileInfo: {
    flexDirection: 'column',
    backgroundColor: colors.white,
    marginBottom: 0.001 * screenHeight,
    paddingBottom: screenHeight * 0.01
  },
  corner: {
    borderColor: '#D0D0D0',
    borderWidth: 1,
    borderRadius: screenHeight * 0.004,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: screenWidth * 0.012,
    marginRight: screenHeight * 0.012,
    marginVertical: screenHeight * 0.004
  },
  profileInfoTop: {
    paddingHorizontal: screenWidth * 0.024,
    paddingTop: screenHeight * 0.015,
    flexDirection: 'row'
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
    paddingBottom: 0.007 * screenHeight
  },
  profileInfoBottom: {
    flexDirection: 'column',
    paddingHorizontal: 0.024 * screenWidth,
    paddingBottom: screenHeight * 0.02,
    borderBottomColor: colors.grey,
    borderBottomWidth: 1
  },
  profilePic: {
    width: 0.1 * screenHeight,
    height: 0.1 * screenHeight,
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
    paddingVertical: screenHeight * 0.005,
    shadowColor: colors.black
  },
  classesAttended: {
    paddingLeft: 5,
    paddingRight: 5
  },
  classesMissed: {
    paddingRight: 5
  },
  cardButtonStyle: {
    flex: 1,
    marginHorizontal: 5,
    backgroundColor: "rgba(255,255,255,0.6)",
    height: 40,
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center'
  },

  noOpacityCardButtonStyle: {
    flex: 1,
    marginHorizontal: 2,
    marginVertical: 8,
    backgroundColor: colors.primaryLight,
    borderColor: colors.lightGrey,
    borderWidth: 1,
    height: 40,
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default StudentProfileScreen;
