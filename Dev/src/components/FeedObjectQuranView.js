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
} from '../../config/dimensions';
import { Text } from 'react-native';
import colors from '../../config/colors';
import SurahHeader from '../screens/MushafScreen/Components/SurahHeader';
import LoadingSpinner from './LoadingSpinner';
import StudentMainScreen from '../screens/StudentScreens/ClassTabs/StudentMainScreen';

class QuranAssignmentView extends StudentMainScreen {
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
            {this.props.content.assignmentType} from ayah{' '}
            {this.props.content.start.ayah} to ayah {this.props.content.end.ayah}
          </Text>
          <TouchableOpacity
            onPress={() => {
              // console.warn('Hello World Before')
              // this.updateCurrentAssignmentStatus('WORKING_ON_IT', this.props.assignmentIndex);
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
                assignmentName: this.props.hiddenContent.assignmentName,
                assignmentIndex: this.props.hiddenContent.assignmentIndex,
                imageID: this.props.studentClassInfo.profileImageID
              });
            }}
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
          {this.state.madeByCurrentUser ? null : (
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