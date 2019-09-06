import React, { Component } from 'react'
import { View, StyleSheet, Modal } from 'react-native'
import PropTypes from 'prop-types'
import ImageSelectionGrid from 'components/ImageSelectionGrid'
import TouchableText from 'components/TouchableText'
import colors from 'config/colors'

//-------------------------------------------------------------
// A Modal dialog that renders passed in data over ImageSelectionGrid
// + a cancel button. It also styles the Modal to center it, wrap content,
//  and adds shadow and other styling.
//---------------------------------------------------------------
export default class ImageSelectionModal extends Component {

    //log event and dispatch image selection event to screen
    onImageSelected(index) {

        this.props.onImageSelected(index);
    }

    render() {

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
                            style={{ fontSize: 14, marginTop: 10, marginBottom: 20 }}
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
    screen: PropTypes.string.isRequired,
}

//Styles for the Teacher profile class
const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.white,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        marginTop: 30,
        borderWidth: 1,
        borderRadius: 2,
        borderColor: colors.grey,
        borderBottomWidth: 1,
        shadowColor: colors.darkGrey,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 3,
        elevation: 2,
        marginLeft: 5,
        marginRight: 5,
        paddingRight: 15,
        paddingLeft: 15
    },
})