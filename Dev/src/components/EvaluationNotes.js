import React from "react";
import { View, TextInput, Text, StyleSheet } from "react-native";
import FlowLayout from "components/FlowLayout";
import strings from "config/strings";
import colors from "config/colors";
import fontStyles from "config/fontStyles";

class EvaluationNotes extends React.Component {
  state = {
    notes: this.props.notes === undefined ? "" : this.props.notes
  };
  render() {
    return (
      <View style={styles.container}>
        {(!this.props.readOnly ||
          (this.props.notes !== undefined && this.props.notes.length > 0)) && (
          <View style={styles.notesContainer}>
            <Text style={fontStyles.smallTextStyleDarkGrey}>Notes:</Text>
            <TextInput
              style={styles.notesStyle}
              multiline={true}
              accessibilityLabel="eval_note"
              onChangeText={teacherNotes => {
                this.setState({ notes: teacherNotes });
                this.props.saveNotes(teacherNotes);
              }}
              returnKeyType={"done"}
              autoCorrect={false}
              blurOnSubmit={true}
              placeholder={strings.WriteANote}
              placeholderColor={colors.black}
              editable={!this.props.readOnly}
              value={this.state.notes}
              onEndEditing={() => {
                this.props.saveNotes(this.state.notes);
              }}
            />
          </View>
        )}

        {(!this.props.readOnly ||
          (this.props.improvementAreas !== undefined &&
            this.props.improvementAreas.length > 0)) && (
          <View>
            <View style={styles.improvementsContainer}>
              <Text style={fontStyles.smallTextStyleDarkGrey}>
                {strings.ImprovementAreas}
              </Text>
            </View>
            <FlowLayout
              ref="flow"
              dataValue={this.props.improvementAreas}
              selectedValues={this.props.selectedImprovementAreas}
              title={strings.ImprovementAreas}
              readOnly={this.props.readOnly}
              selectedByDefault={this.props.readOnly ? true : false}
              onSelectionChanged={this.props.onImprovementAreasSelectionChanged}
              onImprovementsCustomized={this.props.onImprovementsCustomized}
            />
            <View style={styles.spacer} />
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  notesContainer: {
    marginTop: 30
  },
  notesStyle: {
    backgroundColor: colors.lightGrey,
    alignSelf: "stretch",
    textAlignVertical: "top",
    padding: 5
  },
  improvementsContainer: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "flex-start"
  },
  spacer: { height: 30 }
});

export default EvaluationNotes;
