import React, { Component } from "react";
import {
  ScrollView,
  FlatList,
  Image,
  StyleSheet,
  TouchableHighlight,
  View,
} from "react-native";
import PropTypes from "prop-types";
import { screenWidth, screenHeight } from "config/dimensions";

//--------------------------------------------------------------
// Renders a set of passed-in images in a 3 columns table
// and calls back passed in function when one of the images is selected
// the images are displaed in circular avatar format
//-------------------------------------------------
export default class ImageSelectionGrid extends Component {
  render() {
    const { onImageSelected, images } = this.props;

    return (
      <ScrollView>
        <View>
          <FlatList
            numColumns={4}
            data={images}
            keyExtractor={(item, index) => index} // fix, should be item.id (add id to classes)
            renderItem={({ item, index }) => (
              <TouchableHighlight
                accessibilityLabel={"avatar_grid_item_" + index}
                onPress={() => onImageSelected(index)}
              >
                <Image
                  key={index}
                  borderRadius={0.044 * screenHeight}
                  source={item}
                  style={styles.imageStyle}
                  resizeMode="contain"
                />
              </TouchableHighlight>
            )}
          />
        </View>
      </ScrollView>
    );
  }
}
ImageSelectionGrid.propTypes = {
  images: PropTypes.array.isRequired,
  onImageSelected: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  imageStyle: {
    height: 0.088 * screenHeight,
    width: 0.088 * screenHeight,
    marginLeft: screenWidth * 0.036,
    marginTop: 0.022 * screenHeight,
    paddingHorizontal: 0.022 * screenWidth,
    paddingVertical: screenHeight * 0.022,
    borderRadius: 0.044 * screenHeight,
  },
});
