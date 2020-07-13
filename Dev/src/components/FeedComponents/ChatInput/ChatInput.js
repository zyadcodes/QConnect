import React, { Component } from 'react';
import {
  KeyboardAvoidingView,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import FastResponseTouchableOpacity from '../../FastResponseTouchableOpacity';
import colors from '../../../../config/colors';
import { screenHeight, screenWidth } from '../../../../config/dimensions';
import styles from './ChatInputStyle'

export default ChatInput = (props) => {
    return (
      <KeyboardAvoidingView
        style={[
          styles.commentingContainer,
          {
            paddingBottom: screenHeight / 70,
            width: props.width
          },
        ]}
        accessible
      >
        <TextInput
          onTouchEnd={() => props.textInputOnTouchEnd()}
          value={props.value}
          onChangeText={text => props.onChangeText(text)}
          multiline
          onBlur={() => props.onTextInputBlur()}
          blurOnSubmit={false}
          onContentSizeChange={event =>
            props.textInputOnContentSizeChange(event)
          }
          style={styles.commentingTextInput}
        />
        <TouchableOpacity
          ref={ref => (sendBtnRef = ref)}
          disabled={props.value === ''}
          onPress={async () => await props.sendOnPress()}
          style={[styles.sendBtn, { opacity: props.value === '' ? 0.3 : 1.0 }]}
        >
          <Text style={{ color: colors.primaryDark }}>Send</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    );
}

