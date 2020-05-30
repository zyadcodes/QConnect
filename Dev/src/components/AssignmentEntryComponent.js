import React from "react";
import {
  Modal,
  Text,
  View,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableOpacity,
  Switch,
} from "react-native";
import QcActionButton from "components/QcActionButton";
import strings from "config/strings";
import colors from "config/colors";
import surahNames from "config/surahNames";
import InputAutoSuggest from "components/AutoCompleteComponent/InputAutoSuggest";
import fontStyles from "config/fontStyles";
import MultiSwitch from "react-native-multi-switch";
import { screenWidth, screenHeight } from "config/dimensions";

export default class AssignmentEntryComponent extends React.Component {
  state = {
    input: "",
    type: "None",
    surahAscending: true,
    tableData: surahNames,
  };

  onTextChange(text) {
    this.setState({ input: text });
  }

  componentDidMount() {
    this.onTextChange(this.state.input);
  }

  // toggleSortOrder = () => {
  //   const surahNamesDec = surahNames.reverse();
  //   return surahNamesDec;
  // };
  render() {
    return (
      <KeyboardAvoidingView>
        <Modal
          animationType="fade"
          transparent={true}
          presentationStyle="overFullScreen"
          visible={this.props.visible}
          onRequestClose={() => {}}
        >
          <View
            style={{
              marginVertical: screenHeight * 0.073,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              paddingBottom: screenHeight * 0.029,
            }}
          >
            <View style={styles.modal}>
              <Text style={fontStyles.mainTextStyleDarkGrey}>
                {strings.EnterAssignment}
              </Text>

              <View style={styles.spacer} />
             
              <InputAutoSuggest
                staticData={this.state.tableData}
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
              

              {this.props.assignmentType === true ? (
                <View>
                  <View style={styles.spacer} />
                  <MultiSwitch
                    choiceSize={screenWidth * 0.25}
                    onActivate={(index) => {
                      const type =
                        index === 0
                          ? strings.Reading
                          : index === 1
                          ? strings.Memorization
                          : strings.Revision;
                      this.setState({
                        type,
                      });
                    }}
                    activeContainerStyle={[
                      {
                        marginVertical: screenHeight * 0.025,
                        backgroundColor: colors.grey,
                        borderRadius: screenWidth * 0.025,
                      },
                      {
                        marginVertical: screenHeight * 0.025,
                        backgroundColor: colors.green,
                        borderRadius: screenWidth * 0.025,
                      },
                      {
                        marginVertical: screenHeight * 0.025,
                        backgroundColor: colors.darkishGrey,
                        borderRadius: screenWidth * 0.025,
                      },
                    ]}
                    inactiveContainerStyle={[
                      styles.inactiveAssignmentStyle,
                      styles.inactiveAssignmentStyle,
                      {
                        marginVertical: screenHeight * 0.025,
                        marginLeft: screenWidth * 0.005,
                        borderRadius: screenWidth * 0.025,
                      },
                    ]}
                  >
                    <Text style={fontStyles.smallTextStyleDarkGrey}>
                      {strings.Reading}
                    </Text>
                    <Text style={fontStyles.smallTextStyleDarkGrey}>
                      {strings.Memorization}
                    </Text>
                    <Text style={fontStyles.smallTextStyleDarkGrey}>
                      {strings.Revision}
                    </Text>
                  </MultiSwitch>
                </View>
              ) : (
                <View />
              )}

              {/* <TouchableOpacity onPress={this.toggleSortOrder.bind(this)}>
                <Text>Filter {JSON.stringify(this.state.surahAscending)}</Text>
              </TouchableOpacity> */}
              <View
                style={{
                  flexDirection: "row-reverse",
                  marginBottom: 30,
                }}
              >
                <QcActionButton
                  text={strings.Submit}
                  screen={this.props.screen}
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
          </View>
        </Modal>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  modal: {
    backgroundColor: colors.lightGrey,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    marginVertical: screenHeight * 0.03,
    borderWidth: 1,
    borderRadius: 2,
    borderColor: colors.grey,
    borderBottomWidth: 1,
    shadowColor: colors.darkGrey,
    shadowOffset: { width: 0, height: screenHeight * 0.0029 },
    shadowOpacity: 0.8,
    shadowRadius: screenHeight * 0.004,
    elevation: screenHeight * 0.003,
    marginHorizontal: screenWidth * 0.11,
    paddingHorizontal: 0.012 * screenWidth,
  },
  inactiveAssignmentStyle: {
    borderRadius: screenWidth * 0.025,
  },
  spacer: {
    height: screenHeight * 0.01,
  },
});
