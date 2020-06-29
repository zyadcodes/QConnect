import React, { Component } from 'react'
import { ScrollView, FlatList, Image, StyleSheet, TouchableHighlight, View } from 'react-native'
import PropTypes from 'prop-types';
import { screenWidth, screenHeight } from 'config/dimensions';
import styles from './ImageSelectionGridStyle'

//--------------------------------------------------------------
// Renders a set of passed-in images in a 3 columns table 
// and calls back passed in function when one of the images is selected
// the images are displaed in circular avatar format
//-------------------------------------------------
export default ImageSelectionGrid = (props) => {
        const { onImageSelected, images } = props;

        return (
            <ScrollView >
                <View>
                    <FlatList
                        numColumns={4}
                        data={images}
                        keyExtractor={(item, index) => index} // fix, should be item.id (add id to classes)
                        renderItem={({ item, index }) => (
                            <TouchableHighlight onPress={() => onImageSelected(index)}>
                                <Image
                                    key={index}
                                    borderRadius={0.044 * screenHeight}
                                    source={item}
                                    style={styles.imageStyle}
                                    resizeMode="contain"
                                />
                            </TouchableHighlight>
                        )} >
                    </FlatList>
                </View>
            </ScrollView>
        );
}
ImageSelectionGrid.propTypes = {
    images: PropTypes.array.isRequired,
    onImageSelected: PropTypes.func.isRequired,
}

