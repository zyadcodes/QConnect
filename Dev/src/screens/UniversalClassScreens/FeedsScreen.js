import React from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Text,
  TextInput,
  Keyboard,
  KeyboardAvoidingView,
} from 'react-native';
import FirebaseFunctions from '../../../config/FirebaseFunctions';
import colors from '../../../config/colors';
import SideMenu from 'react-native-side-menu';
import StudentLeftNavPane from '../StudentScreens/LeftNavPane';
import TeacherLeftNavPane from '../TeacherScreens/LeftNavPane';
import LoadingSpinner from '../../components/LoadingSpinner';
import TopBanner from 'components/TopBanner';
import FeedsObject from '../../components/FeedObject';
import { screenHeight, screenWidth } from '../../../config/dimensions';
import EmojiSelector from '../../components/CustomizedEmojiSelector';
import { FlatList } from 'react-native-gesture-handler';
import teacherImages from '../../../config/teacherImages';
import studentImages from '../../../config/studentImages';
import FeedList from '../../components/FeedList';
import FastResponseTouchableOpacity from '../../components/FastResponseTouchableOpacity';

export default class FeedsScreen extends React.Component {
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
    keyboardAvoidingMargin: 0,
    student: null,
    currentlySelectingIndex: {
      listIndex: -1,
      objectIndex: -1
    },
    feedsData: [],
    isSelectingEmoji: false,
    isCommenting: false,
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
    const { classInviteCode } = currentClass;
    await FirebaseFunctions.getLatestFeed(
      currentClassID,
      (index, docID, changedData) => this.refresh(index, docID, changedData)
    );
    this.setState(
      {
        isLoading: false,
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
        }, 1000)
      }
    );
  }
  refresh(docID, newData) {
    if (this._isMounted) {
      let temp = this.state.feedsData;
      for(var i = 0; i < temp.length; i++){
        if(temp[i].docID === docID){
          temp[i].data = newData;
          this.setState({ feedsData: temp });
          return;
        }
      }
      temp.push({docID, data: newData})
      this.setState({ feedsData: temp });
    }
  }
  async sendMessage(text) {
    const newObj = {
      madeByUser: {
        ID: this.state.userID,
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
    let temp = this.state.feedsData;
    temp[temp.length - 1].data.push(newObj);
    await FirebaseFunctions.updateFeedDoc(
      temp[temp.length - 1],
      temp[temp.length - 1].docID,
      this.state.currentClassID,
      true
    );
    this.setState({ newCommentTxt: '' });
  }
  async changeEmojiVote(listIndex, objectIndex, changedReactions){
    let temp = this.state.feedsData;
    console.warn(changedReactions)
    temp[listIndex].data[objectIndex].reactions = changedReactions;
    await FirebaseFunctions.updateFeedDoc(
      temp[listIndex], 
      temp[listIndex].docID,
      this.state.currentClassID, 
      false //this doesn't matter, we're not adding another Feed Object anyways
    );
  }
  toggleSelectingEmoji(listIndex, objectIndex) {
    if (!this.state.isSelectingEmoji) {
      this.setState({ currentlySelectingIndex: {listIndex, objectIndex} });
    }
    this.setState({ isSelectingEmoji: !this.state.isSelectingEmoji });
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
              scrollEnabled
              onScrollBeginDrag={() => this.setState({ isScrolling: true })}
              onScrollEndDrag={() => this.setState({ isScrolling: false })}
              keyboardShouldPersistTaps="always"
              onTouchStart={() => this.setState({ isCommenting: false })}
              style={localStyles.scrollViewStyle}
              ref={ref => (this.flatListRef = ref)}
              listKey={0}
              onContentSizeChange={() => (this.state.isScrolling ? null : this.flatListRef.scrollToEnd({animated: true}))}
              data={this.state.feedsData}
              renderItem={({ index, item, separators }) => (
                <FeedList
                  role={this.state.role}
                  teacher={this.state.teacher}
                  student={this.state.student}
                  item={item}
                  index={index}
                  onPressChangeEmojiVote={(objectIndex, changedObj) => this.changeEmojiVote(index, objectIndex, changedObj)}
                  onPressSelectEmoji={(objectIndex) =>
                    this.setState({ isSelectingEmoji: true, currentlySelectingIndex: {listIndex: index, objectIndex}})
                  }
                  beginCommenting={() => this.setState({ isCommenting: true })}
                />
              )}
            />
        </View>
        {this.state.isSelectingEmoji ? (
          <EmojiSelector
            theme={colors.primaryLight}
            onEmojiSelected={async emoji => {
              let temp = this.state.feedsData;
              let currentIndex = this.state.currentlySelectingIndex;
              temp[currentIndex.listIndex].data[currentIndex.objectIndex].reactions[
                temp[currentIndex.listIndex].data[currentIndex.objectIndex].reactions.length
              ] = {
                emoji,
                reactedBy: [this.state.userID]
              };
              await FirebaseFunctions.updateFeedDoc(
                temp[currentIndex.listIndex], 
                temp[currentIndex.listIndex].docID,
                this.state.currentClassID, 
                false, //Same here, this also doesn't matter
              );
              this.setState({ currentlySelectingIndex: {listIndex: -1, objectIndex: -1}});
              this.toggleSelectingEmoji(currentIndex.listIndex, currentIndex.objectIndex);
            }}
            onBackdropPress={() => this.toggleSelectingEmoji()}
          />
        ) : null}
        <KeyboardAvoidingView
          style={[
            localStyles.commentingContainer,
            { paddingBottom: screenHeight / 70 },
          ]}
        >
          <TextInput
            ref={ref => (this.commentInputRef = ref)}
            onTouchEnd={() => {
              FeedsScreen.whenKeyboardShows();
              this.setState({ isCommenting: true });
            }}
            value={this.state.newCommentTxt}
            onChangeText={text => this.setState({ newCommentTxt: text })}
            multiline
            onBlur={() => FeedsScreen.whenKeyboardHides()}
            blurOnSubmit={false}
            onContentSizeChange={event =>
              this.setState({
                inputHeight: event.nativeEvent.contentSize.height + 5,
              })
            }
            style={localStyles.commentingTextInput}
          />
          <FastResponseTouchableOpacity
            ref={ref => (this.sendBtnRef = ref)}
            disabled={this.state.newCommentTxt === ''}
            onPress={async () =>
              await this.sendMessage(this.state.newCommentTxt).then(() => {
                this.setState({ isCommenting: false });
              })
            }
            style={[localStyles.sendBtn]}
          >
            <Text style={{ color: colors.primaryDark }}>Send</Text>
          </FastResponseTouchableOpacity>
        </KeyboardAvoidingView>
      </SideMenu>
    );
  }
}
const localStyles = StyleSheet.create({
  containerView: {
    flex: 1
  },
  sendBtn: {
    paddingVertical: 1,
    paddingHorizontal: 5,
    borderWidth: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryLight,
    borderColor: colors.primaryLight,
    borderRadius: 10,
  },
  commentingContainer: {
    width: screenWidth,
    alignItems: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: colors.veryLightGrey
  },
  commentingTextInput: {
    borderWidth: 2,
    borderRadius: 10,
    height: '70%',
    flexWrap: 'wrap',
    marginLeft: screenWidth / 15,
    borderColor: colors.primaryDark,
    width: screenWidth / 1.75
  },
  scrollViewStyle: {
    backgroundColor: colors.lightGrey,
  },
  spinnerContainerStyle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
