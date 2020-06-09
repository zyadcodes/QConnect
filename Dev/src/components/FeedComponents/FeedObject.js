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
import strings from '../../../config/strings';
import PropTypes from 'prop-types';
import colors from '../../../config/colors';
import FirebaseFunctions from '../../../config/FirebaseFunctions';
import { getPageTextWbWLimitedLines } from '../../screens/MushafScreen/ServiceActions/getQuranContent';
import SurahHeader from '../../screens/MushafScreen/Components/SurahHeader';
import Basmalah from '../../screens/MushafScreen/Components/Basmalah';
import TextLine from '../../screens/MushafScreen/Components/TextLine';
import { Icon } from 'react-native-elements';
import ThreadComponent from './ThreadComponent';
import QuranAssignmentView from './FeedObjectQuranView';
import { ScrollView } from 'react-native-gesture-handler';

export default class FeedsObject extends Component {
  state = {
    surahName: '',
    page: [],
    isReactionScrollViewOpen: false,
    isLoading: false,
    shownReactions: [],
    hiddenReactions: []
  };
  async componentDidMount() {
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
      });
    }
    let tempShownReactions = []
    for(var i = 0; i < 3 && i < this.props.reactions.length; i++){
      tempShownReactions[i] = this.props.reactions[i]
    }
    let tempHiddenReactions = []
    for(var i = 3; i < this.props.reactions.length; i++){
      tempHiddenReactions[i-3] = this.props.reactions[i]
    }
    if(this.props.content === 'Alhamdullillah it worked'){  
      console.warn(tempShownReactions)
    }
    this.setState({hiddenReactions: tempHiddenReactions, shownReactions: tempShownReactions})
  }
  changeEmojiVote(reactionIndex) {
    let temp = this.props.reactions.slice();
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
    return this.props.role === 'student' &&
      this.props.type === 'assignment' &&
      this.props.viewableBy !== 'everyone' &&
      !this.props.viewableBy.includes(this.props.currentUser.ID) ? null : (
      <View key={this.props.number} style={this.localStyles.containerView}>
        <View style={this.localStyles.imageAndNameContainer}>
          <Image
            source={this.props.imageRequire}
            style={this.localStyles.userImage}
          />
          <Text style={this.localStyles.userName}>{this.props.userName}</Text>
        </View>
        <View style={{ flexDirection: (this.props.isMadeByCurrentUser ? 'row-reverse' : 'row' )}}>
          <View
            onLayout={nativeEvent => {
              this.contentContainerViewWidth =
                nativeEvent.nativeEvent.layout.width;
              this.contentContainerViewHeight =
                nativeEvent.nativeEvent.layout.height;
            }}
            style={{
              flex: 2,
              marginLeft: this.props.isMadeByCurrentUser
                ? 0
                : screenScale * 18 + screenWidth / 45,
              marginRight: this.props.isMadeByCurrentUser
                ? screenScale * 18 + screenWidth / 45
                : 0,
            }}
          >
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
                    setScreenToLoading={() =>
                      this.setState({ isLoading: true })
                    }
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
                  <Text
                    style={[
                      this.localStyles.contentText,
                      this.props.type === 'achievement'
                        ? { color: '#009500', fontWeight: 'bold' }
                        : { color: colors.black },
                    ]}
                  >
                    {this.props.content}
                  </Text>
                )}
              </View>
            </View>
            <View
              style={{
                flexDirection: this.props.isMadeByCurrentUser
                  ? 'row-reverse'
                  : 'row',
                justifyContent: 'space-between',
                alignSelf: 'stretch',
                flex: 1,
              }}
            >
              {this.props.isMadeByCurrentUser ||
              !this.props.showCommentButton ? (
                <View />
              ) : (
                <TouchableOpacity
                  key="comment"
                  onPress={() => this.props.beginCommenting(this.props.number)}
                  style={[this.localStyles.addReaction, { left: 0 }]}
                >
                  <Icon
                    type="font-awesome"
                    name="commenting"
                    size={fontScale * 16}
                    color={(this.props.type === 'achievement' ? '#009500' : colors.primaryDark)}
                  />
                </TouchableOpacity>
              )}
              <View style={{ flexDirection: (this.props.isMadeByCurrentUser ? 'row-reverse' : 'row') }}>
              {this.props.reactions.length > 1 
                  ? 
                  <View>
                    <TouchableOpacity
                      onPress={() =>
                        this.setState({isReactionScrollViewOpen: !this.state.isReactionScrollViewOpen})
                      }
                      activeOpacity={0.6}
                      style={[this.localStyles.addReaction, {width: screenScale*12, marginRight: 3}]}
                    >
                      <View style={this.localStyles.reactionView}>
                        <Text>+{this.props.reactions.slice(1, this.props.reactions.length).length}</Text>
                      </View>
                    </TouchableOpacity>
                    {
                      this.state.isReactionScrollViewOpen 
                      ? <ScrollView style={this.localStyles.hiddenReactionsScrollView}>
                          <FlatList listKey="extra reactions" data={this.props.reactions.slice(1, this.props.reactions.length)} renderItem={({index, item, separators}) => 
                             <TouchableOpacity
                             onPress={() =>
                               this.props.onPressChangeEmojiVote(
                                 this.changeEmojiVote(index)
                               )
                             }
                             key={index}
                             activeOpacity={0.6}
                             style={[
                               this.localStyles.Reaction,
                               item.reactedBy.includes(this.props.currentUser.ID)
                          ? {
                              backgroundColor: colors.lightBlue,
                              borderColor: colors.lightBlue,
                            }
                          : this.props.type === 'achievement' 
                            ?
                              {
                                backgroundColor: '#00ff00',
                                borderColor: '#00ff00',
                              }
                            :
                              {
                                backgroundColor: colors.primaryLight,
                                borderColor: colors.primaryLight,
                              },
                               { bottom: 0, left: 0, marginTop: 3, marginRight: 0 }
                             ]}
                           >
                             <View style={this.localStyles.reactionView}>
                               <Text>{item.reactedBy.length}</Text>
                               <Text>{item.emoji}</Text>
                             </View>
                           </TouchableOpacity>
                          }/>
                        </ScrollView>
                      : null
                    }
                  </View>
                  : null
                }
                <FlatList
                  data={this.props.reactions.slice(0, 1)}
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
                      style={[
                        this.localStyles.Reaction,
                        item.reactedBy.includes(this.props.currentUser.ID)
                          ? {
                              backgroundColor: colors.lightBlue,
                              borderColor: colors.lightBlue,
                            }
                          : this.props.type === 'achievement' 
                            ?
                              {
                                backgroundColor: '#00ff00',
                                borderColor: '#00ff00',
                              }
                            :
                              {
                                backgroundColor: colors.primaryLight,
                                borderColor: colors.primaryLight,
                              },
                      ]}
                    >
                      <View style={this.localStyles.reactionView}>
                        <Text>{item.reactedBy.length}</Text>
                        <Text>{item.emoji}</Text>
                      </View>
                    </TouchableOpacity>
                  )}
                />
                {this.props.isMadeByCurrentUser ? null : (
                  <TouchableOpacity
                    key="reaction"
                    onPress={() => this.props.onPressSelectEmoji()}
                    style={[this.localStyles.addReaction]}
                    activeOpacity={0.6}
                  >
                    <Icon
                      name="plus"
                      type="entypo"
                      size={fontScale * 16}
                      color={(this.props.type === 'achievement' ? '#009500' : colors.primaryDark)}
                    />
                  </TouchableOpacity>
                )}
              </View>
            </View>
            <ThreadComponent
              isCurrentUser={this.props.isMadeByCurrentUser}
              listKey={this.props.number}
              isAssignment={this.props.type === 'assignment'}
              comments={this.props.comments}
              isExtended={this.props.isThreadExtended}
            />
          </View>
          {this.props.type === 'achievement' ? (
            <Image
              style={this.localStyles.medallionStyle}
              source={require('../../../assets/medallion.png')}
            />
          ) : null}
        </View>
      </View>
    );
  }
  localStyles = StyleSheet.create({
    medallionStyle: {
      resizeMode: 'contain',
      width: 40,
      height: 40,
      position: 'relative',
      right: 20,
      bottom: 20
    },
    userName: {
      fontWeight: 'bold',
      marginLeft: this.props.isMadeByCurrentUser ? 0 : screenWidth / 45,
      marginRight: this.props.isMadeByCurrentUser ? screenWidth / 45 : 0,
      fontSize: fontScale * 16,
      color: colors.black
    },
    hiddenReactionsScrollView: {
      height: screenHeight/8,
      marginTop: 5,
      position: 'relative',
      left: '25%',
      padding: 3,
      alignSelf: 'center',
      borderWidth: 4,
      borderRadius: 5,
      borderColor: (this.props.type === 'achievement' 
        ? '#009500'
        : colors.primaryDark),
      backgroundColor: (this.props.type === 'achievement' 
        ? '#009500'
        : colors.primaryDark) 
    },  
    imageAndNameContainer: {
      flexDirection: this.props.isMadeByCurrentUser ? 'row-reverse' : 'row',
      marginLeft: screenWidth / 45,
      alignItems: 'center'
    },
    containerView: {
      flex: 1,
      width:
        this.props.type == 'assignment'
          ? (2.4 * screenWidth) / 3
          : (2 * screenWidth) / 3,
      alignSelf: this.props.isMadeByCurrentUser ? 'flex-end' : 'flex-start',
      flexDirection: 'column',
      alignItems: this.props.isMadeByCurrentUser ? 'flex-end' : 'flex-start',
      marginTop: 0,
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
      backgroundColor: ( this.props.type === 'achievement' ? '#00ff00' : colors.primaryLight),
      borderColor: ( this.props.type === 'achievement' ? '#00ff00' : colors.primaryLight),
      borderRadius: (screenScale * 8) / 2,
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
      backgroundColor: (this.props.type === 'achievement' ? '#00ff00' : colors.primaryLight),
      borderColor: (this.props.type === 'achievement' ? '#00ff00' : colors.primaryLight),
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
      borderWidth: this.props.type === 'achievement' ? 4 : 2,
      marginTop: 0,
      flex: 5,
      paddingBottom:
        this.props.type === 'assignment' ? screenHeight / 163.5 : 0,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 4,
      borderColor:
        this.props.type === 'achievement' ? '#009500' : colors.lightBrown,
      backgroundColor: colors.white,
    }
  });
}
