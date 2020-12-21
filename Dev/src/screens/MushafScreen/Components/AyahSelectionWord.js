import React from "react";
import {
  Text,
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  PixelRatio
} from "react-native";
import colors from "config/colors";
import { screenWidth } from "config/dimensions";

const getCircularReplacer = () => {
  const seen = new WeakSet();
  return (key, value) => {
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) {
        return;
      }
      seen.add(value);
    }
    return value;
  };
};

const mushafFontSize =
  PixelRatio.get() <= 1.5
    ? 14
    : PixelRatio.get() < 2
    ? 15
    : screenWidth >= 400
    ? 16
    : 14;

//Creates the higher order component
class Word extends React.Component {
  state = {
    selected: this.props.selected,
    isFirstSelectedWord: this.props.isFirstSelectedWord
  };

  shouldComponentUpdate(nextProps) {
    if (
      nextProps.selected === this.props.selected &&
      nextProps.isFirstSelectedWord === this.props.isFirstSelectedWord &&
      nextProps.isWordHighlighted === this.props.isWordHighlighted &&
      nextProps.isAyahHighlighted === this.props.isAyahHighlighted &&
      nextProps.mushafFontScale === this.props.mushafFontScale &&
      nextProps.readOnly === this.props.readOnly
    ) {
      return false;
    }
    return true;
  }

  //renders the word content.
  //The content is then wrapped in either poppover control or simple touchable
  // depending on the mus7af version that is being rendered.
  renderWord() {
    const {
      word,
      isWordHighlighted,
      isAyahHighlighted,
      selected,
      mushafFontScale
    } = this.props;
    const { text } = word;

    let wordFontSize =
      mushafFontScale === undefined
        ? mushafFontSize
        : mushafFontSize / mushafFontScale;

    let label =
      "mwt_" +
      word.id +
      (selected ? "_sel" : "") +
      (isAyahHighlighted ? "_ah" : "") +
      (isWordHighlighted ? "_wh" : "");

    return (
      <View>
        <Text
          accessibilityLabel={label}
          style={[
            isWordHighlighted || isAyahHighlighted
              ? styles.highlightedWordText
              : styles.wordText,
            {
              fontSize: wordFontSize
            }
          ]}
          adjustsFontSizeToFit
        >
          {text}
        </Text>
      </View>
    );
  }

  render() {
    const {
      onPress,
      selected,
      isWordHighlighted,
      isFirstSelectedWord,
      highlightedColor,
      isAyahHighlighted,
      word
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

    let highlightWord =
      highlightedColor !== undefined &&
      (isAyahHighlighted === true || isWordHighlighted === true);

    if (highlightWord) {
      containerStyle.push({
        backgroundColor: highlightedColor
      });
    }
    return (
      <View style={containerStyle}>
        <TouchableWithoutFeedback
          accessibilityLabel={"mushaf_word_" + word.id}
          onPress={() => onPress()}
        >
          {this.renderWord()}
        </TouchableWithoutFeedback>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wordText: {
    textAlign: "right",
    fontFamily: "me_quran",
    //fontSize: moderateScale(mushafFontSize, 0.4),
    color: colors.darkGrey
  },
  highlightedWordText: {
    textAlign: "right",
    fontFamily: "me_quran",
    //fontSize: moderateScale(mushafFontSize, 0.4),
    color: colors.white
  },
  container: {
    flexGrow: 1,
    alignSelf: "stretch",
    marginVertical: 1
  },
  selectionStyle: {
    backgroundColor: colors.green
  },
  closeIconContainer: { width: 10, height: 10 },
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
    borderBottomRightRadius: 25
  },
  app: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#c2ffd2"
  },
  content: {
    padding: 16,
    backgroundColor: colors.white,
    borderRadius: 8,
    width: screenWidth * 0.9,
    minHeight: 150
  },
  arrow: {
    borderTopColor: "pink"
  },
  background: {
    backgroundColor: "rgba(107,107,107,0.2)"
  },
  popOverContainer: {
    top: 5,
    right: 5,
    flexDirection: "row",
    zIndex: 1,
    position: "absolute" // add if dont work with above
  }
});

export default Word;
