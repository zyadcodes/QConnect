import React, { Component } from 'react'
import { ScrollView, FlatList, Image, StyleSheet, TouchableHighlight, View } from 'react-native'
import PropTypes from 'prop-types'


//--------------------------------------------------------------
// Renders a set of passed-in images in a 3 columns table 
// and calls back passed in function when one of the images is selected
// the images are displaed in circular avatar format
//-------------------------------------------------
export default class ImageSelectionGrid extends Component {
    render() {
        const { onImageSelected, images } = this.props;

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
                                    borderRadius={30}
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
}
ImageSelectionGrid.propTypes = {
    images: PropTypes.array.isRequired,
    onImageSelected: PropTypes.func.isRequired,
}

const styles = StyleSheet.create({
    imageStyle: {
        height: 60,
        width: 60,
        marginLeft: 15,
        marginTop: 15,
        padding: 15,
        borderRadius: 30,
    },
}
);