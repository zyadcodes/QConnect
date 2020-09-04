import React from "react";
import { Text, StyleSheet } from "react-native";
import colors from "config/colors";
import { screenHeight } from "config/dimensions";

const defaultFontSize = 17;
//Creates the higher order component
const Basmalah = ({ number, id, fontSizeScale }) => {
  let fontSize = defaultFontSize;
  if (fontSizeScale !== undefined) {
    fontSize = defaultFontSize / fontSizeScale;
  }
  return (
    <Text numberOfLines={1} style={[styles.ayahText, { fontSize: fontSize }]}>
      بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
    </Text>
  );
};

const styles = StyleSheet.create({
  ayahText: {
    height: screenHeight * 0.05,
    textAlign: "center",
    fontFamily: "me_quran",
    color: colors.darkishGrey
  }
});

export default Basmalah;
