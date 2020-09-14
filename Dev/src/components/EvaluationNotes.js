import styled from "styled-components";
import React, { useState, useEffect } from "react";
import { View, TextInput, Text, StyleSheet, ScrollView, Image } from "react-native";
import FlowLayout from "components/FlowLayout";
import strings from "config/strings";
import colors from "config/colors";
import { screenWidth, screenHeight } from "config/dimensions";
import fontStyles from "config/fontStyles";
import kudosBadges from "../../config/kudosBadges";
import ImageSelectionRow from "components/ImageSelectionRow";
import ImageSelectionModal from "components/ImageSelectionModal";
import BadgesSelection from "components/BadgesSelection";
const notesHeightCollapsed = 40;
const notesHeightExpanded = screenHeight * 0.1;

class EvaluationNotes extends React.Component {

  state = {
    notes: this.props.notes === undefined ? "" : this.props.notes,
    notesHeight: notesHeightCollapsed,
  };

  render() {
    return (
      <View>
        {(!this.props.readOnly ||
          (this.props.notes !== undefined && this.props.notes.length > 0)) && (
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
        



        {(!this.props.readOnly ||
          (this.props.improvementAreas !== undefined &&
            this.props.improvementAreas.length > 0)) && (
            <View>
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
            
          )}
          {/*Yusuf Start*/}
          <Text style={fontStyles.smallTextStyleDarkGrey}>Badges: </Text>
          <View style={{ height: 130, marginTop: 20 }}>
            
        <ScrollView
        scrollEventThrottle={16}
        
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        >
        <BadgesSelection badge={require('assets/images/badges/plate-1.png')} name = "Great Tasme'e!" />
          <BadgesSelection badge={require('assets/images/badges/badge-1.png')} name = "Great Job!" />
          <BadgesSelection badge={require('assets/images/badges/crown.png')} name = "Mashallah!" />
          <BadgesSelection badge={require('assets/images/badges/medal-1.png')} name = "Stellar Tajweed!" />
          <BadgesSelection badge={require('assets/images/badges/medal-2.png')} name = "Great Progress!" />
          <BadgesSelection badge={require('assets/images/badges/medal-4.png')} name = "Great Job!"/>
          <BadgesSelection badge={require('assets/images/badges/star-trophie.png')} name = "Great Job!" />
          <BadgesSelection badge={require('assets/images/badges/trophie-1.png')} name = "Great Job!" />
          <BadgesSelection badge={require('assets/images/badges/trophie-2.png')} name = "Great Job!" />
          <BadgesSelection badge={require('assets/images/badges/trophie-3.png')} name = "Great Job!" />
          <BadgesSelection badge={require('assets/images/badges/trophie-wings.png')} name = "Great Job!" />
              <BadgesSelection badge={require('assets/images/badges/Untitled-4.png')} name = "Great Job!" />
        </ScrollView>

        </View>
        {/*Yusuf End*/}
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