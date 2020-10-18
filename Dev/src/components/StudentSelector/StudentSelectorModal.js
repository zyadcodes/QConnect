import React, { Component } from "react";
import { View, StyleSheet, Modal, Text } from "react-native";
import PropTypes from "prop-types";
import TouchableText from "components/TouchableText";
import colors from "config/colors";
import fontStyles from "config/fontStyles";
import { screenHeight, screenWidth } from "config/dimensions";
import StudentSelectorComponent from "./StudentSelectorComponent";

//-------------------------------------------------------------
// A Modal dialog that renders passed in data over ImageSelectionGrid
// + a cancel button. It also styles the Modal to center it, wrap content,
//  and adds shadow and other styling.
//---------------------------------------------------------------
export default class StudentSelectorModal extends Component {
  render() {
    let cancelStyle = {
      ...fontStyles.smallTextStyleDarkGrey,
      alignSelf: "center",
      marginTop: screenHeight * 0.015,
      marginBottom: screenHeight * 0.03
    };
    return (
      <Modal
        animationType="fade"
        transparent={true}
        presentationStyle="overFullScreen"
        visible={this.props.visible}
        onRequestClose={() => {}}
      >
        <View style={{ paddingBottom: screenHeight * 0.015 }}>
          <View style={styles.container}>
            <Text
              style={{
                ...fontStyles.mainTextStyleDarkGrey,
                paddingLeft: screenWidth * 0.02,
                paddingTop: screenHeight * 0.01,
              }}
            >
              Assign to:
            </Text>
            <StudentSelectorComponent
              currentClass={this.props.currentClass}
              selectedItemID={this.props.selectedItemID}
              onSelect={(id, imageID, isClassID) => {
                this.props.onSelect(id, imageID, isClassID);
                this.props.setModalVisible(false);
              }}
            />
            <TouchableText
              text="Cancel"
              style={cancelStyle}
              onPress={() => {
                this.props.setModalVisible(false);
              }}
            />
          </View>
        </View>
      </Modal>
    );
  }
}

StudentSelectorModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  setModalVisible: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  selectedItemID: PropTypes.string,
  currentClass: PropTypes.object.isRequired
};

//Styles for the Teacher profile class
const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    width: screenWidth * 0.8,
    marginTop: screenHeight * 0.1,
    borderWidth: 1,
    borderRadius: 2,
    borderColor: colors.grey,
    borderBottomWidth: 1,
    shadowColor: colors.darkGrey,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 3,
    elevation: 2,
    marginLeft: 2,
    marginRight: 5,
    paddingRight: 5,
    paddingLeft: 1
  },
});
