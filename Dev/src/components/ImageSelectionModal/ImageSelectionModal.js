import React, { Component } from 'react'
import { View, StyleSheet, Modal } from 'react-native'
import PropTypes from 'prop-types'
import ImageSelectionGrid from 'components/ImageSelectionGrid'
import TouchableText from 'components/TouchableText'
import colors from 'config/colors'
import fontStyles from 'config/fontStyles';
import { screenHeight, screenWidth } from 'config/dimensions';
import styles from './ImageSelectionModalStyle'

//-------------------------------------------------------------
// A Modal dialog that renders passed in data over ImageSelectionGrid
// + a cancel button. It also styles the Modal to center it, wrap content,
//  and adds shadow and other styling.
//---------------------------------------------------------------
export default ImageSelectionModal = (props) => {

    const onImageSelected = (index) => {
        props.onImageSelected(index);
    }

    let cancelStyle = {...fontStyles.smallTextStyleDarkGrey, marginTop: screenHeight * 0.015, marginBottom: screenHeight * 0.03 }
        return (
            <Modal
                animationType="fade"
                transparent={true}
                presentationStyle="overFullScreen"
                visible={props.visible}
                onRequestClose={() => {
                }}>

                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingBottom: 20 }}>
                    <View style={styles.container}>
                        <ImageSelectionGrid
                            images={props.images}
                            onImageSelected={(index) => onImageSelected(index)}
                        />
                        <TouchableText
                            text={props.cancelText}
                            style={cancelStyle}
                            onPress={() => {
                                props.setModalVisible(false);
                            }} />
                    </View>
                </View>
            </Modal>
        );
}

ImageSelectionModal.propTypes = {
    visible: PropTypes.bool.isRequired,
    images: PropTypes.array.isRequired,
    cancelText: PropTypes.string.isRequired,
    setModalVisible: PropTypes.func.isRequired,
    onImageSelected: PropTypes.func.isRequired,
}

