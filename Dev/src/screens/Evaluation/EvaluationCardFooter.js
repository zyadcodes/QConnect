import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Icon } from "react-native-elements";
import { screenWidth } from "config/dimensions";
import colors from "config/colors";

/**
 * 
 * @param {onExpandCollapse, evaluationCollapsed} props 
 */
const EvaluationCardFooter = props => {
  return (
    <View style={styles.cardExpandFooter}>
      <TouchableOpacity
        accessibilityLabel="btn_expand_notes"
        onPress={props.onExpandCollapse}
      >
        <Icon
          name={
            props.evaluationCollapsed ? "angle-double-down" : "angle-double-up"
          }
          type="font-awesome"
          color={colors.primaryDark}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  cardExpandFooter: {
    bottom: 5,
    left: screenWidth * 0.9,
    zIndex: 1,
    position: "absolute"
  }
});

export default EvaluationCardFooter;
