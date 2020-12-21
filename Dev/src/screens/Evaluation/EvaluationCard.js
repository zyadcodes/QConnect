import React from "react";
import {
  KeyboardAvoidingView,
  ScrollView,
  View,
  Text,
  StyleSheet
} from "react-native";
import EvaluationAudioPlayer from "./EvaluationAudioPlayer";
import EvaluationRating from "./EvaluationRating";
import fontStyles from "config/fontStyles";
import EvaluationNotes from "../../components/EvaluationNotes";
import EvaluationCardFooter from "./EvaluationCardFooter";
import { screenWidth } from "config/dimensions";

/**
 *
 * @param {style, audioFile, profileImageID, studentName, audioSentDateTime, title, rating, readOnly,
 * improvementAreas, onImprovementAreasSelectionChanged, onImprovementsCustomized, onSaveNotes, notes,
 * selectedImprovementAreas, userID, showExpandCollapseFooter, evaluationCollapsed,
 * onFinishRating, onExpandCollapse} props
 */
const EvaluationCard = props => {
  return (
    <KeyboardAvoidingView
      behavior={"padding"}
      style={props.style ? props.style : styles.container}
    >
      <ScrollView>
        {/** =============== Audio Player =========================== */}
        <EvaluationAudioPlayer
          audioFile={props.audioFile}
          profileImageID={props.profileImageID}
          studentName={props.studentName}
          audioSentDateTime={props.audioSentDateTime}
        />

        <View style={styles.section}>
          {/** =============== Title =========================== */}
          <Text style={fontStyles.mainTextStyleDarkGrey}>{props.title}</Text>

          {/** =============== Rating Stars ==================== */}
          <EvaluationRating
            rating={props.rating}
            onFinishRating={props.onFinishRating}
            isDisabled={props.readOnly}
          />

          {/** =============Evaluation Notes ================= */
          props.evaluationCollapsed === false && (
            <View style={styles.evalNotesContainer}>
              <EvaluationNotes
                improvementAreas={props.improvementAreas}
                readOnly={props.readOnly}
                onImprovementAreasSelectionChanged={
                  props.onImprovementAreasSelectionChanged
                }
                onImprovementsCustomized={props.onImprovementsCustomized}
                saveNotes={evalNotes => props.onSaveNotes(evalNotes)}
                notes={props.notes}
                selectedImprovementAreas={props.selectedImprovementAreas}
                userID={props.userID}
              />
            </View>
          )}

          {/** ========= Footer with Expand/Collapse button === */
          props.showExpandCollapseFooter && (
            <EvaluationCardFooter
              onExpandCollapse={props.onExpandCollapse}
              evaluationCollapsed={props.evaluationCollapsed}
            />
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center"
  },
  evalNotesContainer: {
    flexDirection: "row",
    flex: 1
  },
  section: {
    alignItems: "center",
    padding: 5,
    width: screenWidth * 0.99
  }
});
export default EvaluationCard;
