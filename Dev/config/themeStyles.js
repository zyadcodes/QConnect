import colors from "./colors";
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  toastStyle: {
    backgroundColor: colors.darkGreen,
    borderRadius: 5,
    padding: 10
  },
  notesStyle: {
    backgroundColor: colors.lightGrey,
    alignSelf: "stretch",
    textAlignVertical: "top",
    padding: 5,
    minHeight: 40
  }
});
