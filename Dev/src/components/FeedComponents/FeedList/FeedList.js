import React, { Component } from 'react';
import { FlatList, View, ScrollView } from 'react-native';
import teacherImages from '../../../config/teacherImages';
import studentImages from '../../../config/studentImages';
import FeedsObject from './FeedObject';
import { screenHeight } from '../../../config/dimensions';

export default FeedList = (props) => {
    return (
      <FlatList
        listKey={props.index + 1}
        data={props.item.data}
        style={{ marginTop: props.index === 0 ? screenHeight / 40 : 0 }}
        renderItem={({ item, index, separators }) => (
          <FeedsObject
            showCommentButton={true}
            onPressSelectEmoji={() => props.onPressSelectEmoji()}
            madeByUserID={item.madeByUser.ID}
            isMadeByCurrentUser={
              props.currentUser.ID === item.madeByUser.ID
            }
            classID={props.classID}
            currentUser={props.currentUser}
            onPushToOtherScreen={(pushParamScreen, pushParamObj) =>
              props.onPushToOtherScreen(pushParamScreen, pushParamObj)
            }
            viewableBy={item.viewableBy === undefined ? null : item.viewableBy}
            role={props.role}
            content={item.content}
            number={index}
            studentClassInfo={
              item.type === 'assignment' && props.role === 'student'
                ? props.studentClassInfo
                : null
            }
            hiddenContent={
              item.type === 'assignment' && props.role === 'student'
                ? item.hiddenContent
                : null
            }
            onPressChangeEmojiVote={changedReactions =>
              props.onPressChangeEmojiVote(
                props.index,
                index,
                changedReactions
              )
            }
            beginCommenting={objectIndex =>
              props.beginCommenting(props.index, objectIndex)
            }
            onPressSelectEmoji={() => props.onPressSelectEmoji(index)}
            key={index}
            type={item.type}
            userName={item.madeByUser.name}
            comments={item.comments}
            reactions={item.reactions}
            isThreadExtended={false}
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
