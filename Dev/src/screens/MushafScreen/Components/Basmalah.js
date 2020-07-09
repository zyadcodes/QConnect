import React from "react";
import { Text, StyleSheet } from "react-native";
import colors from "config/colors";
import { screenHeight } from "config/dimensions";

//Creates the higher order component
const Basmalah = ({ number, id }) => {
  return (
    <Text numberOfLines={1} style={styles.ayahText}>
      بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
    </Text>
  );
};

const styles = StyleSheet.create({
  ayahText: {
    height: screenHeight * 0.05,
    textAlign: "center",
    fontFamily: "me_quran",
    fontSize: 17,
    color: colors.darkishGrey
  }
});

export default Basmalah;
