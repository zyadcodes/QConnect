import React, { useEffect, useState } from 'react';
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
import FirebaseFunctions from '../../../../config/FirebaseFunctions';
import colors from '../../../../config/colors';
import SideMenu from 'react-native-side-menu';
import StudentLeftNavPane from '../../StudentScreens/LeftNavPane';
import TeacherLeftNavPane from '../../TeacherScreens/LeftNavPane';
import LoadingSpinner from '../../../components/LoadingSpinner';
import TopBanner from 'components/TopBanner';
import FeedsObject from '../../components/FeedComponents/FeedObject';
import { screenHeight, screenWidth } from '../../../../config/dimensions';
import EmojiSelector from '../../../components/CustomizedEmojiSelector';
import { FlatList } from 'react-native-gesture-handler';
import teacherImages from '../../../../config/teacherImages';
import studentImages from '../../../../config/studentImages';
import FeedList from '../../components/FeedComponents/FeedList';
import FastResponseTouchableOpacity from '../../../components/FastResponseTouchableOpacity';
import Modal from 'react-native-modal';
import CommentModal from '../../components/FeedComponents/CommentModal';
import ChatInput from '../../components/FeedComponents/ChatInput';
import FeedHandler from '../../../components/FeedComponents/FeedHandler';
import styles from './FeedsScreenStyle'

export default FeedsScreen = (props) =>{
  const [currentClass, setCurrentClass] = useState({})
  const [isOpen, setIsOpen] = useState(false)
  const [classes, setClasses] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [userID, setUserID] = useState('')
  const [LeftNavPane, setLeftNavPane] = useState({})
  const [role, setRole] = useState('')
  const [currentClassID, setCurrentClassID] = useState('')
  const [teacher, setTeacher] = useState(null)
  const [student, setStudent] = useState(null)
  const [studentClassIndex, setStudentClassIndex] = useState(-1)
  const [studentClassInfo, setStudentClassInfo] = useState(null)
  const [currentlySelectingIndex, setCurrentlySelectingIndex] = useState({
    listIndex: -1,
    objectIndex: -1
  })
  const [currentlyCommentingOn] = useState({
    listIndex: -1,
    objectIndex: -1
  })
  const [scrollLength, setScrollLength] = useState(0)
  const [currentScrollLoc, setCurrentScrollLoc] = useState(0)
  const [feedsData, setFeedsData] = useState([])
  const [oldestFeedDoc, setOldestFeedDoc] = useState('-1')
  const [isRefreshingOldFeeds, setIsRefreshingOldFeeds] = useState(false)
  const [isSelectingEmoji, setIsSelectingEmoji] = useState(false)
  const [isCommenting, setIsCommenting] = useState(false)
  const [isChatting, setIsChatting] = useState(false)
  const [newCommentTxt, setNewCommentTxt] = useState('')
  const [newChatTxt, setNewChatTxt] = useState('')

  let _isMounted = false;

  useEffect(() => {
    asyncUseEffect();
    return () => {
      unsubscribeBlur();
      unsubscribeFocus();
      FirebaseFunctions.call('unsubscribeFromFeedListeners', {});
    }
  }, [])

  const asyncUseEffect = async () => {
    FirebaseFunctions.setCurrentScreen('Class Feed Screen', 'ClassFeedScreen');
    const { userID } = props.navigation.params;
    const teacher = await FirebaseFunctions.getTeacherByID(userID);
    let currentClassID;
    let LeftNavPane;
    let classes;
    let userType = teacher;
    if (teacher === -1) {
      const student = await FirebaseFunctions.getStudentByID(userID);
      userType = student;
      LeftNavPane = StudentLeftNavPane;
      setStudent(student)
      setRole('student')
    } else {
      LeftNavPane = TeacherLeftNavPane;
      setTeacher(teacher)
      setRole('teacher')
    }
    currentClassID = userType.currentClassID;
    classes = await FirebaseFunctions.getClassesByIDs(userType.classes);
    const currentClass = await FirebaseFunctions.getClassByID(currentClassID);
    if (teacher === -1) {
      const studentClassInfo = currentClass.students.find(student => {
        return student.ID === userType.ID;
      });
      setStudentClassInfo(studentClassInfo)
    }
    const { classInviteCode } = currentClass;
    isOnFeedsScreen = true;
    unsubscribeBlur = props.navigation.addListener('didBlur', () => {
      isOnFeedsScreen = false;
    });
    unsubscribeFocus = props.navigation.addListener(
      'didFocus',
      () => {
        if (!FeedHandler.shouldntShowBadge) {
          iHaveSeenLatestFeed(currentClassID);
        }
        isOnFeedsScreen = true;
      }
    );
    await FirebaseFunctions.call('getLatestFeed', {
      currentClassID,
      refreshFunction: refresh.bind(this)
    });
    setCurrentClass(currentClass)
    setCurrentClassID(currentClassID)
    setClassInviteCode(classInviteCode)
    setLeftNavPane(LeftNavPane)
    setUserID(userID)
    setClasses(classes)
    _isMounted = true;
  }

  const iHaveSeenLatestFeed = async (currentClassID) => {
    await FirebaseFunctions.call('updateSeenFeedForInidividual', {
      classID: currentClassID,
      hasSeenFeed: true,
      isTeacher: role === 'teacher',
      userObj: role === 'teacher' ? teacher : student
    });
  }
  const refresh = async (docID, newData, isNewDoc) => {
    if (_isMounted) {
      let tempData = feedsData.slice();
      if (isNewDoc) {
        setIsLoading(false)
        tempData.push({ docID, data: newData });
        setFeedsData(tempData)
        if (parseInt(oldestFeedDoc) === -1) {
          setOldestFeedDoc(docID)
        }
        if (
          isOnFeedsScreen &&
          scrollLength - currentScrollLoc <
            screenHeight / 2
        ) {
          iHaveSeenLatestFeed(currentClassID);
        }
        return;
      }
      if (parseInt(oldestFeedDoc) > parseInt(docID)) {
        tempData.unshift({ docID, data: newData });
        setFeedsData(tempData)
        setOldestFeedDoc(docID)
        return;
      }
      for (var i = 0; i < tempData.length; i++) {
        if (tempData[i].docID === docID) {
          tempData[i].data = newData;
          setFeedsData(tempData)
          if (
            isOnFeedsScreen &&
            scrollLength - currentScrollLoc <
              screenHeight / 2
          ) {
            iHaveSeenLatestFeed(currentClassID);
          }
          return;
        }
      }
    }
  }
  const addComment = async (text) => {
    const {
      feedsData,
      currentlyCommentingOn,
      role,
      student,
      teacher,
      currentClassID,
    } = state;
    let tempData = feedsData[currentlyCommentingOn.listIndex].data.slice();
    let docID = feedsData[currentlyCommentingOn.listIndex].docID;
    let currComments = tempData[
      currentlyCommentingOn.objectIndex
    ].comments.slice();
    currComments.push({
      user: {
        imageID:
          role === 'teacher' ? teacher.profileImageID : student.profileImageID,
        isTeacher: role === 'teacher',
        name: role === 'teacher' ? teacher.name : student.name,
      },
      content: text,
    });
    tempData[currentlyCommentingOn.objectIndex].comments = currComments;
    await FirebaseFunctions.call('updateFeedDoc', {
      changedData: tempData,
      docID,
      classID: currentClassID,
      isLastIndex: false
    });
  }
  const determineScrollHeight = () => {
    const { feedsData } = state;
    let predictedHeight = 0;
    for (var i = 0; i < feedsData.length; i++) {
      for (var j = 0; j < feedsData[i].data.length; j++) {
        predictedHeight += screenHeight / 6.5;
      }
    }
    return predictedHeight;
  }
  const sendMessage = async (text) => {
    const newObj = {
      madeByUser: {
        ID: userID,
        name:
          role === 'teacher'
            ? teacher.name
            : student.name,
        imageID:
          role === 'teacher'
            ? teacher.profileImageID
            : student.profileImageID,
        role: role
      },
      type: 'text',
      content: text,
      comments: [],
      reactions: []
    };
    let tempData = feedsData[
      feedsData.length - 1
    ].data.slice();
    let docID = feedsData[feedsData.length - 1].docID;
    tempData.push(newObj);
    await FirebaseFunctions.call('updateFeedDoc', {
      changedData: tempData,
      docID,
      classID: currentClassID,
      isLastIndex: true
    });
    setNewChatTxt('')
  }
  const changeEmojiVote = async (listIndex, objectIndex, changedReactions) => {
    let tempData = feedsData[listIndex].data.slice();
    let docID = feedsData[listIndex].docID;
    tempData[objectIndex].reactions = changedReactions;
    await FirebaseFunctions.call('updateFeedDoc', {
      changedData: tempData,
      docID,
      classID: currentClassID,
      isLastIndex: false //this doesn't matter, we're not adding another Feed Object anyways
    });
  }
  const toggleSelectingEmoji = (listIndex, objectIndex) => {
    if (!isSelectingEmoji) {
      setCurrentlySelectingIndex({ listIndex, objectIndex });
    }
    setIsSelectingEmoji(!isSelectingEmoji)
  }
  const refreshOldFeed = async () => {
    setIsRefreshingOldFeeds(true)
    if (oldestFeedDoc === "0") {
      setIsRefreshingOldFeeds(false)
      return;
    }
    await FirebaseFunctions.call('addOldFeedDoc', {
      classID: currentClassID,
      currentOldest: oldestFeedDoc,
      refreshFunction: refresh.bind(this)
    });
  }

  if (isLoading) {
      return (
        <View style={styles.spinnerContainerStyle}>
          <LoadingSpinner isVisible={true} />
        </View>
      );
  }
  return (
      <SideMenu
        onChange={isOpen => {
          setIsOpen(isOpen)
        }}
        isOpen={isOpen}
        menu={
          <LeftNavPane
            teacher={teacher}
            student={student}
            userID={userID}
            classes={classes}
            edgeHitWidth={0}
            navigation={props.navigation}
          />
        }
      >
          <TopBanner
            LeftIconName="navicon"
            LeftOnPress={() => setIsOpen(true)}
            Title={currentClass.name + ' Feed'}
          />
          <ScrollView
            onScroll={nativeEvent => {
                  setCurrentScrollLoc(nativeEvent.nativeEvent.contentOffset.y)
                  if (currentScrollLoc > scrollLength) {
                    setState({
                      scrollLength: currentScrollLoc,
                    });
                  }
                  if (
                    scrollLength - currentScrollLoc <
                      screenHeight / 3 &&
                    !FeedHandler.shouldntShowBadge
                  ) {
                    iHaveSeenLatestFeed(currentClassID);
                  }
            }}
            keyboardShouldPersistTaps="always"
            ref={ref => (scrollViewRef = ref)}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshingOldFeeds}
                onRefresh={() => refreshOldFeed()}
              />
            }
            style={styles.scrollViewStyle}
            listKey={0}
            onLayout={() =>
              setTimeout(
                () => scrollViewRef.scrollToEnd({ animated: true }),
                1000
              )
            }
            scrollEventThrottle={16}
            onContentSizeChange={() => {
              setState(
                { scrollLength: determineScrollHeight() },
                () => {
                  if (
                    !(
                      isRefreshingOldFeeds ||
                      scrollLength - currentScrollLoc >
                        screenHeight / 3
                    )
                  ) {
                    scrollViewRef.scrollToEnd({ animated: true });
                  }
                  setState({ isRefreshingOldFeeds: false });
                }
              );
            }}
          >
            <FlatList
              listKey={1}
              data={feedsData}
              renderItem={({ index, item, separators }) => (
                <FeedList
                  role={role}
                  teacher={teacher}
                  student={student}
                  key={item.docID}
                  currentUser={
                    role === 'teacher'
                      ? teacher
                      : student
                  }
                  item={item}
                  onPushToOtherScreen={(pushParamScreen, pushParamObj) => {
                    setState({ isLoading: true });
                    props.navigation.push(pushParamScreen, pushParamObj);
                    setState({ isLoading: false });
                  }}
                  studentClassInfo={studentClassInfo}
                  index={index}
                  onPressChangeEmojiVote={changeEmojiVote.bind(this)}
                  onPressSelectEmoji={objectIndex =>
                    setState({
                      isSelectingEmoji: true,
                      currentlySelectingIndex: { listIndex: index, objectIndex },
                    })
                  }
                  beginCommenting={(listIndex, objectIndex) => {
                    setState({
                      currentlyCommentingOn: { listIndex, objectIndex },
                      isCommenting: true,
                    });
                  }}
                />
              )}
            />
          </ScrollView>
        {isSelectingEmoji ? (
          <EmojiSelector
            theme={colors.primaryLight}
            onEmojiSelected={async emoji => {
              let currentIndex = currentlySelectingIndex;
              let docID = feedsData[currentIndex.listIndex].docID;
              let tempData = feedsData[
                currentIndex.listIndex
              ].data.slice();
              tempData[currentIndex.objectIndex].reactions[
                tempData[currentIndex.objectIndex].reactions.length
              ] = {
                emoji,
                reactedBy: [userID]
              };
              await FirebaseFunctions.call('updateFeedDoc', {
                changedData: tempData,
                docID,
                classID: currentClassID,
                isLastIndex: false //Same here, this also doesn't matter
              });
              setState({
                currentlySelectingIndex: { listIndex: -1, objectIndex: -1 },
              });
              toggleSelectingEmoji(
                currentIndex.listIndex,
                currentIndex.objectIndex
              );
            }}
            onBackdropPress={toggleSelectingEmoji.bind(this)}
          />
        ) : null}
        {isCommenting ? (
          <CommentModal
            onBackdropPress={() => setIsCommenting(false)}
            item={
              feedsData[currentlyCommentingOn.listIndex]
                .data[currentlyCommentingOn.objectIndex]
            }
            role={role}
            teacher={teacher}
            student={student}
            objectIndex={currentlyCommentingOn.objectIndex}
            listIndex={currentlyCommentingOn.listIndex}
            currentUser={
              role === 'teacher'
                ? teacher
                : student
            }
            onPushToOtherScreen={(pushParamScreen, pushParamObj) => {
              setIsLoading(true)
              props.navigation.push(pushParamScreen, pushParamObj);
              setIsLoading(false)
            }}
            classID={currentClassID}
            studentClassInfo={studentClassInfo}
            onPressChangeEmojiVote={changeEmojiVote.bind(this)}
            onPressSelectEmoji={objectIndex => {
                setIsSelectingEmoji(true)
                setCurrentlySelectingIndex({ listIndex: index, objectIndex })
            }}
            showCommentButton={false}
          >
            <ChatInput
              width={0.9 * screenWidth}
              value={newCommentTxt}
              onChangeText={text => setNewCommentTxt(text)}
              onTextInputBlur={() => FeedHandler.whenKeyboardHides()}
              textInputOnTouchEnd={() => {}}
              ref={ref => (chatInputRef = ref)}
              sendOnPress={async () => {
                await addComment(newCommentTxt);
                setState({ newCommentTxt: '' });
              }}
            />
          </CommentModal>
        ) : null}
        <ChatInput
          width={screenWidth}
          value={newChatTxt}
          onChangeText={text => setState({ newChatTxt: text })}
          onTextInputBlur={() => FeedHandler.whenKeyboardHides()}
          textInputOnTouchEnd={() => {
            FeedHandler.whenKeyboardShows();
            setIsChatting(true)
          }}
          ref={ref => (chatInputRef = ref)}
          sendOnPress={async () => {
            await sendMessage(newChatTxt).then(() => {
              setIsChatting(false)
            });
          }}
        />
      </SideMenu>
  );
}

