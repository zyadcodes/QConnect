import React, { Component } from 'react'
import { View, StyleSheet, Modal } from 'react-native'
import PropTypes from 'prop-types'
import ImageSelectionGrid from 'components/ImageSelectionGrid'
import TouchableText from 'components/TouchableText'
import colors from 'config/colors'
import fontStyles from 'config/fontStyles';
import { screenHeight, screenWidth } from 'config/dimensions';

//-------------------------------------------------------------
// A Modal dialog that renders passed in data over ImageSelectionGrid
// + a cancel button. It also styles the Modal to center it, wrap content,
//  and adds shadow and other styling.
//---------------------------------------------------------------
export default class ImageSelectionModal extends Component {

    onImageSelected(index) {
        this.props.onImageSelected(index);
    }

    render() {

        cancelStyle = {...fontStyles.smallTextStyleDarkGrey, marginTop: screenHeight * 0.015, marginBottom: screenHeight * 0.03 }
        return (
            <Modal
                animationType="fade"
                transparent={true}
                presentationStyle="overFullScreen"
                visible={this.props.visible}
                onRequestClose={() => {
                }}>

                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingBottom: 20 }}>
                    <View style={styles.container}>
                        <ImageSelectionGrid
                            images={this.props.images}
                            onImageSelected={this.props.onImageSelected}
                        />
                        <TouchableText
                            text={this.props.cancelText}
                            style={cancelStyle}
                            onPress={() => {
                                this.props.setModalVisible(false);
                            }} />
                    </View>
                </View>
            </Modal>
        );
    }
}

ImageSelectionModal.propTypes = {
    visible: PropTypes.bool.isRequired,
    images: PropTypes.array.isRequired,
    cancelText: PropTypes.string.isRequired,
    setModalVisible: PropTypes.func.isRequired,
    onImageSelected: PropTypes.func.isRequired,
}

//Styles for the Teacher profile class
const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.white,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        marginTop: 0.044 * screenHeight,
        borderWidth: 1,
        borderRadius: 2,
        borderColor: colors.grey,
        borderBottomWidth: 1,
        shadowColor: colors.darkGrey,
        shadowOffset: { width: 0, height: 0.002 * screenHeight },
        shadowOpacity: 0.8,
        shadowRadius: 3,
        elevation: 0.003 * screenHeight,
        marginHorizontal: screenWidth * 0.012,
        paddingHorizontal: 0.036 * screenWidth
    },
})