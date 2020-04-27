import React from 'react';
import { StyleSheet, View } from 'react-native';
import { compareOrder, isAyahSelected } from '../Helpers/AyahsOrder';
import AyahSelectionWord from './AyahSelectionWord';
import EndOfAyah from './EndOfAyah';
import { screenHeight } from 'config/dimensions';

//Creates the higher order component
const TextLine = ({
  page,
  lineText,
  selectedAyahsEnd,
  selectedAyahsStart,
  selectionStarted,
  selectionCompleted,
  isFirstWord,
  onSelectAyah,
  lineAlign,
  selectionOn,
  highlightedAyah
}) => {
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
          let highlighted =
            highlightedAyah !== undefined &&
            compareOrder(curAyah, highlightedAyah) === 0;
          if (selectionOn === false) {
            if (word.char_type === 'word') {
              return (
                <AyahSelectionWord
                  key={word.id}
                  text={word.text}
                  highlighted={highlighted}
                  selected={false}
                  onPress={() => onSelectAyah(curAyah)}
                  isFirstSelectedWord={false}
                />
              );
            } else if (word.char_type === 'end') {
              return (
                <EndOfAyah
                  key={word.id}
                  ayahNumber={word.aya}
                  onPress={() => onSelectAyah(curAyah)}
                  selected={false}
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
                  highlighted={highlighted}
                  selected={isAyaSelected}
                  onPress={() => onSelectAyah(curAyah)}
                  isFirstSelectedWord={isFirstSelectedWord}
                />
              );
            } else if (word.char_type === 'end') {
              return (
                <EndOfAyah
                  key={word.id}
                  ayahNumber={word.aya}
                  onPress={() => onSelectAyah(curAyah)}
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
