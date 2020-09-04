import React from "react";
import { Text, StyleSheet } from "react-native";
import colors from "config/colors";
import { screenHeight } from "config/dimensions";

const defaultFontSize = 17;
//Creates the higher order component
const Basmalah = ({ number, id }) => {
  return (
    <Text numberOfLines={1} style={[styles.ayahText]}>
      بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
    </Text>
  );
};

const styles = StyleSheet.create({
  ayahText: {
    textAlign: "center",
    fontFamily: "me_quran",
    color: colors.darkishGrey,
    fontSize: defaultFontSize
  }
});

export default Basmalah;
