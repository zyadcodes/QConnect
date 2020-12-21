import React from "react";
import {
  View,
  Text,
  Modal,
  TouchableWithoutFeedback,
  StyleSheet
} from "react-native";
import { Icon } from "react-native-elements";
import colors from "config/colors";
import fontStyles from "config/fontStyles";
import { screenHeight, screenWidth } from "config/dimensions";
import { ScrollView } from "react-native-gesture-handler";
import EvaluationNotes from "components/EvaluationNotes";
import EvaluationCalloutFooter from "./EvaluationCalloutFooter";

const EvaluationCalloutModal = props => {
  let {
    visible,
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
              <View style={styles.header}>
                <Text style={fontStyles.bigTextStyleDarkestGrey}>
                  Word Evaluation Notes
                </Text>
                <Icon
                  name="close"
                  onPress={() => props.onClose()}
                  size={20}
                  type="material-community"
                  color={colors.darkGrey}
                />
              </View>
              <EvaluationNotes
                improvementAreas={improvementAreas}
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
              <EvaluationCalloutFooter onClose={onClose} onClear={onClear} />
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
    marginTop: screenHeight * 0.2,
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
  header: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "space-between"
  }
});

export default EvaluationCalloutModal;
