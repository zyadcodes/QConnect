import styled from "styled-components";
import React, { useState, useEffect } from "react";
import { View, TextInput, Text, StyleSheet } from "react-native";
import FlowLayout from "components/FlowLayout";
import strings from "config/strings";
import colors from "config/colors";
import { screenWidth, screenHeight } from "config/dimensions";
import fontStyles from "config/fontStyles";

const notesHeightCollapsed = 40;
const notesHeightExpanded = screenHeight * 0.1;

class EvaluationNotes extends React.Component {
  state = {
    notes: this.props.notes === undefined ? "" : this.props.notes,
    notesHeight: notesHeightCollapsed
  };
  render() {
    return (
      <View>
        {(!this.props.readOnly || (this.props.notes !== undefined && this.props.notes.length > 0)) && (
          <TextInput
            style={styles.notesStyle}
            multiline={true}
            height={this.state.notesHeight}
            onChangeText={teacherNotes =>
              this.setState({ notes: teacherNotes })
            }
            returnKeyType={"done"}
            autoCorrect={false}
            blurOnSubmit={true}
            placeholder={strings.WriteANote}
            placeholderColor={colors.black}
            editable={!this.props.readOnly}
            value={this.state.notes}
            onFocus={() => this.setState({ notesHeight: notesHeightExpanded })}
            onEndEditing={() => {
              this.setState({ notesHeight: notesHeightCollapsed });
              this.props.saveNotes(this.state.notes);
            }}
          />
        )}

        {/**
        The Things to work on button.
    */}

        <View
          style={{
            marginTop: 10,
            flexDirection: "row",
            justifyContent: "flex-start"
          }}
        >
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
        <View style={{ height: 30 }} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  notesStyle: {
    backgroundColor: colors.lightGrey,
    alignSelf: "stretch",
    marginTop: 30,
    marginBottom: screenHeight * 0.007,
    marginLeft: screenWidth * 0.012,
    marginRight: screenWidth * 0.012,
    textAlignVertical: "top"
  }
});

export default EvaluationNotes;
