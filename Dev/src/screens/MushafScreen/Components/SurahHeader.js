import React from "react";
import { Text, StyleSheet, View, ImageBackground } from "react-native";
import fontStyles from "config/fontStyles";

//Creates the higher order component
const SurahHeader = ({ surahName }) => {
  return (
    <View style={styles.footer}>
      <ImageBackground
        source={require("assets/images/quran/title-frame.png")}
        style={styles.imageContainer}
        resizeMethod="scale"
      >
        <Text
          accessibilityLabel={"surah_header_" + surahName}
          style={fontStyles.bigTextStylePrimaryDark}
        >
          {surahName}
        </Text>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    justifyContent: "center",
    alignSelf: "stretch",
    alignItems: "center"
  },
  imageContainer: {
    width: "100%",
    justifyContent: "center",
    alignSelf: "center",
    alignItems: "center"
  }
});

export default SurahHeader;
