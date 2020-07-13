import React, { Component, useEffect, useState } from 'react';
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
import styles from './FeedObjectStyle'

export default FeedsObject = (props) => {
  const [surahName, setSurahName] = useState('')
  const [page, setPage] = useState([])
  const [isReactionScrollViewOpen, setIsReactionScrollViewOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  // const [shownReactions, setShownReactions] = useState([])
  // const [hiddenReactions, setHiddenReactions] = useState([])

  useEffect(() => {
    if (props.type === 'assignment') {
      setIsLoading(true)
      const pageLines = await getPageTextWbWLimitedLines(
        props.content.start.page,
        5
      );
      let allAyat = (
        <View>
          {pageLines !== undefined &&
            pageLines.map((line, index) => {
              if (
                line.type === 'besmellah' &&
                props.content.start.ayah === 1
              ) {
                return <Basmalah key={line.line + "_basmalah"} />;
              } else {
                return (
                  <TextLine
                    key={props.content.start.page + '_' + line.line}
                    lineText={line.text}
                    selectionOn={false}
                    highlightedWord={undefined}
                    selectedAyahsEnd={props.content.end}
                    selectedAyahsStart={props.content.start}
                    selectionStarted={false}
                    selectionCompleted={false}
                    isFirstWord={false}
                    onSelectAyah={(ayah, word) => {}}
                    page={props.content.start.page}
                    lineAlign={
                      props.content.start.page === 1 ? 'center' : 'stretch'
                    }
                  />
                );
              }
            })}
        </View>
      );
      setSurahName(pageLines[0].surah)
      setPage(allAyat)
      setIsLoading(false)
    }
    // let tempShownReactions = [];
    // for (var i = 0; i < 3 && i < props.reactions.length; i++) {
    //   tempShownReactions[i] = props.reactions[i];
    // }
    // let tempHiddenReactions = [];
    // for (var i = 3; i < props.reactions.length; i++) {
    //   tempHiddenReactions[i - 3] = props.reactions[i];
    // }
    // setHiddenReactions(tempHiddenReactions)
    // setShownReactions(tempShownReactions)
  }, [])
  const changeEmojiVote = (reactionIndex) => {
    let temp = props.reactions.slice();
    if (temp[reactionIndex].reactedBy.includes(props.currentUser.ID)) {
      temp[reactionIndex].reactedBy.splice(
        temp[reactionIndex].reactedBy.indexOf(props.currentUser.ID),
        1
      );
    } else {
      temp[reactionIndex].reactedBy.push(props.currentUser.ID);
    }
    if (temp[reactionIndex].reactedBy.length === 0) {
      temp.splice(reactionIndex, 1);
    }
    return temp;
  }
    return props.role === 'student' &&
      props.type === 'assignment' &&
      props.viewableBy !== 'everyone' &&
      !props.viewableBy.includes(props.currentUser.ID) ? null : (
      <View key={props.number} style={styles.containerView}>
        <View style={styles.imageAndNameContainer}>
          <Image
            source={props.imageRequire}
            style={styles.userImage}
          />
          <Text style={styles.userName}>{props.userName}</Text>
        </View>
        <View
          style={{
            overflow: 'visible',
            flexDirection: props.isMadeByCurrentUser
              ? 'row-reverse'
              : 'row',
            maxWidth: screenWidth / 1.5,
          }}
        >
          <View
            onLayout={nativeEvent => {
              contentContainerViewWidth =
                nativeEvent.nativeEvent.layout.width;
              contentContainerViewHeight =
                nativeEvent.nativeEvent.layout.height;
            }}
            style={{
              overflow: 'visible',
              marginLeft: props.isMadeByCurrentUser
                ? 0
                : screenScale * 18 + screenWidth / 45,
              marginRight: props.isMadeByCurrentUser
                ? screenScale * 18 + screenWidth / 45
                : 0,
            }}
          >
            <View>
              {props.type === 'assignment' ? (
                <Text
                  style={[
                    styles.newAssignmentText,
                    { fontSize: fontScale * 18 },
                  ]}
                >
                  New Assignment:{' '}
                </Text>
              ) : null}
              <View style={styles.contentContainerView}>
                {props.type === 'assignment' ? (
                  <QuranAssignmentView
                    setScreenToLoading={() =>
                      setState({ isLoading: true })
                    }
                    surahName={surahName}
                    page={page}
                    onPushToOtherScreen={(pushParamScreen, pushParamObj) =>
                      props.onPushToOtherScreen(
                        pushParamScreen,
                        pushParamObj
                      )
                    }
                    isLoading={isLoading}
                    role={props.role}
                    classID={props.classID}
                    studentClassInfo={props.studentClassInfo}
                    content={props.content}
                    madeByUserID={props.madeByUserID}
                    currentUser={props.currentUser}
                  />
                ) : (
                  <Text
                    style={[
                      styles.contentText,
                      props.type === 'achievement'
                        ? { color: '#009500', fontWeight: 'bold' }
                        : { color: colors.black },
                    ]}
                  >
                    {props.content}
                  </Text>
                )}
              </View>
            </View>
            <View
              style={{
                flexDirection: props.isMadeByCurrentUser
                  ? 'row-reverse'
                  : 'row',
                justifyContent: 'space-between',
                alignSelf: 'stretch',
                flex: 1,
              }}
            >
              {props.isMadeByCurrentUser ||
              !props.showCommentButton ? (
                <View />
              ) : (
                <TouchableOpacity
                  key="comment"
                  onPress={() => props.beginCommenting(props.number)}
                  style={[styles.addReaction, { left: 0 }]}
                >
                  <Icon
                    type="font-awesome"
                    name="commenting"
                    size={fontScale * 16}
                    color={
                      props.type === 'achievement'
                        ? '#009500'
                        : colors.primaryDark
                    }
                  />
                </TouchableOpacity>
              )}
              <View
                style={{
                  flexDirection: props.isMadeByCurrentUser
                    ? 'row-reverse'
                    : 'row'
                }}
              >
                {props.reactions.length > 1 ? (
                  <View>
                    <TouchableOpacity
                      onPress={() =>
                        setState({
                          isReactionScrollViewOpen: !state
                            .isReactionScrollViewOpen,
                        })
                      }
                      activeOpacity={0.6}
                      style={[
                        styles.addReaction,
                        { width: screenScale * 12, marginRight: 3 },
                      ]}
                    >
                      <View style={styles.reactionView}>
                        <Text>
                          +
                          {
                            props.reactions.slice(
                              1,
                              props.reactions.length
                            ).length
                          }
                        </Text>
                      </View>
                    </TouchableOpacity>
                    {isReactionScrollViewOpen ? (
                      <ScrollView
                        style={styles.hiddenReactionsScrollView}
                      >
                        <FlatList
                          listKey="extra reactions"
                          data={props.reactions.slice(
                            1,
                            props.reactions.length
                          )}
                          renderItem={({ index, item, separators }) => (
                            <TouchableOpacity
                              onPress={() =>
                                props.onPressChangeEmojiVote(
                                  changeEmojiVote(index)
                                )
                              }
                              key={index}
                              activeOpacity={0.6}
                              style={[
                                styles.Reaction,
                                item.reactedBy.includes(
                                  props.currentUser.ID
                                )
                                  ? {
                                      backgroundColor: colors.lightBlue,
                                      borderColor: colors.lightBlue,
                                    }
                                  : props.type === 'achievement'
                                  ? {
                                      backgroundColor: '#00ff00',
                                      borderColor: '#00ff00'
                                    }
                                  : {
                                      backgroundColor: colors.primaryLight,
                                      borderColor: colors.primaryLight,
                                    },
                                {
                                  bottom: 0,
                                  left: 0,
                                  marginTop: 3,
                                  marginRight: 0,
                                }
                              ]}
                            >
                              <View style={styles.reactionView}>
                                <Text>{item.reactedBy.length}</Text>
                                <Text>{item.emoji}</Text>
                              </View>
                            </TouchableOpacity>
                          )}
                        />
                      </ScrollView>
                    ) : null}
                  </View>
                ) : null}
                <FlatList
                  data={props.reactions.slice(0, 1)}
                  style={{ flexDirection: 'row' }}
                  renderItem={({ item, index, seperators }) => (
                    <TouchableOpacity
                      onPress={() =>
                        props.onPressChangeEmojiVote(
                          changeEmojiVote(index)
                        )
                      }
                      key={index}
                      activeOpacity={0.6}
                      style={[
                        styles.Reaction,
                        item.reactedBy.includes(props.currentUser.ID)
                          ? {
                              backgroundColor: colors.lightBlue,
                              borderColor: colors.lightBlue,
                            }
                          : props.type === 'achievement'
                          ? {
                              backgroundColor: '#00ff00',
                              borderColor: '#00ff00'
                            }
                          : {
                              backgroundColor: colors.primaryLight,
                              borderColor: colors.primaryLight,
                            },
                      ]}
                    >
                      <View style={styles.reactionView}>
                        <Text>{item.reactedBy.length}</Text>
                        <Text>{item.emoji}</Text>
                      </View>
                    </TouchableOpacity>
                  )}
                />
                {props.isMadeByCurrentUser ? null : (
                  <TouchableOpacity
                    key="reaction"
                    onPress={() => props.onPressSelectEmoji()}
                    style={[styles.addReaction]}
                    activeOpacity={0.6}
                  >
                    <Icon
                      name="plus"
                      type="entypo"
                      size={fontScale * 16}
                      color={
                        props.type === 'achievement'
                          ? '#009500'
                          : colors.primaryDark
                      }
                    />
                  </TouchableOpacity>
                )}
              </View>
            </View>
            <ThreadComponent
              isCurrentUser={props.isMadeByCurrentUser}
              listKey={props.number}
              isAssignment={props.type === 'assignment'}
              comments={props.comments}
              isExtended={props.isThreadExtended}
            />
          </View>
          {props.type === 'achievement' ? (
            <Image
              style={styles.medallionStyle}
              source={require('../../../assets/medallion.png')}
            />
          ) : null}
        </View>
      </View>
    );
}
