import React, { Component } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  Text,
} from 'react-native';
import { Icon } from 'react-native-elements';
import colors from '../../config/colors';
import {
  screenWidth,
  screenHeight,
  screenScale,
  fontScale,
} from '../../config/dimensions';
import teacherImages from '../../config/teacherImages';
import studentImages from '../../config/studentImages';

export default class ThreadComponent extends Component {
  state = {
    threadAction: 'Extend',
    isExtended: false,
    arrowDirection: 'md-arrow-dropright'
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
  render() {
    return (
      <View
        style={{
          width: this.props.isAssignment ? '60%' : '75%',
          marginTop: this.props.isCurrentUser ? screenScale * 8 : 0,
        }}
      >
        <TouchableOpacity
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
        {this.state.isExtended ? (
          <FlatList
            listKey={this.props.listKey + 1}
            data={this.props.Comments}
            renderItem={({ index, item, separators }) => (
              <View style={this.localStyles.commentContainer}>
                <Image
                  style={this.localStyles.userImage}
                  source={
                    item.user.isTeacher
                      ? teacherImages.images[item.user.imageID]
                      : studentImages.images[item.user.imageID]
                  }
                />
                <View style={this.localStyles.userNameAndComment}>
                  <Text style={{ fontWeight: 'bold' }}>{item.user.Name}</Text>
                  <Text>fewfjewifjewiofjewiofjewfweffjewiojfowe</Text>
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
