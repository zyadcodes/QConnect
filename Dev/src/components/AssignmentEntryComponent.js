import React from "react";
import { Text, View, StyleSheet, KeyboardAvoidingView } from "react-native";
import { Overlay } from "react-native-elements";
import QcActionButton from "components/QcActionButton";
import strings from "config/strings";
import colors from "config/colors";
import surahNames from "config/surahNames";
import InputAutoSuggest from "components/AutoCompleteComponent/InputAutoSuggest";
import fontStyles from "config/fontStyles";
import { screenWidth, screenHeight } from "config/dimensions";

export default class AssignmentEntryComponent extends React.Component {
  state = {
    input: "",
    type: "None"
  };

  onTextChange(text) {
    this.setState({ input: text });
  }

  componentDidMount() {
    this.onTextChange(this.state.input);
  }

  render() {
    return (
      <KeyboardAvoidingView>
        <Overlay
          isVisible={this.props.visible}
          onBackdropPress={() => this.props.onCancel()}
          overlayStyle={{
            width: screenWidth * 0.9,
            height: screenHeight * 0.85
          }}
        >
          <View style={styles.container}>
            <View style={styles.spacer} />
            <InputAutoSuggest
              staticData={surahNames}
              onTextChanged={this.onTextChange.bind(this)}
              onSurahTap={(name, ename, id) =>
                this.props.onSubmit({ name, ename, id })
              }
              assignment={
                this.props.assignment === strings.None
                  ? ""
                  : this.props.assignment
              }
              inputStyle={fontStyles.mainTextStyleBlack}
              itemTextStyle={fontStyles.mainTextStyleDarkGrey}
            />

            <View style={styles.footer}>
              <QcActionButton
                text={strings.Go}
                onPress={() => {
                  this.props.assignmentType
                    ? this.props.onSubmit(this.state.input, this.state.type)
                    : this.props.onSubmit(this.state.input);
                }}
              />
              <QcActionButton
                text={strings.Cancel}
                onPress={() => this.props.onCancel()}
              />
            </View>
          </View>
        </Overlay>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "flex-start",
    flex: 1
  },
  inactiveAssignmentStyle: {
    borderRadius: screenWidth * 0.025
  },
  spacer: {
    height: screenHeight * 0.01
  },
  footer: {
    flexDirection: "row-reverse",
    justifyContent: "center"
  }
});
