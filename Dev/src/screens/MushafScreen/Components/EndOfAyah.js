import React from "react";
import {
  Text,
  StyleSheet,
  View,
  ActivityIndicator,
  PixelRatio,
  TouchableHighlight,
  TouchableOpacity
} from "react-native";
import colors from "config/colors";
import { screenWidth } from "config/dimensions";
import { Popover, PopoverController } from "react-native-modal-popover";
import { Icon } from "react-native-elements";

const mushafFontSize =
  PixelRatio.get() <= 1.5
    ? 14
    : PixelRatio.get() < 2
    ? 15
    : screenWidth >= 400
    ? 16
    : 14;

const EndOfAyahView = ({ highlighted, ayahNumber, mushafFontScale }) => {
  const endOfAyahSymbol = "\u06DD";

  const textfontSize =
    mushafFontScale === undefined
      ? mushafFontSize
      : mushafFontSize / mushafFontScale;

  return (
    <View>
      <Text
        style={[
          styles.ayahSeparator,
          highlighted ? { color: colors.white } : {},
          { fontSize: textfontSize }
        ]}
      >
        {endOfAyahSymbol}
      </Text>
      <View style={styles.ayahNumberContainer}>
        <Text
          style={[
            styles.ayahNumber,
            highlighted ? { color: colors.white } : {},
            { fontSize: textfontSize * 0.55 }
          ]}
        >
          {ayahNumber}
        </Text>
      </View>
    </View>
  );
};
//Creates the higher order component
const EndOfAyah = ({
  word,
  curAyah,
  onPress,
  selected,
  highlighted,
  isLastSelectedAyah,
  showLoading,
  highlightedColor,
  showTooltipOnPress,
  evalNotesComponent,
  removeHighlight,
  mushafFontScale
}) => {
  const ayahNumber = word.aya;

  let containerStyle = [styles.container];
  if (selected) {
    containerStyle.push(styles.selectionStyle);
  }
  if (isLastSelectedAyah) {
    containerStyle.push(styles.lastSelectedAyah);
  }
  if (highlighted === true) {
    containerStyle.push(styles.highlightedStyle);
    if (highlightedColor) {
      containerStyle.push({ backgroundColor: highlightedColor });
    }
  }

  return (
    <View style={containerStyle}>
      {showLoading === true ? (
        <View style={styles.spinnerContainer}>
          <ActivityIndicator
            size="small"
            color={highlighted ? colors.white : colors.primaryDark}
            animating={showLoading}
          />
        </View>
      ) : showTooltipOnPress === true ? (
        <PopoverController>
          {({
            openPopover,
            closePopover,
            popoverVisible,
            setPopoverAnchor,
            popoverAnchorRect
          }) => (
            <React.Fragment>
              <TouchableHighlight
                accessibilityLabel={"end_of_ayah_" + ayahNumber}
                ref={setPopoverAnchor}
                onPress={() => {
                  openPopover();
                  if (!highlighted) {
                    onPress();
                  }
                }}
              >
                <EndOfAyahView
                  ayahNumber={ayahNumber}
                  highlighted={highlighted}
                />
              </TouchableHighlight>

              <Popover
                contentStyle={styles.content}
                arrowStyle={styles.arrow}
                backgroundStyle={styles.background}
                visible={popoverVisible}
                onClose={closePopover}
                fromRect={popoverAnchorRect}
                supportedOrientations={["portrait"]}
              >
                <View style={styles.popOverContainer}>
                  <TouchableOpacity
                    accessibilityLabel="remove_eval_note"
                    onPress={() => {
                      removeHighlight(word, curAyah);
                      closePopover();
                    }}
                  >
                    <Icon
                      name="delete-forever-outline"
                      type="material-community"
                      color={colors.darkRed}
                    />
                  </TouchableOpacity>

                  <View style={styles.spacer} />
                  <TouchableOpacity
                    accessibilityLabel="close_eval_note"
                    onPress={() => {
                      closePopover();
                    }}
                  >
                    <Icon
                      name="close"
                      type="antdesign"
                      color={colors.darkGrey}
                    />
                  </TouchableOpacity>
                </View>
                {evalNotesComponent(word, curAyah)}
              </Popover>
            </React.Fragment>
          )}
        </PopoverController>
      ) : (
        <TouchableHighlight
          accessibilityLabel={"end_of_ayah_" + ayahNumber}
          onPress={() => onPress()}
        >
          <EndOfAyahView
            ayahNumber={ayahNumber}
            highlighted={highlighted}
            mushafFontScale={mushafFontScale}
          />
        </TouchableHighlight>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignSelf: "stretch",
    marginVertical: 1
  },
  ayahNumberContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center"
  },
  ayahNumber: {
    textAlign: "right",
    fontFamily: "me_quran",
    fontSize: mushafFontSize * 0.55,
    color: colors.primaryDark
  },
  ayahSeparator: {
    textAlign: "right",
    fontFamily: "me_quran",
    alignItems: "center",
    alignSelf: "center",
    fontSize: mushafFontSize,
    color: colors.primaryDark
  },
  selectionStyle: {
    backgroundColor: colors.green
  },
  highlightedStyle: {
    backgroundColor: "rgba(107,107,107,0.8)",
    borderTopLeftRadius: 25,
    borderBottomLeftRadius: 25
  },
  lastSelectedAyah: {
    borderTopLeftRadius: 25,
    borderBottomLeftRadius: 25
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
  spacer: {
    width: 10,
    height: 10
  },
  popOverContainer: {
    top: 5,
    left: screenWidth * 0.75,
    flexDirection: "row",
    zIndex: 1,
    position: "absolute" // add if dont work with above
  },
  spinnerContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 3
  }
});

export default EndOfAyah;
