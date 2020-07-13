import React, { Component } from 'react';
import Modal from 'react-native-modal';
import colors from '../../../../config/colors';
import {
  KeyboardAvoidingView,
  TextInput,
  View,
  Image,
  StyleSheet,
} from 'react-native';
import FeedsObject from '../FeedObject';
import studentImages from '../../../../config/studentImages';
import teacherImages from '../../../../config/teacherImages';
import { screenWidth, screenHeight } from '../../../../config/dimensions';
import { ScrollView } from 'react-native-gesture-handler';
import styles from './CommentModalStyle'

export default CommentModal = (props) => {
    return (
      <Modal
        isVisible={true}
        onBackdropPress={() => props.onBackdropPress()}
        style={styles.modalStyle}
      >
        <ScrollView style={styles.scrollViewStyle}>
          <FeedsObject
            onPressSelectEmoji={() => props.onPressSelectEmoji()}
            madeByUserID={props.item.madeByUser.ID}
            isMadeByCurrentUser={
              props.currentUser.ID === props.item.madeByUser.ID
            }
            classID={props.classID}
            currentUser={props.currentUser}
            viewableBy={
              props.item.viewableBy === undefined
                ? null
                : props.item.viewableBy
            }
            role={props.role}
            content={props.item.content}
            number={props.objectIndex}
            studentClassInfo={
              props.item.type === 'assignment' &&
              props.role === 'student'
                ? props.studentClassInfo
                : null
            }
            hiddenContent={
              props.item.type === 'assignment' &&
              props.role === 'student'
                ? props.item.hiddenContent
                : null
            }
            onPressChangeEmojiVote={changedReactions =>
              props.onPressChangeEmojiVote(
                props.listIndex,
                props.objectIndex,
                changedReactions
              )
            }
            beginCommenting={objectIndex =>
              props.beginCommenting(props.listIndex, objectIndex)
            }
            onPressSelectEmoji={() =>
              props.onPressSelectEmoji(props.objectIndex)
            }
            key={props.objectIndex}
            type={props.item.type}
            userName={props.item.madeByUser.name}
            comments={props.item.comments}
            reactions={props.item.reactions}
            isThreadExtended={true}
            imageRequire={
              props.item.madeByUser.role === 'teacher'
                ? teacherImages.images[props.item.madeByUser.imageID]
                : studentImages.images[props.item.madeByUser.imageID]
            }
          />
        </ScrollView>
        <View style={{ alignSelf: 'flex-end' }}>{props.children}</View>
      </Modal>
    );
}
