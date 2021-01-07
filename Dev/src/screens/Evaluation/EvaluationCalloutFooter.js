import React from "react";
import { View, StyleSheet } from "react-native";
import { Button } from "react-native-elements";
import fontStyles from "config/fontStyles";
import colors from "config/colors";

const EvaluationCalloutFooter = props => {
  const { onClear, onClose } = props;

  return (
    <View style={styles.buttonsFooter}>
      <Button
        title="Clear"
        accessibilityLabel="eval_callout_clear"
        type="clear"
        titleStyle={fontStyles.mainTextStyleDarkishGrey}
        buttonStyle={styles.clearButtonStyle}
        onPress={() => onClear()}
      />
      <View style={styles.saveButtonContainer}>
        <Button
          titleStyle={fontStyles.mainTextStyleWhite}
          accessibilityLabel="eval_callout_save"
          title="Save"
          buttonStyle={styles.saveButton}
          onPress={() => onClose()}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonsFooter: {
    flexDirection: "row",
    paddingTop: 5,
    height: 40,
    borderTopWidth: 1,
    borderTopColor: colors.lightGrey
  },
  clearButtonStyle: {
    marginRight: 5
  },
  saveButtonContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end"
  },
  saveButton: {
    backgroundColor: colors.primaryDark,
    paddingHorizontal: 25
  }
});

export default EvaluationCalloutFooter;
