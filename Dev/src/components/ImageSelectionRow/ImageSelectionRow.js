import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';
import TouchableAvatar from 'components/TouchableAvatar/TouchableAvatar';
import colors from 'config/colors';
import PropTypes from 'prop-types';
import { screenHeight, screenWidth } from 'config/dimensions';
import styles from './ImageSelectionRowStyle'

//---------------------------------------------------------
// Renders set of passed in images in a single row, and adds 
//  an "expand more" ellipsis in the end that calls back to passed in function
//  to show more images.
//--------------------------------------------------------------
export default ImageSelectionRow = (props) => {

    //log event and dispatch image selection event to screen
    const onRowImageSelected = (index) => {
        props.onImageSelected(index);
    }

        const { highlightedImagesIndices, onShowMore, selectedImageIndex, images } = props;

        return (
            <View style={styles.rowContainer}>
                {highlightedImagesIndices.map((index) => {
                    return (
                        <View
                            key={index}>
                            <TouchableAvatar
                                index={index}
                                image={images[index]}
                                selected={selectedImageIndex === index}
                                onPress={() => onRowImageSelected(index)} />
                        </View>
                    )
                })}
                <Icon
                    raised
                    name='ellipsis-h'
                    type='font-awesome'
                    color={colors.primaryDark}
                    onPress={() => {
                        onShowMore();
                    }} />
            </View>
        );
}

ImageSelectionRow.propTypes = {
    highlightedImagesIndices: PropTypes.array.isRequired,
    onImageSelected: PropTypes.func.isRequired,
    onShowMore: PropTypes.func.isRequired,
    selectedImageIndex: PropTypes.number.isRequired,
    images: PropTypes.array.isRequired,
    style: PropTypes.object
}
