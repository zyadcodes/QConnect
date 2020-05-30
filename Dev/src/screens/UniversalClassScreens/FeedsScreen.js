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

export default class FeedsScreen extends React.Component {
  dismissKeyboard = require('dismissKeyboard');

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
    currentlySelectingIndex: -1,
    feedsData: [],
    isSelectingEmoji: false,
    isCommenting: false,
    newCommentTxt: '',
    isScrolling: false,
    inputHeight: screenHeight/12
  };

  _isMounted = false;
  static whenKeyboardShows;
  static whenKeyboardHides;

  static doThisWhenKeyboardShows(func){
    FeedsScreen.whenKeyboardShows = func;  
  }
  static doThisWhenKeyboardHides(func){
    FeedsScreen.whenKeyboardHides = func;  
  }
  async componentDidMount() {
    console.warn(screenHeight/12)
    FirebaseFunctions.setCurrentScreen('Class Feed Screen', 'ClassFeedScreen');
    const { userID } = this.props.navigation.state.params;
    const teacher = await FirebaseFunctions.getTeacherByID(userID);
    let currentClassID;
    let LeftNavPane;
    let classes;
    let userType;
    userType = teacher;
    if (teacher == -1) {
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
    const feedsData = await FirebaseFunctions.getLatestFeed(currentClassID,  (index, changedData) => this.refresh(index, changedData));
    console.warn(feedsData)
    this.setState({
      isLoading: false,
      currentClass,
      currentClassID,
      classInviteCode,
      LeftNavPane,
      feedsData,
      userID,
      classes,
    }, () => setTimeout(() => {
      this._isMounted = true;     
      this.scrollViewRef.scrollToEnd({animated: true})
    }, 1000));
  }
  refresh(index, newData){
    if(this._isMounted){  
      console.warn(this.state.feedsData)
      let temp = this.state.feedsData;
      temp[index] = {data: newData};
      this.setState({feedsData: temp});
      if(!this.state.isScrolling){
        this.scrollViewRef.scrollToEnd({animated: true});
      }
    }
  }
  async sendMessage(text){
    const newObj = {
      madeByUser: {
        ID: this.state.userID,
        imageID: this.state.role === 'teacher' ?
          this.state.teacher.profileImageID
          : this.state.student.profileImageID
      },
      type: 'text',
      content: text,
      comments: [],
      reactions: []
    }
    let temp = this.state.feedsData;
    console.warn(temp)
    temp[temp.length-1].data.push(newObj);
    await FirebaseFunctions.updateFeed(temp, this.state.currentClassID, (index, changedData) => this.refresh(index, changedData));
    this.scrollViewRef.scrollToEnd({animated: true});
    this.setState({newCommentTxt: ''})
  }
  toggleSelectingEmoji(index) {
    if (!this.state.isSelectingEmoji) {
      this.setState({ currentlySelectingIndex: index });
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
      <View per style={[localStyles.containerView, {paddingTop: 0}]}>
        <TopBanner
          LeftIconName="navicon"
          LeftOnPress={() => this.setState({ isOpen: true })}
          Title={this.state.currentClass.name + ' Feed'}
        />
        <ScrollView onScrollBeginDrag={() => this.setState({isScrolling: true})} onScrollEndDrag={() => this.setState({isScrolling: false})} ref={ref => this.scrollViewRef = ref} keyboardShouldPersistTaps="always" onTouchStart={() => this.setState({isCommenting: false})} style={localStyles.scrollViewStyle}>
          <FlatList
            listKey={0}
            data={this.state.feedsData}
            renderItem={({ index, item, separators }) => (
              <FeedList 
                role={this.state.role}
                teacher={this.state.teacher}
                student={this.state.student}
                item={item}
                index={index}
                onPressSelectEmoji={() => this.setState({isSelectingEmoji: true})}
                beginCommenting={() => this.setState({isCommenting: true})}/>
            )}
          />
        </ScrollView>
      </View>
      {this.state.isSelectingEmoji ?
          <EmojiSelector
            theme={colors.primaryLight}
            onEmojiSelected={emoji => {
              let temp = this.state.feedsData;
              let currentIndex = this.state.currentlySelectingIndex;
              temp[currentIndex].reactions[
              temp[currentIndex].reactions.length
              ] = {
                emoji,
                reactedBy: [this.state.userID]
              };
              this.setState({ currentlySelectingIndex: -1, feedsData: temp });
              this.toggleSelectingEmoji();
            }}
            onBackdropPress={() => this.toggleSelectingEmoji()}
           />
        :
        null
      }
        <KeyboardAvoidingView style={[localStyles.commentingContainer, {paddingBottom: screenHeight/70}]}>
            <TextInput 
            ref={ref => this.commentInputRef =ref}
            onTouchEnd={() => {FeedsScreen.whenKeyboardShows(); this.setState({isCommenting: true})}}
            value={this.state.newCommentTxt}
            onChangeText={text => this.setState({newCommentTxt: text})} 
            multiline 
            onBlur={() => FeedsScreen.whenKeyboardHides()}
            blurOnSubmit={false}
            onContentSizeChange={(event) => this.setState({inputHeight: event.nativeEvent.contentSize.height+5})} 
            style={localStyles.commentingTextInput}/>
            <TouchableOpacity disabled={this.state.newCommentTxt === ''} onPress={async () => await this.sendMessage(this.state.newCommentTxt).then(this.setState({isCommenting: false}))} style={[localStyles.sendBtn]}>
              <Text style={{color: colors.primaryDark}}>
                Send
              </Text>
            </TouchableOpacity>
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
    marginLeft: screenWidth/15,
    borderColor: colors.primaryDark,
    width: screenWidth/2
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
