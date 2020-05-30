import React, {Component} from 'react'
import {FlatList, View, ScrollView} from 'react-native'
import teacherImages from '../../config/teacherImages'
import studentImages from '../../config/studentImages'
import FeedsObject from './FeedObject'

export default class FeedList extends Component {
    render(){
        return (
            <FlatList listKey={this.props.index+1} data={this.props.item.data} renderItem={({item, index, separators}) =>
                <FeedsObject
                    onPressSelectEmoji={() => this.props.onPressSelectEmoji()}
                    madeByUser={item.madeByUser.ID}
                    currentUser={
                    this.props.role === 'teacher'
                        ? this.props.teacher
                        : this.props.student
                    }
                    role={this.props.role}
                    content={item.content}
                    number={index}
                    onPressChangeEmojiVote={(changedReactions) => this.props.onPressChangeEmojiVote(index, changedReactions)}
                    beginCommenting={() => this.props.beginCommenting()}
                    onPressSelectEmoji={() => this.props.onPressSelectEmoji(index)}
                    key={index}
                    type={item.type}
                    comments={item.comments}
                    reactions={item.reactions}
                    imageRequire={this.props.role === 'teacher' ? teacherImages.images[item.madeByUser.imageID] : studentImages.images[item.madeByUser.imageID]}
                />}
            />
        )
    }
}