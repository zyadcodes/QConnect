import React, {Component} from 'react'
import {KeyboardAvoidingView, TextInput, Text, StyleSheet} from 'react-native'
import FastResponseTouchableOpacity from '../FastResponseTouchableOpacity'
import colors from '../../../config/colors'
import FeedsScreen from '../../screens/UniversalClassScreens/FeedsScreen'
import {screenHeight, screenWidth} from '../../../config/dimensions'

export default class ChatInput extends Component {
    render(){
        return(
            <KeyboardAvoidingView
                style={[
                  localStyles.commentingContainer,
                  { 
                    paddingBottom: screenHeight / 70,
                    width: this.props.width
                  },
                ]}
              >
                <TextInput
                  ref={ref => (this.commentInputRef = ref)}
                  onTouchEnd={() => this.props.textInputOnTouchEnd()}
                  value={this.props.newCommentTxt}
                  onChangeText={text => this.props.onChangeText(text)}
                  multiline
                  onBlur={() => this.props.onTextInputBlur()}
                  blurOnSubmit={false}
                  onContentSizeChange={event => this.props.textInputOnContentSizeChange(event)}
                  style={localStyles.commentingTextInput}
                />
                <FastResponseTouchableOpacity
                  ref={ref => (this.sendBtnRef = ref)}
                  disabled={this.props.newCommentTxt === ''}
                  onPress={async () => await this.props.sendOnPress()}
                  style={[localStyles.sendBtn]}
                >
                  <Text style={{ color: colors.primaryDark }}>Send</Text>
                </FastResponseTouchableOpacity>
            </KeyboardAvoidingView>
        )
    }
}
const localStyles = StyleSheet.create({
    sendBtn: {
        paddingVertical: 1,
        paddingHorizontal: 5,
        borderWidth: 5,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.primaryLight,
        borderColor: colors.primaryLight,
        borderRadius: 10,
      },
      commentingContainer: {
        alignItems: 'flex-end',
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: colors.primaryVeryLight
      },
      commentingTextInput: {
        borderWidth: 2,
        borderRadius: 10,
        height: '70%',
        flexWrap: 'wrap',
        marginLeft: screenWidth / 15,
        borderColor: colors.primaryDark,
        width: screenWidth / 1.75
      },
})