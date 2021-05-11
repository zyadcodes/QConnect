import React from 'react';
import { StyleSheet } from 'react-native';
import colors from 'config/colors';
import { screenHeight, screenWidth } from 'config/dimensions';
const styles = StyleSheet.create({
  topView: {
    flexDirection: 'column',
    backgroundColor: colors.veryLightGrey
  },
  assignmentNameView: {
    alignItems: "center",
    justifyContent: "center"
  },
  noClassMsgView: { 
    height: 100 
  },
  improvementAreasContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    height: screenHeight * 0.03,
  },
  simpleLineIconStyle: { 
    paddingRight: 3 
  },
  averageRatingTextContainer: {
    flexDirection: "column",
    justifyContent: "center"
  },
  attendanceTextContainer: {
    paddingTop: 10,
    flexDirection: "row",
    justifyContent: "flex-start"
  },
  classesAttendedSecondaryView: {
    flexDirection: "row",
    justifyContent: "flex-start"
  },
  resendRecordingContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    height: 15,
  },
  statusContainer: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "space-between",
    paddingVertical: 3,
    backgroundColor: "rgba(255,255,250,0.6)",
    borderRadius: 3,
    marginHorizontal: 5,
  },
  microphoneIconContainerIfAssignmentSubmitted: {
    top: 5,
    left: screenWidth * 0.9,
    zIndex: 1,
    position: "absolute" // add if dont work with above
  },
  assignmentCardsFlatList: { 
    flexGrow: 0 
  },
  noAssignmentsTextContainer: {
    flex: 0.5,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: screenHeight * 0.04,
  },
  readQuranMotivationContainer: {
    alignItems: "center",
    justifyContent: "flex-start",
    alignSelf: "center"
  },
  statusAvatarSecondaryContainer: { 
    flex: 1 
  },
  checkIconContainer: {
    paddingLeft: screenWidth * 0.02,
    opacity: 1,
    flexDirection: "row"
  },
  openBookIconContainer: { 
    flexDirection: "row" 
  },
  updateCurrentAssignmentTouchableContainer: {
    flexDirection: "row",
    height: 50,
    justifyContent: "center",
    alignContent: "center",
    flex: 1,
  },
  statusAvatarPrimaryContainer: { 
    flexDirection: "row", 
    marginBottom: 5 
  },
  statusSecondaryContainer : {
    justifyContent: "center",
    alignItems: "center",
    minHeight: 25,
  },
  assignmentSectionHeaderSecondaryContainer: {
    alignItems: "center",
    flexDirection: "row"
  },
  updateCurrentAssignmentTouchable: { 
    justifyContent: "center", 
    alignItems: "center" 
  },
  assignmentSectionHeaderContainer: {
    marginLeft: screenWidth * 0.017,
    paddingTop: screenHeight * 0.005,
    paddingBottom: screenHeight * 0.01,
  },
  attendanceFillerView: { 
    width: 20 
  },
  classesMissedSecondaryContainer: {
    flexDirection: "row",
    justifyContent: "flex-start"
  },
  isReadyEnumContainer: {
    flexDirection: "row",
    paddingLeft: screenWidth * 0.02,
    justifyContent: "space-between"
  },
  changeStatusContainer: {
    flexDirection: "row",
    paddingRight: screenWidth * 0.02,
    justifyContent: "space-between"
  },
  sendRecitationRecordingTextContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  simpleLineIconContainerStyle: {
    paddingRight: 5
  },
  microphoneIconContainer: { 
    justifyContent: "flex-end", 
    flexDirection: "row" 
  },
  studentAverageRatingContainer: {
    flexDirection: "row",
    height: screenHeight * 0.04,
  },
  prevAssignmentCardFirstView: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  ratingView: {
    flex: 3,
    justifyContent: "center",
    alignItems: "flex-end"
  },
  prevAssignmentCardSecondView: {
    flex: 3,
    justifyContent: "center",
    alignItems: "flex-start"
  },
  assignmentTypeView: {
    alignItems: "center",
    justifyContent: "center",
    flex: 3,
  },
  welcomeGirlImg: {
    width: screenWidth * 0.73,
    height: screenHeight * 0.22,
    resizeMode: "contain"
  },
  codeInputView: { 
    height: 100 
  },
  profileInfoTop: {
    paddingHorizontal: screenWidth * 0.024,
    paddingTop: screenHeight * 0.015,
    flexDirection: 'row',
    height: screenHeight * 0.125,
    borderBottomColor: colors.lightGrey,
    borderBottomWidth: 1
  },
  profileInfoTopRight: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    paddingLeft: screenWidth * 0.075,
    paddingBottom: screenHeight * 0.007
  },
  innerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.grey
  },
  optionContainer: {
    backgroundColor: colors.grey,
    height: screenHeight * 0.08,
    justifyContent: 'center',
    paddingLeft: screenWidth * 0.25
  },
  box: {
    width: screenWidth * 0.049,
    height: screenHeight * 0.03,
    marginRight: screenWidth * 0.024
  },
  profileInfoBottom: {
    flexDirection: 'row',
    paddingHorizontal: screenWidth * 0.024,
    borderBottomColor: colors.grey,
    borderBottomWidth: 1
  },
  profilePic: {
    width: screenHeight * 0.1,
    height: screenHeight * 0.1,
    borderRadius: (screenHeight * 0.1) / 2
  },
  currentAssignment: {
    justifyContent: 'flex-end',
    minHeight: 150,
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
    alignItems: 'center',
    paddingVertical: screenHeight * 0.0112
  },
  bottomView: {
    flex: 3,
    backgroundColor: colors.veryLightGrey
  },
  prevAssignmentCard: {
    flexDirection: 'column',
    paddingHorizontal: screenWidth * 0.008,
    paddingBottom: screenHeight * 0.019,
    marginBottom: screenHeight * 0.009,
    borderColor: colors.grey,
    borderWidth: screenHeight * 0.13 * 0.0066,
    backgroundColor: colors.white,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2
  },
  profileInfo: {
    flexDirection: 'column',
    backgroundColor: colors.white
  },
  corner: {
    borderColor: '#D0D0D0',
    borderWidth: 1,
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: screenWidth * 0.012,
    marginRight: screenWidth * 0.015,
    marginTop: screenHeight * 0.007
  },
  prevAssignments: {
    flexDirection: 'column',
    backgroundColor: colors.veryLightGrey,
    flex: 1
  },
  classesAttended: {
    paddingLeft: 5,
    paddingRight: 5,
  },
  classesMissed: {
    paddingRight: 5,
  },
  modal: {
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    height: 300,
    width: screenWidth * 0.75,
    borderWidth: screenHeight * 0.003,
    borderRadius: screenHeight * 0.003,
    borderColor: colors.grey,
    shadowColor: colors.darkGrey,
    shadowOffset: { width: 0, height: screenHeight * 0.003 },
    shadowOpacity: 0.8,
    shadowRadius: screenHeight * 0.0045,
    elevation: screenHeight * 0.003
  },
  cardButtonStyle: {
    flex: 1,
    marginHorizontal: 5,
    backgroundColor: 'rgba(255,255,255,0.8)',
    height: 40,
    borderRadius: 2,
    justifyContent: "center",
    alignItems: "center"
  },
  studentReadingImage: {
    height: 0.16 * screenHeight,
    resizeMode: "contain"
  },
  wordsPerAssignmentContainer: { 
    justifyContent: "center", 
    alignItems: "center" 
  },
  wordsPerAssignmentFiller: { 
    height: screenHeight * 0.0075 
  },
  loadingSpinnerContainer: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center" 
  },
  noClassMsgContainer: {
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center"
  }
});
export default styles;
