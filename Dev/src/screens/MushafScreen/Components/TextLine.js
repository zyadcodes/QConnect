import React from "react";
import { StyleSheet, View } from "react-native";
import {
  compareOrder,
  isAyahSelected,
  toNumberString
} from "../Helpers/AyahsOrder";
import AyahSelectionWord from "./AyahSelectionWord";
import EndOfAyah from "./EndOfAyah";
import { screenHeight, screenWidth } from "config/dimensions";

//Creates the higher order component
const TextLine = ({
  page,
  lineText,
  selectedAyahsEnd,
  selectedAyahsStart,
  selectionStarted,
  selectionCompleted,
  noSelectionInPreviousLines,
  onSelectAyah,
  lineAlign,
  selectionOn,
  highlightedWords,
  highlightedAyahs,
  highlightedColor,
  showLoadingOnHighlightedAyah,
  showTooltipOnPress,
  evalNotesComponent,
  removeHighlight,
  mushafFontScale,
  readOnly
}) => {
  let isFirstWord = noSelectionInPreviousLines;
  return (
    <View
      style={{
        ...styles.line,
        alignItems: lineAlign,
        flexWrap: mushafFontScale > 1 ? "wrap" : "nowrap",
      }}
    >
      {lineText &&
        lineText.map((word, index) => {
          let curAyah = {
            ayah: Number(word.aya),
            surah: Number(word.sura),
            page: page,
            wordNum: Number(word.id)
          };

          let isCurAyahHighlighted =
            highlightedAyahs !== undefined &&
            Object.keys(highlightedAyahs).includes(toNumberString(curAyah));

          let isCurWordHighlighted =
            highlightedWords !== undefined &&
            Object.keys(highlightedWords).includes(word.id);

          let highlighted = isCurWordHighlighted || isCurAyahHighlighted;

          let showLoading =
            showLoadingOnHighlightedAyah === true &&
            highlightedAyahs !== undefined &&
            Object.keys(highlightedAyahs).includes(toNumberString(curAyah));

          let showTooltip = false;
          if (
            showTooltipOnPress === "true" ||
            (showTooltipOnPress === "whenHighlighted" &&
              (isCurWordHighlighted === true || isCurAyahHighlighted === true))
          ) {
            showTooltip = true;
          }

          if (selectionOn === false) {
            if (word.char_type !== "end" && word.char_type !== "pause") {
              if (
                word.char_type === "word" &&
                lineText[index + 1] !== undefined &&
                lineText[index + 1].char_type === "pause"
              ) {
                word.text = word.text + lineText[index + 1].text;
              }

              return (
                <AyahSelectionWord
                  key={word.id}
                  word={word}
                  showTooltipOnPress={showTooltip}
                  isWordHighlighted={isCurWordHighlighted}
                  isAyahHighlighted={isCurAyahHighlighted}
                  highlighted={highlighted}
                  highlightedColor={highlightedColor}
                  selected={false}
                  readOnly={readOnly}
                  curAyah={curAyah}
                  onPress={() => onSelectAyah(curAyah, word)}
                  isFirstSelectedWord={false}
                  evalNotesComponent={evalNotesComponent}
                  removeHighlight={removeHighlight}
                />
              );
            } else if (word.char_type === "end") {
              return (
                <EndOfAyah
                  key={word.id}
                  word={word}
                  curAyah={curAyah}
                  showTooltipOnPress={showTooltip}
                  readOnly={readOnly}
                  onPress={() => onSelectAyah(curAyah, word)}
                  selected={false}
                  highlighted={highlighted}
                  highlightedColor={highlightedColor}
                  showLoading={showLoading}
                  isLastSelectedAyah={false}
                  evalNotesComponent={evalNotesComponent}
                  removeHighlight={removeHighlight}
                />
              );
            }
          } else {
            let isAyaSelected = isAyahSelected(
              curAyah,
              selectionStarted,
              selectionCompleted,
              selectedAyahsStart,
              selectedAyahsEnd
            );
            let isLastSelectedAyah =
              isAyaSelected && compareOrder(selectedAyahsEnd, curAyah) === 0;
            if (word.char_type !== "end" && word.char_type !== "pause") {
              if (
                word.char_type === "word" &&
                lineText[index + 1] !== undefined &&
                lineText[index + 1].char_type === "pause"
              ) {
                word.text = word.text + lineText[index + 1].text;
              }

              let isFirstSelectedWord = isAyaSelected && isFirstWord;
              if (isFirstSelectedWord) {
                isFirstWord = false;
              }

              return (
                <AyahSelectionWord
                  key={word.id}
                  word={word}
                  showTooltipOnPress={showTooltip}
                  // the margins and border radius are different between the cases
                  //  of when a word is selected separately or the entire ayah is selected
                  // together. That's why we are passing these as different props
                  // to know which styling to apply
                  isWordHighlighted={isCurWordHighlighted}
                  isAyahHighlighted={isCurAyahHighlighted}
                  readOnly={readOnly}
                  highlightedColor={highlightedColor}
                  highlighted={highlighted}
                  selected={isAyaSelected}
                  curAyah={curAyah}
                  onPress={() => onSelectAyah(curAyah, word)}
                  isFirstSelectedWord={isFirstSelectedWord}
                  evalNotesComponent={evalNotesComponent}
                  removeHighlight={removeHighlight}
                />
              );
            } else if (word.char_type === "end") {
              let showTooltip = false;
              if (
                showTooltipOnPress === "true" ||
                (showTooltipOnPress === "whenHighlighted" &&
                  isCurAyahHighlighted === true)
              ) {
                showTooltip = true;
              }

              return (
                <EndOfAyah
                  key={word.id}
                  word={word}
                  curAyah={curAyah}
                  showTooltipOnPress={showTooltip}
                  readOnly={readOnly}
                  onPress={() => onSelectAyah(curAyah, word)}
                  highlighted={highlighted}
                  showLoading={showLoading}
                  highlightedColor={highlightedColor}
                  selected={isAyahSelected(
                    curAyah,
                    selectionStarted,
                    selectionCompleted,
                    selectedAyahsStart,
                    selectedAyahsEnd
                  )}
                  isLastSelectedAyah={isLastSelectedAyah}
                  evalNotesComponent={evalNotesComponent}
                  removeHighlight={removeHighlight}
                />
              );
            }
          }
        })}
    </View>
  );
};

const styles = StyleSheet.create({
  line: {
    flexDirection: "row-reverse",
    backgroundColor: "transparent",
    justifyContent: "space-between",
    width: screenWidth * 0.98
  },
  footer: {
    justifyContent: "center",
    alignSelf: "stretch",
    height: screenHeight * 0.25,
    alignItems: "center",
  },
  imageContainer: {
    width: "100%",
    justifyContent: "center",
    alignSelf: "center",
    alignItems: "center",
  }
});

export default TextLine;
