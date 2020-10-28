import React from "react";
import {
  View,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  TouchableOpacity
} from "react-native";
import { Icon } from "react-native-elements";
import QcActionButton from "components/QcActionButton";
import strings from "config/strings";
import surahNames from "config/surahNames";
import InputAutoSuggest from "components/AutoCompleteComponent/InputAutoSuggest";
import fontStyles from "config/fontStyles";
import { screenWidth, screenHeight } from "config/dimensions";
import colors from "config/colors";

export default class AssignmentEntryComponent extends React.Component {
  state = {
    input: "",
    type: "None",
    keyboardSpace: 0
  };

  onTextChange(text) {
    this.setState({ input: text });
  }

  componentDidMount() {
    this.onTextChange(this.state.input);

    //To mitigate a keyboard padding issue on android, we will shorten the height of the modal
    // to keep it within visible screen
    // this problem doesn't happen on ios so this mitigation is not needed there.
    if (Platform.OS === "android") {
      Keyboard.addListener("keyboardDidShow", frames => {
        if (!frames.endCoordinates) {
          return;
        }
        this.setState({ keyboardSpace: frames.endCoordinates.height });
      });

      Keyboard.addListener("keyboardDidHide", frames =>
        this.setState({ keyboardSpace: 0 })
      );
    }
  }

  render() {
    return (
      <View>
        <Modal
          animationType="slide"
          transparent={true}
          presentationStyle="overFullScreen"
          visible={this.props.visible}
          onRequestClose={() => this.props.onCancel()}
        >
          <TouchableWithoutFeedback onPress={() => this.props.onCancel()}>
            <View
              style={[
                styles.centeredView,
                { height: screenHeight * 0.85 - this.state.keyboardSpace }
              ]}
            >
              <View
                style={[
                  styles.modal,
                  { height: screenHeight * 0.85 - this.state.keyboardSpace }
                ]}
              >
                <View style={styles.container}>
                  <View style={styles.spacer} />
                  <View>
                    <TouchableOpacity
                      style={{ alignItems: "flex-end", padding: 5 }}
                      onPress={() => this.props.onCancel()}
                    >
                      <Icon name="close" type="material-community" />
                    </TouchableOpacity>
                  </View>
                  <InputAutoSuggest
                    staticData={surahNames}
                    onTextChanged={this.onTextChange.bind(this)}
                    onSurahTap={(name, ename, id) =>
                      this.props.onSubmit({ name, ename, id })
                    }
                    inputStyle={fontStyles.mainTextStyleBlack}
                    itemTextStyle={fontStyles.mainTextStyleDarkGrey}
                  />
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  container: {
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
  },
  modal: {
    width: screenWidth * 0.9,
    height: screenHeight * 0.85,
    backgroundColor: colors.white,
    borderRadius: 5,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: screenHeight * 0.0029 },
    shadowOpacity: 0.3,
    shadowRadius: screenHeight * 0.004,
    elevation: screenHeight * 0.003
  }
});
