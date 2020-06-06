import React, { Component } from 'react';
import Modal from 'react-native-modal';
import colors from '../../../config/colors';
import {
  KeyboardAvoidingView,
  TextInput,
  View,
  Image,
  StyleSheet,
} from 'react-native';
import FeedsObject from './FeedObject';
import studentImages from '../../../config/studentImages';
import teacherImages from '../../../config/teacherImages';
import { screenWidth, screenHeight } from '../../../config/dimensions';
import { ScrollView } from 'react-native-gesture-handler';

export default class CommentModal extends Component {
  render() {
    return (
      <Modal
        isVisible={true}
        onBackdropPress={() => this.props.onBackdropPress()}
        style={{
          backgroundColor: colors.primaryVeryLight,
          maxWidth: screenWidth * 0.9,
          alignSelf: 'center',
          justifyContent: 'space-between'
        }}
      >
        <ScrollView style={{ flex: 1, marginTop: screenHeight / 40 }}>
          <FeedsObject
            onPressSelectEmoji={() => this.props.onPressSelectEmoji()}
            madeByUserID={this.props.item.madeByUser.ID}
            isMadeByCurrentUser={
              this.props.currentUser.ID === this.props.item.madeByUser.ID
            }
            classID={this.props.classID}
            currentUser={this.props.currentUser}
            viewableBy={
              this.props.item.viewableBy === undefined
                ? null
                : this.props.item.viewableBy
            }
            role={this.props.role}
            content={this.props.item.content}
            number={this.props.objectIndex}
            studentClassInfo={
              this.props.item.type === 'assignment' &&
              this.props.role === 'student'
                ? this.props.studentClassInfo
                : null
            }
            hiddenContent={
              this.props.item.type === 'assignment' &&
              this.props.role === 'student'
                ? this.props.item.hiddenContent
                : null
            }
            onPressChangeEmojiVote={changedReactions =>
              this.props.onPressChangeEmojiVote(
                this.props.listIndex,
                this.props.objectIndex,
                changedReactions
              )
            }
            beginCommenting={objectIndex =>
              this.props.beginCommenting(this.props.listIndex, objectIndex)
            }
            onPressSelectEmoji={() =>
              this.props.onPressSelectEmoji(this.props.objectIndex)
            }
            key={this.props.objectIndex}
            type={this.props.item.type}
            userName={this.props.item.madeByUser.name}
            comments={this.props.item.comments}
            reactions={this.props.item.reactions}
            isThreadExtended={true}
            imageRequire={
              this.props.item.madeByUser.role === 'teacher'
                ? teacherImages.images[this.props.item.madeByUser.imageID]
                : studentImages.images[this.props.item.madeByUser.imageID]
            }
          />
        </ScrollView>
        <View style={{ alignSelf: 'flex-end' }}>{this.props.children}</View>
      </Modal>
    );
  }
}
