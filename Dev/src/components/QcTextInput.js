import React from "react";
import { View, TextInput } from "react-native";
import colors from "config/colors";
import strings from "config/strings";

/**
 *
 * @param {style={[styles.inputDefaultStyle, inputStyle]}
          value={value}
          clearButtonMode="while-editing"
          selectTextOnFocus
          autoCorrect={false}
          onChangeText={this.searchList}} props
 */
const QcTextInput = props => {
  return (
    <View
      style={{
        alignSelf: "stretch",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end",
        backgroundColor: colors.lightGrey,
        borderColor: colors.lightGrey,
        flex: 1,
        padding: 6
      }}
    >
      <View
        style={{
          flex: 1,
          borderRadius: 6,
          padding: 0,
          backgroundColor: colors.white,
          alignItems: "stretch"
        }}
      >
        <TextInput
          placeholder={props.placeholder}
          value={props.value}
          selectTextOnFocus
          onChangeText={text => props.onChangeText(text)}
          style={{
            height: 50,
            marginLeft: 10,
            marginRight: 10
          }}
          underlineColorAndroid="transparent"
          numberOfLines={2}
          maxLength={70}
          autoCorrect={false}
          clearButtonMode="while-editing"
          returnKeyType="next"
        />
      </View>
    </View>
  );
};

export default QcTextInput;
