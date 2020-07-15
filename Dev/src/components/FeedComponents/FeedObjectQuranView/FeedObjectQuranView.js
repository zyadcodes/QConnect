import React, { Component } from 'react';
import {
  View,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
} from 'react-native';
import {
  screenHeight,
  screenWidth,
  screenScale,
  fontScale,
} from '../../../../config/dimensions';
import { Text } from 'react-native';
import colors from '../../../../config/colors';
import SurahHeader from '../../../screens/MushafScreen/Components/SurahHeader';
import LoadingSpinner from '../../LoadingSpinner';
import StudentMainScreen from '../../../screens/StudentScreens/ClassTabs/StudentMainScreen';
import styles from './FeedObjectQuranViewStyle'

export default QuranAssignmentView  = (props) => {
  const determineIfAssignmentComplete = () => {
    for (
      var i = 0;
      i < props.studentClassInfo.currentAssignments.length;
      i++
    ) {
      let element = props.studentClassInfo.currentAssignments[i];
      if (
        element.name === props.content.name &&
        element.type === props.content.assignmentType
      ) {
        return i;
      }
    }
    return -1;
  }
  const getPastAssignment = () => {
    for (
      var i = 0;
      i < props.studentClassInfo.assignmentHistory.length;
      i++
    ) {
      let element = props.studentClassInfo.assignmentHistory[i];
      if (
        element.name === props.content.name &&
        element.assignmentType === props.content.assignmentType
      ) {
        return element;
      }
    }
  }
  const onPress = () => {
    if (determineIfAssignmentComplete()) {
      let item = getPastAssignment();
      props.onPushToOtherScreen("EvaluationPage", {
        classID: props.classID,
        studentID: props.currentUser.ID,
        studentClassInfo: props.studentClassInfo,
        classStudent: props.studentClassInfo,
        assignment: item,
        completionDate: item.completionDate,
        assignmentLocation: item.location,
        rating: item.evaluation.rating,
        notes: item.evaluation.notes,
        improvementAreas: item.evaluation.improvementAreas,
        submission: item.submission,
        userID: props.currentUser.ID,
        highlightedWords: item.evaluation.highlightedWords,
        highlightedAyahs: item.evaluation.highlightedAyahs,
        isStudentSide: true,
        evaluationID: item.ID,
        readOnly: true,
        newAssignment: false,
        assignmentName: item.name,
      });
      return;
    }
    updateCurrentAssignmentStatus(
      'WORKING_ON_IT',
      props.assignmentIndex
    );
    props.onPushToOtherScreen('MushafReadingScreen', {
      origin: 'FeedObject',
      popOnClose: true,
      isTeacher: false,
      assignToAllClass: false,
      userID: props.currentUser.ID,
      classID: props.classID,
      studentID: props.currentUser.ID,
      currentClass: props.studentClassInfo,
      assignmentLocation: {
        end: props.content.end,
        start: props.content.start,
      },
      assignmentType: props.content.type,
      assignmentName: props.content.assignmentName,
      assignmentIndex: props.content.assignmentIndex,
      imageID: props.studentClassInfo.profileImageID
    });
  }
    return (
      <View>
        <Text
          style={[
            styles.newAssignmentText,
            {
              marginLeft:
                props.madeByUserID == props.currentUser.ID
                  ? 0
                  : screenWidth / 86,
              marginRight:
                props.madeByUserID == props.currentUser.ID
                  ? screenWidth / 86
                  : 0,
            },
          ]}
        >
          {props.content.assignmentType} {props.content.name}
        </Text>
        <TouchableOpacity
          onPress={() => onPress()}
          disabled={props.role === 'teacher'}
          style={styles.assignmentContainer}
        >
          {props.isLoading ? (
            <View style={styles.spinnerContainerStyle}>
              <LoadingSpinner isVisible={true} />
            </View>
          ) : (
            <View>
              <SurahHeader surahName={props.surahName} />
              {props.page}
            </View>
          )}
        </TouchableOpacity>
        {props.role === 'teacher' ? null : (
          <Text
            style={[
              styles.newAssignmentText,
              { alignSelf: 'flex-end', marginRight: screenWidth / 86 },
            ]}
          >
            Click To Open
          </Text>
        )}
      </View>
    );
}
