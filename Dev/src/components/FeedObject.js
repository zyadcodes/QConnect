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
import strings from '../../config/strings';
import PropTypes from 'prop-types';
import colors from '../../config/colors';
import FirebaseFunctions from '../../config/FirebaseFunctions';
import {
  getPageTextWbW,
  getPageTextWbWLimitedLines,
} from '../screens/MushafScreen/ServiceActions/getQuranContent';
import SurahHeader from '../screens/MushafScreen/Components/SurahHeader';
import Basmalah from '../screens/MushafScreen/Components/Basmalah';
import TextLine from '../screens/MushafScreen/Components/TextLine';
import LoadingSpinner from './LoadingSpinner';
import { Icon } from 'react-native-elements';
import ThreadComponent from './ThreadComponent';
import StudentMainScreen from '../screens/StudentScreens/ClassTabs/StudentMainScreen';

export default class FeedsObject extends Component {
  state = {
    surahName: '',
    isMadeByCurrentUser: false,
    page: [],
    isLoading: false,
  };
  async componentDidMount() {
    console.log(screenHeight);
    console.warn(this.props.madeByUserID)
    console.warn(this.state.madeByCurrentUser)
    if (this.props.type === 'assignment') {
      this.setState({ isLoading: true });
      const pageLines = await getPageTextWbWLimitedLines(
        this.props.content.start.page,
        5
      );
      let allAyat = (
        <View>
          {pageLines !== undefined &&
            pageLines.map((line, index) => {
              if (
                line.type === 'besmellah' &&
                this.props.content.start.ayah === 1
              ) {
                return <Basmalah key={line.line + "_basmalah"} />;
              } else {
                return (
                  <TextLine
                    key={this.props.content.start.page + '_' + line.line}
                    lineText={line.text}
                    selectionOn={false}
                    highlightedWord={undefined}
                    selectedAyahsEnd={this.props.content.end}
                    selectedAyahsStart={this.props.content.start}
                    selectionStarted={false}
                    selectionCompleted={false}
                    isFirstWord={false}
                    onSelectAyah={(ayah, word) => {}}
                    page={this.props.content.start.page}
                    lineAlign={
                      this.props.content.start.page === 1 ? 'center' : 'stretch'
                    }
                  />
                );
              }
            })}
        </View>
      );
      this.setState({
        surahName: pageLines[0].surah,
        page: allAyat,
        isLoading: false,
        isMadeByCurrentUser: this.state.madeByCurrentUser
      });
    }
  }
  changeEmojiVote(reactionIndex) {
    let temp = this.props.reactions;
    if (temp[reactionIndex].reactedBy.includes(this.props.currentUser.ID)) {
      temp[reactionIndex].reactedBy.splice(
        temp[reactionIndex].reactedBy.indexOf(this.props.currentUser.ID),
        1
      );
    } else {
      temp[reactionIndex].reactedBy.push(this.props.currentUser.ID);
    }
    if (temp[reactionIndex].reactedBy.length === 0) {
      temp.splice(reactionIndex, 1);
    }
    return temp;
  }
  render() {
    return (
      (this.props.role === 'student' && this.props.type === 'assignment' && !this.props.viewableBy.includes(this.props.currentUser.ID) ?
        null
        :
        <View key={this.props.number} style={this.localStyles.containerView}>
          <View style={{alignItems: 'center', flexDirection: this.state.madeByCurrentUser ? 'row-reverse' : 'row'}}>  
            <Image
              source={this.props.imageRequire}
              style={this.localStyles.userImage}
            />
            <Text style={this.localStyles.userName}>{this.props.userName}</Text>
          </View>
          <View style={{ 
             flex: 2,
             marginLeft: (this.state.madeByCurrentUser ? 0 : screenScale*18 + screenWidth/45),
             marginRight: (this.state.madeByCurrentUser ? screenScale*18 + screenWidth/45 : 0) }}>
            <View style={{ flex: 5 }}>
              {this.props.type === 'assignment' ? (
                <Text
                  style={[
                    this.localStyles.newAssignmentText,
                    { fontSize: fontScale * 18 },
                  ]}
                >
                  New Assignment:{' '}
                </Text>
              ) : null}
              <View style={this.localStyles.contentContainerView}>
                {this.props.type === 'assignment' ? (
                  <QuranAssignmentView
                    setScreenToLoading={() => this.setState({ isLoading: true })}
                    surahName={this.state.surahName}
                    page={this.state.page}
                    onPushToOtherScreen={(pushParamScreen, pushParamObj) =>
                      this.props.onPushToOtherScreen(
                        pushParamScreen,
                        pushParamObj
                      )
                    }
                    isLoading={this.state.isLoading}
                    role={this.props.role}
                    classID={this.props.classID}
                    studentClassInfo={this.props.studentClassInfo}
                    hiddenContent={this.props.hiddenContent}
                    content={this.props.content}
                    madeByUserID={this.props.madeByUserID}
                    currentUser={this.props.currentUser}
                  />
                ) : (
                  <Text style={this.localStyles.contentText}>
                    {this.props.content}
                  </Text>
                )}
              </View>
              <View style={{ flexDirection: 'row', alignSelf: 'flex-end' }}>
                <FlatList
                  data={this.props.reactions}
                  style={{ flexDirection: 'row' }}
                  renderItem={({ item, index, seperators }) => (
                    <TouchableOpacity
                      onPress={() =>
                        this.props.onPressChangeEmojiVote(
                          this.changeEmojiVote(index)
                        )
                      }
                      key={index}
                      activeOpacity={0.6}
                      style={this.localStyles.Reaction}
                    >
                      <View style={this.localStyles.reactionView}>
                        <Text>{item.reactedBy.length}</Text>
                        <Text>{item.emoji}</Text>
                      </View>
                    </TouchableOpacity>
                  )}
                />
                {this.props.madeByUserID == this.props.currentUser.ID ? null : (
                  <TouchableOpacity
                    onPress={() => this.props.onPressSelectEmoji()}
                    style={this.localStyles.addReaction}
                    activeOpacity={0.6}
                  >
                    <Icon
                      name="plus"
                      type="entypo"
                      size={fontScale * 16}
                      color={colors.primaryDark}
                    />
                  </TouchableOpacity>
                )}
              </View>
            </View>
            {this.props.comments.length === 0 ? null : (
              <ThreadComponent
                isCurrentUser={
                  this.state.madeByCurrentUser
                }
                beginCommenting={() => this.props.beginCommenting()}
                listKey={this.props.number}
                isAssignment={this.props.type === 'assignment'}
                comments={this.props.comments}
              />
            )}
          </View>
        </View>
      )
    );
  }
  localStyles = StyleSheet.create({
    userName: {
      fontWeight: 'bold', 
      marginLeft: this.state.madeByCurrentUser 
          ? 0 
          : screenWidth/45,
      marginRight: this.state.madeByCurrentUser 
          ? screenWidth/45 
          : 0, 
      fontSize: fontScale*16, 
      color: colors.black
    },
    containerView: {
      width:
        this.props.type == 'assignment'
          ? (2.4 * screenWidth) / 3
          : (2 * screenWidth) / 3,
      alignSelf:
        this.state.madeByCurrentUser
          ? 'flex-end'
          : 'flex-start',
      flexDirection: 'column',
      alignItems: this.state.madeByCurrentUser
          ? 'flex-end'
          : 'flex-start',
      marginTop: this.props.number == 0 ? screenHeight / 40 : 0,
      marginBottom: screenHeight / 40
    },
    assignmentContainer: {
      alignSelf: 'center',
      flex: 3,
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
    contentText: {
      color: colors.lightBrown,
      fontWeight: 'bold',
      padding: screenScale * 2,
      fontSize: fontScale * 15
    },
    userImage: {
      width: screenScale * 18,
      height: screenScale * 18,
      marginLeft:
        this.props.madeByUserID == this.props.currentUser.ID
          ? 0
          : screenWidth / 45,
      marginRight:
        this.props.madeByUserID == this.props.currentUser.ID
          ? screenWidth / 45
          : 0,
      resizeMode: 'contain'
    },
    newAssignmentText: {
      fontSize: fontScale * 16,
      color: colors.lightBrown,
      fontWeight: 'bold'
    },
    newAssignmentTextContainer: {
      flexDirection: 'row'
    },
    addReaction: {
      alignItems: 'center',
      justifyContent: 'center',
      width: screenScale * 8,
      height: screenScale * 8,
      borderWidth: 1,
      backgroundColor: colors.primaryLight,
      borderColor: colors.primaryLight,
      borderRadius: (screenScale * 8) / 2,
      alignSelf: 'flex-end',
      position: 'relative',
      bottom: screenScale * 4,
      left: screenScale * 4
    },
    reactionView: {
      alignItems: 'center',
      justifyContent: 'space-around',
      flexDirection: 'row',
      flex: 1,
    },
    Reaction: {
      alignItems: 'center',
      width: screenScale * 16,
      height: screenScale * 8,
      borderWidth: 1,
      backgroundColor: colors.primaryLight,
      borderColor: colors.primaryLight,
      borderRadius: (screenScale * 8) / 2,
      alignSelf: 'flex-end',
      position: 'relative',
      bottom: screenScale * 4,
      left: screenScale * 4,
      paddingLeft: screenWidth / 200,
      paddingRight: screenWidth / 200,
      marginRight: screenWidth / 86
    },
    contentContainerView: {
      borderWidth: 2,
      marginTop: 0,
      flex: 5,
      paddingBottom:
        this.props.type === 'assignment' ? screenHeight / 163.5 : 0,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 4,
      borderColor: colors.lightBrown,
      backgroundColor: colors.white,
    }
  });
}


