import React, { useState } from "react";
import {
  Text,
  View,
  TextInput,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  ScrollView,
  Alert
} from "react-native";
import { Button } from "react-native-elements";
import strings from "config/strings";
import themeStyles from "config/themeStyles";
import fontStyles from "config/fontStyles";
import { screenHeight, screenWidth } from "config/dimensions";
import colors from "config/colors";

const PageEditMode = props => {
  const { visible, onClose, onChangeText, updatePage } = props;
  const [loading, setLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState("");

  return (
    <Modal
      animationType="fade"
      transparent={true}
      presentationStyle="overFullScreen"
      visible={visible}
    >
      <TouchableWithoutFeedback onPress={() => onClose()}>
        <View style={styles.container}>
          <View style={styles.modal}>
            <ScrollView>
              <View>
                <Text
                  style={[fontStyles.bigTextStyleDarkGrey, styles.textPadding]}
                >
                  {loading ? strings.LoadingPage : strings.GoToPage}
                </Text>
              </View>
              <View style={[styles.footerContainer]}>
                <TextInput
                  style={[
                    themeStyles.notesStyle,
                    fontStyles.bigTextStyleDarkestGrey,
                    styles.textInputStretch
                  ]}
                  accessibilityLabel="text_input_mushaf_page_number"
                  autoFocus={true}
                  selectTextOnFocus={true}
                  autoCorrect={false}
                  onChangeText={value => {
                    setPageNumber(value);
                    onChangeText(value);
                  }}
                  keyboardType="numeric"
                  maxLength={3}
                  value={pageNumber}
                />

                <Button
                  accessibilityLabel="touchable_text_go"
                  title={strings.Go}
                  onPress={() => {
                    //Ensure the entered value is a valid Mushaf page number
                    if (
                      isNaN(pageNumber) ||
                      Number(pageNumber) < 1 ||
                      Number(pageNumber) > 604
                    ) {
                      Alert.alert(strings.Whoops, strings.InvalidPageNumber);
                      return;
                    }

                    setLoading(true);

                    //hack to work around the fact that I can't dismiss the modal then
                    // update the page using Modal.onDismiss.
                    // This is tracked by this bug by React Native community
                    //https://github.com/facebook/react-native/issues/26892
                    setTimeout(() => {
                      updatePage();
                    }, 50);
                  }}
                  buttonStyle={{ backgroundColor: colors.primaryDark }}
                  loading={loading === true}
                />
              </View>
            </ScrollView>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  footerContainer: {
    flexDirection: "row",
    alignSelf: "stretch",
    alignItems: "center",
    justifyContent: "center"
  },
  modal: {
    width: screenWidth * 0.5,
    marginTop: screenHeight * 0.3,
    padding: 10,
    backgroundColor: colors.white,
    borderRadius: 5,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: screenHeight * 0.0029 },
    shadowOpacity: 0.3,
    shadowRadius: screenHeight * 0.004,
    elevation: screenHeight * 0.003,
    justifyContent: "center",
    alignSelf: "center"
  },
  textInputStretch: {
    flex: 1,
    marginHorizontal: 10
  },
  textPadding: {
    marginHorizontal: 10,
    marginVertical: 5
  }
});

export default PageEditMode;
