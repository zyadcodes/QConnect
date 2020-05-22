import React from "react";
import {
  Text,
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  PixelRatio,
} from "react-native";
import colors from "config/colors";
import { screenWidth } from "config/dimensions";

//Creates the higher order component
class Word extends React.Component {
  state = {
    selected: this.props.selected,
    isFirstSelectedWord: this.props.isFirstSelectedWord,
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (
      nextProps.selected === this.props.selected &&
      nextProps.isFirstSelectedWord === this.props.isFirstSelectedWord &&
      nextProps.isWordHighlighted === this.props.isWordHighlighted &&
      nextProps.isAyahHighlighted === this.props.isAyahHighlighted
    ) {
      return false;
    }
    return true;
  }

  render() {
    const {
      text,
      onPress,
      selected,
      isWordHighlighted,
      isFirstSelectedWord,
      highlightedColor,
      isAyahHighlighted
    } = this.props;
    let containerStyle = [styles.container];
    if (selected) {
      containerStyle.push(styles.selectionStyle);
    }
    if (isFirstSelectedWord) {
      containerStyle.push(styles.firstSelectedWordText);
    }
    if (isWordHighlighted === true) {
      containerStyle.push(styles.wordHighlightedStyle);
    }
    if (isAyahHighlighted === true) {
      containerStyle.push(styles.ayahHighlightedStyle);
    }

    if (
      highlightedColor !== undefined &&
      (isAyahHighlighted === true || isWordHighlighted === true)
    ) {
      containerStyle.push({
        backgroundColor: highlightedColor,
      });
    }
    return (
      <View style={containerStyle}>
        <TouchableWithoutFeedback onPress={() => onPress()}>
          <Text
            style={
              isWordHighlighted || isAyahHighlighted
                ? styles.highlightedWordText
                : styles.wordText
            }
          >
            {text}
          </Text>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}
const mushafFontSize =
  PixelRatio.get() <= 1.5
    ? 14
    : PixelRatio.get() < 2
    ? 15
    : screenWidth >= 400
    ? 16
    : 14;

const styles = StyleSheet.create({
  wordText: {
    textAlign: "right",
    fontFamily: "me_quran",
    fontSize: mushafFontSize,
    color: colors.darkGrey,
  },
  highlightedWordText: {
    textAlign: "right",
    fontFamily: "me_quran",
    fontSize: mushafFontSize,
    color: colors.white,
  },
  container: {
    flexGrow: 1,
    alignSelf: "stretch",
    marginVertical: 1
  },
  selectionStyle: {
    backgroundColor: colors.green
  },
  wordHighlightedStyle: {
    backgroundColor: "rgba(107,107,107,0.8)",
    borderRadius: 3,
    marginHorizontal: 1
  },
  ayahHighlightedStyle: {
    backgroundColor: "rgba(107,107,107,0.8)"
  },
  firstSelectedWordText: {
    borderTopRightRadius: 25,
    borderBottomRightRadius: 25,
  },
});

export default Word;
