import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import colors from "config/colors";

const QcTextInput = props => {
  return (
    <View style={styles.container}>
      <View style={styles.innerWrapper}>
        <TextInput
          placeholder={props.placeholder}
          value={props.value}
          selectTextOnFocus
          onChangeText={text => props.onChangeText(text)}
          style={styles.textInputStyle}
          underlineColorAndroid="transparent"
          accessibilityLabel={props.accessibilityLabel || "qc_text_input"}
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

const styles = StyleSheet.create({
  container: {
    alignSelf: "stretch",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    backgroundColor: colors.lightGrey,
    borderColor: colors.lightGrey,
    flex: 1,
    padding: 6
  },
  innerWrapper: {
    flex: 1,
    borderRadius: 6,
    padding: 0,
    backgroundColor: colors.white,
    alignItems: "stretch"
  },
  textInputStyle: {
    height: 50,
    marginLeft: 10,
    marginRight: 10
  }
});

export default QcTextInput;
