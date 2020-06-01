import React, { Component } from 'react';
import { FlatList, View, ScrollView } from 'react-native';
import teacherImages from '../../config/teacherImages';
import studentImages from '../../config/studentImages';
import FeedsObject from './FeedObject';

export default class FeedList extends Component {
  componentDidMount(){

  }
  render() {
    return (
      <FlatList
        listKey={this.props.index + 1}
        data={this.props.item.data}
        renderItem={({ item, index, separators }) => (
          <FeedsObject
            onPressSelectEmoji={() => this.props.onPressSelectEmoji()}
            madeByUserID={item.madeByUser.ID}
            classID={this.props.classID}
            currentUser={
              this.props.role === 'teacher'
                ? this.props.teacher
                : this.props.student
            }
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
              this.props.onPressChangeEmojiVote(index, changedReactions)
            }
            beginCommenting={() => this.props.beginCommenting()}
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
