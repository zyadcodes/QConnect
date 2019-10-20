import React from 'react'
import { ListItem } from 'react-native-elements'
import PropTypes from 'prop-types';
import colors from "config/colors";
import { StyleSheet, Dimensions } from "react-native";
import FontLoadingComponent from './FontLoadingComponent';
import { screenHeight, screenWidth } from 'config/dimensions';

// a card that displays one menu item in the left navigation menu (hamburger menu)
// params: 
class QcDrawerItem extends FontLoadingComponent {
  render() {
    const { title, image, icon, onPress, backColor, borderColor } = this.props;
    let containerBg = backColor ? backColor : colors.white;
    let containerBordr = borderColor ? borderColor : containerBg;

    return (
      <ListItem
        style = {{
          borderColor: containerBordr
        }}
        backgroundColor={containerBg}
        containerStyle={[styles.cardStyle, { backgroundColor: containerBg }]}
        title={title}
        fontFamily='regular'
        leftAvatar={image ? {
          rounded: true,
          source: image
        } : {
            rounded: true,
            icon: {
              name: icon,
              type: 'font-awesome',
              color: colors.primaryDark,
            },
            overlayContainerStyle: styles.avatarStyle
          }}

        onPress={() => onPress()}
      />
    )
  }
}

QcDrawerItem.propTypes = {
  title: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  image: PropTypes.number,
  icon: PropTypes.string,
  backColor: PropTypes.string,
  borderColor: PropTypes.string,
}

//Styles that control the look of the card, and everything within it
const styles = StyleSheet.create({
  cardStyle: {
    marginTop: screenHeight * 0.00558,
    marginBottom: screenHeight * 0.00558,
    width: screenWidth * 0.67,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGrey,
  },
  avatarStyle: {
    backgroundColor: colors.primaryLight,
  }
});

export default QcDrawerItem;