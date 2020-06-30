import React from 'react'
import { ListItem } from 'react-native-elements'
import PropTypes from 'prop-types';
import colors from "config/colors";
import { StyleSheet } from "react-native";
import { screenHeight, screenWidth } from 'config/dimensions';
import styles from './QcDrawerItemStyle'

// a card that displays one menu item in the left navigation menu (hamburger menu)
// params: 
const QcDrawerItem = (props) => {
    const { title, image, icon, onPress, backColor, borderColor } = props;
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

QcDrawerItem.propTypes = {
  title: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  image: PropTypes.number,
  icon: PropTypes.string,
  backColor: PropTypes.string,
  borderColor: PropTypes.string,
}

export default QcDrawerItem;