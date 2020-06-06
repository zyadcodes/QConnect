import React, { Component } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  Text,
  TextInput,
  KeyboardAvoidingView,
} from 'react-native';
import { Icon } from 'react-native-elements';
import colors from '../../../config/colors';
import {
  screenWidth,
  screenHeight,
  screenScale,
  fontScale,
} from '../../../config/dimensions';
import teacherImages from '../../../config/teacherImages';
import studentImages from '../../../config/studentImages';

export default class ThreadComponent extends Component {
  state = {
    threadAction: this.props.isExtended ? 'Collapse' : 'Extend',
    isExtended: this.props.isExtended,
    isCommenting: false,
    arrowDirection: this.props.isExtended
      ? 'md-arrow-dropdown'
      : 'md-arrow-dropright'
  };
  toggleThread() {
    let threadAction = 'Collapse';
    let arrowDirection = 'md-arrow-dropdown';
    if (this.state.isExtended) {
      threadAction = 'Extend';
      arrowDirection = 'md-arrow-dropright';
    }
    this.setState({
      isExtended: !this.state.isExtended,
      threadAction,
      arrowDirection,
    });
  }
  addingComment() {
    this.props.beginCommenting();
    if (!this.state.isExtended) {
      this.toggleThread();
    }
  }
  render() {
    return (
      <View
        style={{
          position: 'relative',
          bottom: screenScale * 3,
          width: this.props.isAssignment ? '60%' : '75%',
          marginTop: this.props.isCurrentUser ? screenScale * 8 : 0,
        }}
      >
        <View style={{ flexDirection: 'row' }}>
          {this.props.comments.length === 0 ? null : (
            <TouchableOpacity
              key={this.props.listKey + 2}
              onPress={() => this.toggleThread()}
              style={this.localStyles.threadActionBtn}
            >
              <Text style={this.localStyles.btnTxt}>
                {this.state.threadAction} Thread
              </Text>
              <Icon
                style={{ paddingRight: screenWidth / 40 }}
                type="ionicon"
                name={this.state.arrowDirection}
              />
            </TouchableOpacity>
          )}
        </View>
        {this.state.isExtended ? (
          <FlatList
            listKey={this.props.listKey + 1}
            data={this.props.comments}
            renderItem={({ index, item, separators }) => (
              <View key={index} style={this.localStyles.commentContainer}>
                <Image
                  style={this.localStyles.userImage}
                  source={
                    item.user.isTeacher
                      ? teacherImages.images[item.user.imageID]
                      : studentImages.images[item.user.imageID]
                  }
                />
                <View style={this.localStyles.userNameAndComment}>
                  <Text style={{ fontWeight: 'bold' }}>{item.user.name}</Text>
                  <Text>{item.content}</Text>
                </View>
              </View>
            )}
          />
        ) : null}
      </View>
    );
  }
  localStyles = StyleSheet.create({
    threadActionBtn: {
      flexDirection: 'row',
      backgroundColor: colors.primaryLight,
      borderColor: colors.primaryLight,
      borderWidth: 2,
      borderRadius: screenWidth / 2,
      alignItems: 'center',
      justifyContent: 'space-around',
      paddingLeft: screenWidth / 150,
      paddingRight: screenWidth / 150,
    },
    commentingTextInput: {
      width: 100,
      height: 30
    },
    commentingContainer: {
      backgroundColor: '#0000ff'
    },
    btnTxt: {
      paddingLeft: screenWidth / 40,
      paddingRight: screenWidth / 40
    },
    userImage: {
      width: screenScale * 14,
      height: screenScale * 14,
      marginLeft: screenWidth / 45,
      resizeMode: 'contain'
    },
    userNameAndComment: {
      alignContent: 'space-around',
      marginLeft: screenWidth / 45
    },
    commentContainer: {
      width: screenWidth / 2,
      marginTop: screenHeight / 100,
      flexDirection: 'row'
    }
  });
}
