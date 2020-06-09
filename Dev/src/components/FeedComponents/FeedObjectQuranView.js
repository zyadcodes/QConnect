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
} from '../../../config/dimensions';
import { Text } from 'react-native';
import colors from '../../../config/colors';
import SurahHeader from '../../screens/MushafScreen/Components/SurahHeader';
import LoadingSpinner from '../LoadingSpinner';
import StudentMainScreen from '../../screens/StudentScreens/ClassTabs/StudentMainScreen';

export default class QuranAssignmentView extends StudentMainScreen {
  determineIfAssignmentComplete(){
    for(var i = 0; i < this.props.studentClassInfo.currentAssignments.length; i++){
      let element = this.props.studentClassInfo.currentAssignments[i];
      if(element.name === this.props.content.name &&
         element.type === this.props.content.assignmentType){
        return i;
      }
    }
    return -1;
  }
  getPastAssignment(){
    for(var i = 0; i < this.props.studentClassInfo.assignmentHistory.length; i++){
      let element = this.props.studentClassInfo.assignmentHistory[i];
      if(element.name === this.props.content.name && 
         element.assignmentType === this.props.content.assignmentType){
        return element;
      }
    }
  }
  onPress(){
    if(this.determineIfAssignmentComplete()){
      let item = this.getPastAssignment();
      this.props.onPushToOtherScreen("EvaluationPage", {
        classID: this.props.classID,
        studentID: this.props.currentUser.ID,
        studentClassInfo: this.props.studentClassInfo,
        classStudent: this.props.studentClassInfo,
        assignment: item,
        completionDate: item.completionDate,
        assignmentLocation: item.location,
        rating: item.evaluation.rating,
        notes: item.evaluation.notes,
        improvementAreas: item.evaluation.improvementAreas,
        submission: item.submission,
        userID: this.props.currentUser.ID,
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
    this.updateCurrentAssignmentStatus('WORKING_ON_IT', this.props.assignmentIndex);
      this.props.onPushToOtherScreen('MushafReadingScreen', {
      origin: 'FeedObject',
      popOnClose: true,
      isTeacher: false,
      assignToAllClass: false,
      userID: this.props.currentUser.ID,
      classID: this.props.classID,
      studentID: this.props.currentUser.ID,
      currentClass: this.props.studentClassInfo,
      assignmentLocation: {
      end: this.props.content.end,
      start: this.props.content.start,
      },
      assignmentType: this.props.content.type,
      assignmentName: this.props.content.assignmentName,
      assignmentIndex: this.props.content.assignmentIndex,
      imageID: this.props.studentClassInfo.profileImageID
    });
  }
  render() {
    return (
      <View>
        <Text
          style={[
            this.localStyles.newAssignmentText,
            {
              marginLeft:
                this.props.madeByUserID == this.props.currentUser.ID
                  ? 0
                  : screenWidth / 86,
              marginRight:
                this.props.madeByUserID == this.props.currentUser.ID
                  ? screenWidth / 86
                  : 0,
            },
          ]}
        >
          {this.props.content.assignmentType} {this.props.content.name}
        </Text>
        <TouchableOpacity
          onPress={() => this.onPress()}
          disabled={this.props.role === 'teacher'}
          style={this.localStyles.assignmentContainer}
        >
          {this.props.isLoading ? (
            <View style={this.localStyles.spinnerContainerStyle}>
              <LoadingSpinner isVisible={true} />
            </View>
          ) : (
            <View>
              <SurahHeader surahName={this.props.surahName} />
              {this.props.page}
            </View>
          )}
        </TouchableOpacity>
        {this.props.role === 'teacher' ? null : (
          <Text
            style={[
              this.localStyles.newAssignmentText,
              { alignSelf: 'flex-end', marginRight: screenWidth / 86 },
            ]}
          >
            Click To Open
          </Text>
        )}
      </View>
    );
  }
  localStyles = StyleSheet.create({
    assignmentContainer: {
      alignSelf: 'center',
      height: screenHeight / 6,
      overflow: 'hidden',
      borderColor: colors.lightBrown,
      borderWidth: 2,
      marginTop: screenHeight / 163.2,
      width: screenWidth / 1.6
    },
    spinnerContainerStyle: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center'
    },
    newAssignmentText: {
      fontSize: fontScale * 16,
      color: colors.lightBrown,
      flexWrap: 'nowrap',
      fontWeight: 'bold'
    },
  });
}
