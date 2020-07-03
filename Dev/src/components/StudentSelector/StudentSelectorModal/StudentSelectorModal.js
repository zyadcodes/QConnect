import React, { Component } from 'react'
import { View, StyleSheet, Modal, Text } from 'react-native'
import PropTypes from 'prop-types'
import TouchableText from 'components/TouchableText/TouchableText'
import colors from '../config/colors'
import fontStyles from '../config/fontStyles';
import { screenHeight, screenWidth } from '../config/dimensions';
import StudentSelectorComponent from '../StudentSelectorComponent/StudentSelectorComponent';
import styles from './StudentSelectorModalStyle'

//-------------------------------------------------------------
// A Modal dialog that renders passed in data over ImageSelectionGrid
// + a cancel button. It also styles the Modal to center it, wrap content,
//  and adds shadow and other styling.
//---------------------------------------------------------------
export default StudentSelectorModal = (props) => {

        let cancelStyle = {...fontStyles.smallTextStyleDarkGrey,
            alignSelf: 'center', 
            marginTop: screenHeight * 0.015, 
            marginBottom: screenHeight * 0.03 }
        return (
            <Modal
                animationType="fade"
                transparent={true}
                presentationStyle="overFullScreen"
                visible={props.visible}
                onRequestClose={() => {
                }}>

                <View style={{ paddingBottom: screenHeight * 0.015 }}>
                    <View style={styles.container}>
                        <Text style={{...fontStyles.mainTextStyleDarkGrey, paddingLeft: screenWidth * 0.02, paddingTop: screenHeight * 0.01}}>Assign to:</Text>
                        <StudentSelectorComponent
                            currentClass={props.currentClass}
                            selectedItemID={props.selectedItemID}
                            onSelect={(id, imageID, isClassID) => {
                                props.onSelect(id, imageID, isClassID);
                                props.setModalVisible(false);
                            }}
                        />
                        <TouchableText
                            text="Cancel"
                            style={cancelStyle}
                            onPress={() => {
                                props.setModalVisible(false);
                            }} />
                    </View>
                </View>
            </Modal>
        );
}

StudentSelectorModal.propTypes = {
    visible: PropTypes.bool.isRequired,
    setModalVisible: PropTypes.func.isRequired,
    onSelect: PropTypes.func.isRequired,
    selectedItemID: PropTypes.string,
    currentClass: PropTypes.object.isRequired
}
