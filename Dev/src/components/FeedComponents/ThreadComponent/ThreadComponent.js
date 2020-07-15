import React, { Component, useState } from 'react';
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
import colors from '../../../../config/colors';
import {
  screenWidth,
  screenHeight,
  screenScale,
  fontScale,
} from '../../../../config/dimensions';
import teacherImages from '../../../../config/teacherImages';
import studentImages from '../../../../config/studentImages';
import styles from './ThreadComponentStyle'

export default ThreadComponent = (props) => {
  const [threadAction, isThreadAction] =  useState(props.isExtended ? 'Collapse' : 'Extend')
  const [isExtended, setIsExtended] =  useState(props.isExtended)
  const [isCommenting, setIsCommenting] = useState(false)
  const [arrowDirection, setArrowDirection] = useState(props.isExtended
      ? 'md-arrow-dropdown'
      : 'md-arrow-dropright')

  const toggleThread = () => {
    let threadAction = 'Collapse';
    let arrowDirection = 'md-arrow-dropdown';
    if (isExtended) {
      threadAction = 'Extend';
      arrowDirection = 'md-arrow-dropright';
    }
    setIsExtended(!isExtended)
    setThreadAction(threadAction)
    setArrowDirection(arrowDirection)
  }
  const addingComment = () => {
    props.beginCommenting();
    if (!isExtended) {
      toggleThread();
    }
  }
    return (
      <View
        style={{
          position: 'relative',
          flex: 1,
          overflow: 'visible',
          bottom: screenScale * 3,
          marginTop: props.isCurrentUser ? screenScale * 8 : 0,
        }}
      >
        <View style={{ flexDirection: 'row' }}>
          {props.comments.length === 0 ? null : (
            <TouchableOpacity
              key={props.listKey + 2}
              onPress={() => toggleThread()}
              style={styles.threadActionBtn}
            >
              <Text style={styles.btnTxt}>
                {threadAction} Thread
              </Text>
              <Icon
                style={{ paddingRight: screenWidth / 40 }}
                type="ionicon"
                name={arrowDirection}
              />
            </TouchableOpacity>
          )}
        </View>
        {isExtended ? (
          <FlatList
            listKey={props.listKey + 1}
            data={props.comments}
            style={{ overflow: 'visible' }}
            renderItem={({ index, item, separators }) => (
              <View key={index} style={styles.commentContainer}>
                <Image
                  style={styles.userImage}
                  source={
                    item.user.isTeacher
                      ? teacherImages.images[item.user.imageID]
                      : studentImages.images[item.user.imageID]
                  }
                />
                <View style={styles.userNameAndComment}>
                  <Text style={{ fontWeight: 'bold' }}>{item.user.name}</Text>
                  <Text style={{ flexWrap: 'wrap', paddingRight: 40 }}>
                    {item.content}
                  </Text>
                </View>
              </View>
            )}
          />
        ) : null}
      </View>
    );
}
