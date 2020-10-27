import React from "react";
import { View, TextInput } from "react-native";
import colors from "config/colors";
import strings from "config/strings";

const QcTextInput = props => {
  return (
    <View
      style={{
        alignSelf: "stretch",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end",
        backgroundColor: Colors.pink,
        borderColor: Colors.lime,
        borderTopWidth: 4,
        padding: 6
      }}
    >
      <View
        style={{
          flex: 1,
          borderRadius: 6,
          padding: 0,
          backgroundColor: Colors.white,
          alignItems: "stretch"
        }}
      >
        <TextInput
          placeholder={Strings.child_keyboard_placeholder}
          value={this.state.messageTextInput}
          onChangeText={text => this.setState({ messageTextInput: text })}
          style={{
            height: 50,
            marginLeft: 10,
            marginRight: CONFIRM_BUTTON_SIZE / 2
          }}
          underlineColorAndroid="transparent"
          numberOfLines={2}
          maxLength={70}
          autoCorrect={false}
          returnKeyType="next"
        />
      </View>
    </View>
  );
};

export default QcTextInput;
