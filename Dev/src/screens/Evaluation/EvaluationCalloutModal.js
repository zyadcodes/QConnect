import React from "react";
import {
  View,
  Text,
  Modal,
  ScrollView,
  TouchableWithoutFeedback,
  StyleSheet
} from "react-native";
import { Icon } from "react-native-elements";
import EvaluationNotes from "components/EvaluationNotes";
import EvaluationCalloutFooter from "./EvaluationCalloutFooter";
import surahs from "../MushafScreen/Data/Surahs";
import strings from "config/strings";
import colors from "config/colors";
import fontStyles from "config/fontStyles";
import { screenHeight, screenWidth } from "config/dimensions";

const rightBracket = "  \uFD3F";
const leftBracket = "\uFD3E";

const getCalloutTitle = (word, ayah) => {
  if (word && word.char_type === "word") {
    return word.text;
  } else if (ayah && ayah.surah) {
    return (
      surahs[ayah.surah].tname + "    " + leftBracket + ayah.ayah + rightBracket
    );
  } else {
    //this should never happen, just a catch all in case we run into an element with no ayah specified
    return "highlighted recitation section";
  }
};

const EvaluationCalloutModal = props => {
  let {
    visible,
    word,
    ayah,
    wordOrAyahImprovements,
    improvementAreas,
    wordOrAyahNotes,
    readOnly,
    userID,
    onClose,
    onClear,
    onImprovementAreasSelectionChanged,
    onImprovementsCustomized,
    saveNotes
  } = props;

  return (
    <Modal
      animationType="fade"
      transparent={true}
      presentationStyle="overFullScreen"
      visible={visible}
      onRequestClose={() => {}}
    >
      <TouchableWithoutFeedback onPress={() => onClose()}>
        <View style={styles.container}>
          <View style={styles.modal}>
            <ScrollView>
              {/********************** Title Header  ***********************/}
              <View style={styles.headerRow}>
                <Text style={fontStyles.bigTextStyleDarkestGrey}>
                  {strings.EvaluationCalloutHeaderTitle}
                </Text>
                <Icon
                  name="close"
                  onPress={() => props.onClose()}
                  size={20}
                  type="material-community"
                  color={colors.darkGrey}
                />
              </View>
              <View style={styles.titleContainer}>
                <Text style={styles.titleText}>
                  {getCalloutTitle(word, ayah)}
                </Text>
              </View>

              {/******** Evaluation Notes (notes and tags)  ************/}
              <EvaluationNotes
                noTopMargin={true}
                improvementAreas={
                  readOnly ? wordOrAyahImprovements : improvementAreas
                }
                notes={wordOrAyahNotes}
                selectedImprovementAreas={wordOrAyahImprovements}
                readOnly={readOnly}
                userID={userID}
                onImprovementAreasSelectionChanged={selectedImprovementAreas =>
                  onImprovementAreasSelectionChanged(selectedImprovementAreas)
                }
                onImprovementsCustomized={onImprovementsCustomized}
                saveNotes={saveNotes}
              />
              {/************* Save / Clear buttons ****************** */
              //only show the save/clear action button if we are not in readOnly view mode
              !readOnly && (
                <EvaluationCalloutFooter
                  onClose={onClose}
                  onClear={() => onClear(word, ayah)}
                />
              )}
            </ScrollView>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  modal: {
    width: screenWidth * 0.8,
    marginTop: screenHeight * 0.1,
    padding: 10,
    backgroundColor: colors.white,
    borderRadius: 5,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: screenHeight * 0.0029 },
    shadowOpacity: 0.3,
    shadowRadius: screenHeight * 0.004,
    elevation: screenHeight * 0.003,
    justifyContent: "center",
    alignSelf: "center"
  },
  headerRow: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "space-between"
  },
  titleText: {
    textAlign: "right",
    fontFamily: "me_quran",
    fontSize: 26,
    color: colors.darkGrey
  },
  titleContainer: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "center"
  }
});

export default EvaluationCalloutModal;
