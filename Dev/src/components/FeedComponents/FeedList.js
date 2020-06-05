import React, { Component } from 'react';
import { FlatList, View, ScrollView } from 'react-native';
import teacherImages from '../../../config/teacherImages';
import studentImages from '../../../config/studentImages';
import FeedsObject from './FeedObject';
import { screenHeight } from '../../../config/dimensions';

export default class FeedList extends Component {
  render() {
    return (
      <FlatList
        listKey={this.props.index + 1}
        data={this.props.item.data}
        style={{ marginTop: this.props.index === 0 ? screenHeight / 40 : 0 }}
        renderItem={({ item, index, separators }) => (
          <FeedsObject
            showCommentButton={true}
            onPressSelectEmoji={() => this.props.onPressSelectEmoji()}
            madeByUserID={item.madeByUser.ID}
            isMadeByCurrentUser={
              this.props.currentUser.ID === item.madeByUser.ID
            }
            classID={this.props.classID}
            currentUser={this.props.currentUser}
            onPushToOtherScreen={(pushParamScreen, pushParamObj) =>
              this.props.onPushToOtherScreen(pushParamScreen, pushParamObj)
            }
            viewableBy={item.viewableBy === undefined ? null : item.viewableBy}
            role={this.props.role}
            content={item.content}
            number={index}
            studentClassInfo={
              item.type === 'assignment' && this.props.role === 'student'
                ? this.props.studentClassInfo
                : null
            }
            hiddenContent={
              item.type === 'assignment' && this.props.role === 'student'
                ? item.hiddenContent
                : null
            }
            onPressChangeEmojiVote={changedReactions =>
              this.props.onPressChangeEmojiVote(
                this.props.index,
                index,
                changedReactions
              )
            }
            beginCommenting={(objectIndex) => this.props.beginCommenting(this.props.index, objectIndex)}
            onPressSelectEmoji={() => this.props.onPressSelectEmoji(index)}
            key={index}
            type={item.type}
            userName={item.madeByUser.name}
            comments={item.comments}
            reactions={item.reactions}
            imageRequire={
              item.madeByUser.role === 'teacher'
                ? teacherImages.images[item.madeByUser.imageID]
                : studentImages.images[item.madeByUser.imageID]
            }
          />
        )}
      />
    );
  }
}
