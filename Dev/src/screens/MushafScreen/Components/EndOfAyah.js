import React from 'react';
import {
  Text,
  StyleSheet,
  View,
  ActivityIndicator,
  PixelRatio,
  TouchableHighlight
} from 'react-native';
import colors from 'config/colors';
import { screenWidth } from "config/dimensions";

//Creates the higher order component
const EndOfAyah = ({
  ayahNumber,
  onPress,
  selected,
  highlighted,
  isLastSelectedAyah,
  showLoading
}) => {
  const rightBracket = '  \uFD3F';
  const leftBracket = '\uFD3E';
  const endOfAyahSymbol = '\u06DD';
  let containerStyle = [styles.container];
  if (selected) {
    containerStyle.push(styles.selectionStyle);
  }
  if (isLastSelectedAyah) {
    containerStyle.push(styles.lastSelectedAyah);
  }
  if (highlighted === true) {
    containerStyle.push(styles.highlightedStyle);
  }

  return (
    <View style={containerStyle}>
      {showLoading === true ? (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            paddingTop: 3,
          }}
        >
          <ActivityIndicator
            size="small"
            color={highlighted ? colors.white : colors.primaryDark}
            animating={showLoading}
          />
        </View>
      ) : (
        <TouchableHighlight onPress={() => onPress()}>
          <View>
            <Text
              style={[
                styles.ayahSeparator,
                highlighted ? { color: colors.white } : {},
              ]}
            >
              {endOfAyahSymbol}
            </Text>
            <View style={styles.ayahNumberContainer}>
              <Text
                style={[
                  styles.ayahNumber,
                  highlighted ? { color: colors.white } : {},
                ]}
              >
                {ayahNumber}
              </Text>
            </View>
          </View>
        </TouchableHighlight>
      )}
    </View>
  );
};

const mushafFontSize =
  PixelRatio.get() <= 1.5
    ? 14
    : PixelRatio.get() < 2
    ? 15
    : screenWidth >= 400
    ? 16
    : 14;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignSelf: 'stretch',
    marginVertical: 1
  },
  ayahNumberContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center'
  },
  ayahNumber: {
    textAlign: 'right',
    fontFamily: 'me_quran',
    fontSize: mushafFontSize * 0.55,
    color: colors.primaryDark,
  },
  ayahSeparator: {
    textAlign: 'right',
    fontFamily: 'me_quran',
    alignItems: 'center',
    alignSelf: 'center',
    fontSize: mushafFontSize,
    color: colors.primaryDark,
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
  }
});

export default EndOfAyah;
