import React, { Component } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import fontStyles from "config/fontStyles";
import strings from "../../config/strings";
import { screenWidth } from "config/dimensions";

export default class SignupSection extends Component {
  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          activeOpacity={1}
          accessibilityLabel={strings.CreateAccount}
          onPress={() => {
            this.props.onCreateAccount();
          }}
        >
          <Text style={fontStyles.mainTextStyleBlack}>
            {strings.CreateAccount}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={1}
          accessibilityLabel={"ForgotPassword"}
          onPress={() => {
            this.props.onForgotPassword();
          }}
        >
          <Text style={fontStyles.mainTextStyleBlack}>
            {strings.ForgotPasswordQuestion}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: screenWidth,
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-around",
  },
});
