import React from 'react';
import { StyleSheet, View } from 'react-native';
import {
  compareOrder,
  isAyahSelected,
  toNumberString
} from "../Helpers/AyahsOrder";
import AyahSelectionWord from './AyahSelectionWord';
import EndOfAyah from './EndOfAyah';
import { screenHeight } from 'config/dimensions';
import LoadingSpinner from "components/LoadingSpinner";

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
  showLoadingOnHighlightedAyah
}) => {
  let isFirstWord = noSelectionInPreviousLines;
  return (
    <View style={{ ...styles.line, alignItems: lineAlign }}>
      {lineText &&
        lineText.map(word => {
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
            compareOrder(highlightedAyahs, curAyah) === 0;

          if (selectionOn === false) {
            if (word.char_type === 'word') {
              return (
                <AyahSelectionWord
                  key={word.id}
                  text={word.text}
                  highlighted={highlighted}
                  highlightedColor={highlightedColor}
                  selected={false}
                  onPress={() => onSelectAyah(curAyah, word)}
                  isFirstSelectedWord={false}
                />
              );
            } else if (word.char_type === 'end') {
              return (
                <EndOfAyah
                  key={word.id}
                  ayahNumber={word.aya}
                  onPress={() => onSelectAyah(curAyah, word)}
                  selected={false}
                  highlighted={highlighted}
                  highlightedColor={highlightedColor}
                  showLoading={showLoading}
                  isLastSelectedAyah={false}
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
            if (word.char_type === 'word') {
              let isFirstSelectedWord = isAyaSelected && isFirstWord;
              if (isFirstSelectedWord) {
                isFirstWord = false;
              }
              return (
                <AyahSelectionWord
                  key={word.id}
                  text={word.text}
                  // the margins and border radius are different between the cases
                  //  of when a word is selected separately or the entire ayah is selected
                  // together. That's why we are passing these as different props
                  // to know which styling to apply
                  isWordHighlighted={isCurWordHighlighted}
                  isAyahHighlighted={isCurAyahHighlighted}
                  highlightedColor={highlightedColor}
                  selected={isAyaSelected}
                  onPress={() => onSelectAyah(curAyah, word)}
                  isFirstSelectedWord={isFirstSelectedWord}
                />
              );
            } else if (word.char_type === 'end') {
              return (
                <EndOfAyah
                  key={word.id}
                  ayahNumber={word.aya}
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
    flexDirection: 'row-reverse',
    backgroundColor: 'transparent',
    justifyContent: 'space-between'
  },
  footer: {
    justifyContent: 'center',
    alignSelf: 'stretch',
    height: screenHeight * 0.25,
    alignItems: 'center'
  },
  imageContainer: {
    width: '100%',
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center'
  }
});

export default TextLine;
