import React from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Text,
  TextInput,
  Keyboard,
  RefreshControl,
  KeyboardAvoidingView,
} from 'react-native';
import FirebaseFunctions from '../../../config/FirebaseFunctions';
import colors from '../../../config/colors';
import SideMenu from 'react-native-side-menu';
import StudentLeftNavPane from '../StudentScreens/LeftNavPane';
import TeacherLeftNavPane from '../TeacherScreens/LeftNavPane';
import LoadingSpinner from '../../components/LoadingSpinner';
import TopBanner from 'components/TopBanner';
import FeedsObject from '../../components/FeedComponents/FeedObject';
import { screenHeight, screenWidth } from '../../../config/dimensions';
import EmojiSelector from '../../components/CustomizedEmojiSelector';
import { FlatList } from 'react-native-gesture-handler';
import teacherImages from '../../../config/teacherImages';
import studentImages from '../../../config/studentImages';
import FeedList from '../../components/FeedComponents/FeedList';
import FastResponseTouchableOpacity from '../../components/FastResponseTouchableOpacity';
import Modal from 'react-native-modal';
import CommentModal from '../../components/FeedComponents/CommentModal';
import ChatInput from '../../components/FeedComponents/ChatInput';

export default class FeedsScreen extends React.Component {
  //*IMPORTANT* Make sure to clean up my Firebase calls here
  //when we implement a cleaner database and cleaner front-end
  //code.
  state = {
    currentClass: {},
    isOpen: false,
    classes: [],
    isLoading: true,
    userID: '',
    LeftNavPane: {},
    role: '',
    currentClassID: '',
    teacher: null,
    student: null,
    studentClassInfo: null,
    currentlySelectingIndex: {
      listIndex: -1,
      objectIndex: -1
    },
    currentlyCommentingOn: {
      listIndex: -1,
      objectIndex: -1
    },
    scrollLength: 0,
    currentScrollLoc: 0,
    feedsData: [],
    oldestFeedDoc: '-1',
    isRefreshingOldFeeds: false,
    isSelectingEmoji: false,
    isCommenting: false,
    isChatting: false,
    newCommentTxt: '',
    isScrolling: false,
    inputHeight: screenHeight / 12
  };

  _isMounted = false;

  static whenKeyboardShows;
  static whenKeyboardHides;

  static doThisWhenKeyboardShows(func) {
    FeedsScreen.whenKeyboardShows = func;
  }
  static doThisWhenKeyboardHides(func) {
    FeedsScreen.whenKeyboardHides = func;
  }
  async componentDidMount() {
    FirebaseFunctions.setCurrentScreen('Class Feed Screen', 'ClassFeedScreen');
    const { userID } = this.props.navigation.state.params;
    const teacher = await FirebaseFunctions.getTeacherByID(userID);
    let currentClassID;
    let LeftNavPane;
    let classes;
    let userType = teacher;
    if (teacher === -1) {
      const student = await FirebaseFunctions.getStudentByID(userID);
      userType = student;
      LeftNavPane = StudentLeftNavPane;
      this.setState({ student, role: 'student' });
    } else {
      LeftNavPane = TeacherLeftNavPane;
      this.setState({ teacher, role: 'teacher' });
    }
    currentClassID = userType.currentClassID;
    classes = await FirebaseFunctions.getClassesByIDs(userType.classes);
    const currentClass = await FirebaseFunctions.getClassByID(currentClassID);
    if (teacher === -1) {
      const studentClassInfo = currentClass.students.find(student => {
        return student.ID === userID;
      });
      this.setState({ studentClassInfo });
    }
    const { classInviteCode } = currentClass;
    await FirebaseFunctions.getLatestFeed(
      currentClassID,
      this.refresh.bind(this)
    );
    this.setState(
      {
        currentClass,
        currentClassID,
        classInviteCode,
        LeftNavPane,
        userID,
        classes,
      },
      () => {
        this._isMounted = true;
        setTimeout(() => {
          this.flatListRef.scrollToEnd();
        }, 1000);
      }
    );
  }
  refresh(docID, newData, isNewDoc) {
    if (this._isMounted) {
      let tempData = this.state.feedsData.slice();
      if (isNewDoc) {
        tempData.push({ docID, data: newData });
        this.setState({ feedsData: tempData, isLoading: false });
        if (parseInt(this.state.oldestFeedDoc) === -1) {
          this.setState({ oldestFeedDoc: docID });
        }
        return;
      }
      if (parseInt(this.state.oldestFeedDoc) > parseInt(docID)) {
        tempData.unshift({ docID, data: newData });
        this.setState({ feedsData: tempData, oldestFeedDoc: docID });
        return;
      }
      for (var i = 0; i < tempData.length; i++) {
        if (tempData[i].docID === docID) {
          tempData[i].data = newData;
          this.setState({ feedsData: tempData });
          return;
        }
      }
    }
  }
  async addComment(text){
    const { feedsData, currentlyCommentingOn, role, student, teacher, currentClassID } = this.state;
    let tempData = feedsData[currentlyCommentingOn.listIndex].data.splice();
    let docID = feedsData[currentlyCommentingOn.listIndex].docID;
    let currComments = tempData[currentlyCommentingOn.objectIndex].comments.splice();
    currComments.push({
      user: {
        imageID: role === 'teacher' 
          ? teacher.profileImageID 
          : student.profileImageID, 
        isTeacher: role === 'teacher', 
        name: role === 'teacher' 
          ? teacher.name 
          : student.name,
      },
      content: text})
    tempData[currentlyCommentingOn.objectIndex].comments = currComments;
    await FirebaseFunctions.updateFeedDoc(tempData, docID, currentClassID, false)
  }
  async sendMessage(text) {
    const newObj = {
      madeByUser: {
        ID: this.state.userID,
        name:
          this.state.role === 'teacher'
            ? this.state.teacher.name
            : this.state.student.name,
        imageID:
          this.state.role === 'teacher'
            ? this.state.teacher.profileImageID
            : this.state.student.profileImageID,
        role: this.state.role
      },
      type: 'text',
      content: text,
      comments: [],
      reactions: []
    };
    let tempData = this.state.feedsData[
      this.state.feedsData.length - 1
    ].data.slice();
    let docID = this.state.feedsData[this.state.feedsData.length - 1].docID;
    //console.warn(this.state.feedsData)
    tempData.push(newObj);
    await FirebaseFunctions.updateFeedDoc(
      tempData,
      docID,
      this.state.currentClassID,
      true
    );
    this.setState({ newCommentTxt: '' });
  }
  async changeEmojiVote(listIndex, objectIndex, changedReactions) {
    //console.warn(listIndex)
    let tempData = this.state.feedsData[listIndex].data.slice();
    let docID = this.state.feedsData[listIndex].docID;
    tempData[objectIndex].reactions = changedReactions;
    await FirebaseFunctions.updateFeedDoc(
      tempData,
      docID,
      this.state.currentClassID,
      false //this doesn't matter, we're not adding another Feed Object anyways
    );
  }
  toggleSelectingEmoji(listIndex, objectIndex) {
    if (!this.state.isSelectingEmoji) {
      this.setState({ currentlySelectingIndex: { listIndex, objectIndex } });
    }
    this.setState({ isSelectingEmoji: !this.state.isSelectingEmoji });
  }
  async refreshOldFeed() {
    this.setState({ isRefreshingOldFeeds: true });
    //console.warn(this.state.oldestFeedDoc);
    if (this.state.oldestFeedDoc === "0") {
      this.setState({ isRefreshingOldFeeds: false });
      return;
    }
    await FirebaseFunctions.addOldFeedDoc(
      this.state.currentClassID,
      this.state.oldestFeedDoc,
      this.refresh.bind(this)
    );
  }
  render() {
    const { LeftNavPane } = this.state;
    if (this.state.isLoading) {
      return (
        <View style={localStyles.spinnerContainerStyle}>
          <LoadingSpinner isVisible={true} />
        </View>
      );
    }
    return (
      <SideMenu
        isOpen={this.state.isOpen}
        menu={
          <LeftNavPane
            teacher={this.state.teacher}
            student={this.state.student}
            userID={this.state.userID}
            classes={this.state.classes}
            edgeHitWidth={0}
            navigation={this.props.navigation}
          />
        }
      >
        <View per style={[localStyles.containerView, { paddingTop: 0 }]}>
          <TopBanner
            LeftIconName="navicon"
            LeftOnPress={() => this.setState({ isOpen: true })}
            Title={this.state.currentClass.name + ' Feed'}
          />
          <FlatList
            refreshControl={
              <RefreshControl
                refreshing={this.state.isRefreshingOldFeeds}
                onRefresh={() => this.refreshOldFeed()}
              />
            }
            scrollEnabled
            onScroll={nativeEvent => {
              this.setState({currentScrollLoc: nativeEvent.nativeEvent.contentOffset.y})
            }}
            onScrollBeginDrag={() => this.setState({ isScrolling: true })}
            onScrollEndDrag={() => this.setState({ isScrolling: false })}
            keyboardShouldPersistTaps="always"
            style={localStyles.scrollViewStyle}
            ref={ref => (this.flatListRef = ref)}
            listKey={0}
            onLayout={nativeEvent => this.setState({scrollLength: nativeEvent.nativeEvent.layout.height})}
            onContentSizeChange={() => {
              console.warn(this.state.scrollLength)
              if(this.state.isScrolling || this.state.isRefreshingOldFeeds || this.state.scrollLength-this.state.currentScrollLoc > screenHeight/2){
                if(this.state.isRefreshingOldFeeds){
                  this.flatListRef.scrollToOffset({
                      animated: true,
                      offset: 0,
                    })
                }
              }else{
                this.flatListRef.scrollToEnd({ animated: true });
              }
              this.setState({ isRefreshingOldFeeds: false });
            }}
            data={this.state.feedsData}
            renderItem={({ index, item, separators }) => (
              <FeedList
                role={this.state.role}
                teacher={this.state.teacher}
                student={this.state.student}
                key={item.docID}
                currentUser={
                  this.state.role === 'teacher'
                    ? this.state.teacher
                    : this.state.student
                }
                item={item}
                onPushToOtherScreen={(pushParamScreen, pushParamObj) => {
                  this.setState({ isLoading: true });
                  this.props.navigation.push(pushParamScreen, pushParamObj);
                  this.setState({ isLoading: false });
                }}
                classID={this.state.currentClassID}
                studentClassInfo={this.state.studentClassInfo}
                index={index}
                onPressChangeEmojiVote={this.changeEmojiVote.bind(this)}
                onPressSelectEmoji={objectIndex =>
                  this.setState({
                    isSelectingEmoji: true,
                    currentlySelectingIndex: { listIndex: index, objectIndex },
                  })
                }
                beginCommenting={(listIndex, objectIndex) => {
                  this.setState({currentlyCommentingOn: {listIndex, objectIndex}, isCommenting: true})
                }}
              />
            )}
          />
        </View>
        {this.state.isSelectingEmoji ? (
          <EmojiSelector
            theme={colors.primaryLight}
            onEmojiSelected={async emoji => {
              let currentIndex = this.state.currentlySelectingIndex;
              let docID = this.state.feedsData[currentIndex.listIndex].docID;
              let tempData = this.state.feedsData[
                currentIndex.listIndex
              ].data.slice();
              tempData[currentIndex.objectIndex].reactions[
                tempData[currentIndex.objectIndex].reactions.length
              ] = {
                emoji,
                reactedBy: [this.state.userID]
              };
              await FirebaseFunctions.updateFeedDoc(
                tempData,
                docID,
                this.state.currentClassID,
                false //Same here, this also doesn't matter
              );
              this.setState({
                currentlySelectingIndex: { listIndex: -1, objectIndex: -1 },
              });
              this.toggleSelectingEmoji(
                currentIndex.listIndex,
                currentIndex.objectIndex
              );
            }}
            onBackdropPress={this.toggleSelectingEmoji.bind(this)}
          />
        ) : null}
        {this.state.isCommenting ?
          <CommentModal 
              onBackdropPress={() => this.setState({isCommenting: false})}
              item={this.state.feedsData[this.state.currentlyCommentingOn.listIndex]
              .data[this.state.currentlyCommentingOn.objectIndex]}
              role={this.state.role}
              teacher={this.state.teacher}
              student={this.state.student}
              objectIndex={this.state.currentlyCommentingOn.objectIndex}
              listIndex={this.state.currentlyCommentingOn.listIndex}
              currentUser={
                this.state.role === 'teacher'
                  ? this.state.teacher
                  : this.state.student
              }
              onPushToOtherScreen={(pushParamScreen, pushParamObj) => {
                this.setState({ isLoading: true });
                this.props.navigation.push(pushParamScreen, pushParamObj);
                this.setState({ isLoading: false });
              }}
              classID={this.state.currentClassID}
              studentClassInfo={this.state.studentClassInfo}
              onPressChangeEmojiVote={this.changeEmojiVote.bind(this)}
              onPressSelectEmoji={objectIndex =>
                this.setState({
                  isSelectingEmoji: true,
                  currentlySelectingIndex: { listIndex: index, objectIndex },
                })
              }
              showCommentButton={false}
            >
              <ChatInput
                width={0.9*screenWidth}
                newCommentTxt={this.state.newCommentTxt}
                onChangeText={text => this.setState({ newCommentTxt: text })}
                onTextInputBlur={() => FeedsScreen.whenKeyboardHides()}
                textInputOnTouchEnd={() => {}}
                textInputOnContentSizeChange={event =>
                  this.setState({
                    inputHeight: event.nativeEvent.contentSize.height + 5,
                  })
                }
                ref={ref => this.chatInputRef = ref}
                sendOnPress={async () => {
                    console.warn('IM HERE')
                    await this.addComment(this.state.newCommentTxt)
                    this.setState({newCommentTxt: ''})
                }}
              />
          </CommentModal>
          : null
        }
        <ChatInput
          width={screenWidth}
          newCommentTxt={this.state.newCommentTxt}
          onChangeText={text => this.setState({ newCommentTxt: text })}
          onTextInputBlur={() => FeedsScreen.whenKeyboardHides()}
          textInputOnTouchEnd={() => {
          FeedsScreen.whenKeyboardShows();
            this.setState({ isChatting: true });
          }}
             textInputOnContentSizeChange={event =>
                  this.setState({
                    inputHeight: event.nativeEvent.contentSize.height + 5,
                  })
                }
                ref={ref => this.chatInputRef = ref}
                sendOnPress={async () => {
                    await this.sendMessage(this.state.newCommentTxt).then(() => {
                      this.setState({ isChatting: false });
                    })
                }}
              />
      </SideMenu>
    );
  }
}
const localStyles = StyleSheet.create({
  containerView: {
    flex: 1
  },
  scrollViewStyle: {
    backgroundColor: colors.primaryVeryLight,
  },
  spinnerContainerStyle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
