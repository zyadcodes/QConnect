import React from "react";
import { TouchableHighlight, Text } from "react-native";
import PropTypes from "prop-types";
import fontStyles from "config/fontStyles";

//--------------------------------------------------------------------------
// A "link" style button. TouchableHighlight over a text with some styling
//--------------------------------------------------------------------------
const TouchableText = props => {
  return (
    <TouchableHighlight
      onPress={props.onPress}
      accessibilityLabel={
        props.accessibilityLabel
          ? props.accessibilityLabel
          : "touchable_text_" + props.Text
      }
    >
      <Text
        accessibilityLabel={props.Text}
        style={[fontStyles.smallTextStylePrimaryDark, props.style]}
      >
        {props.text}
      </Text>
    </TouchableHighlight>
  );
};

TouchableText.propTypes = {
  text: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  style: PropTypes.object
};

export default TouchableText;
