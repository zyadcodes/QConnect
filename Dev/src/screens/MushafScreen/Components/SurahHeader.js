import React from "react";
import { Text, StyleSheet, View, ImageBackground } from "react-native";
import fontStyles from "config/fontStyles";
import { screenHeight } from "config/dimensions";

//Creates the higher order component
const SurahHeader = ({ surahName, fontSizeScale }) => {
  let fontSize = fontStyles.bodyFontBigger;
  if (fontSizeScale !== undefined) {
    fontSize = defaultFontSize / fontSizeScale;
  }

  return (
    <View style={styles.footer}>
      <ImageBackground
        source={require("assets/images/quran/title-frame.png")}
        style={styles.imageContainer}
        resizeMethod="scale"
      >
        <Text style={fontStyles.bigTextStylePrimaryDark}>{surahName}</Text>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    justifyContent: "center",
    alignSelf: "stretch",
    height: screenHeight * 0.025,
    alignItems: "center",
  },
  imageContainer: {
    width: "100%",
    justifyContent: "center",
    alignSelf: "center",
    alignItems: "center",
  }
});

export default SurahHeader;
