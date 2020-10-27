import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import PropTypes from "prop-types";
import React, { PureComponent } from "react";
import fontStyles from "config/fontStyles";

class SuggestionListItem extends PureComponent {
  onPress = () => {
    const { name, id, ename, onPressItem } = this.props;
    onPressItem(id, name, ename);
  };

  render() {
    const { name, ename, id } = this.props;
    return (
      <TouchableOpacity
        style={styles.card}
        accessibilityLabel={"surahs_toc_item_" + ename}
        onPress={this.onPress}
      >
        <View style={styles.listItemContainer}>
          <Text
            style={[fontStyles.mainTextStylePrimaryDark, styles.centerText]}
          >
            {name}
          </Text>
          <Text
            key={ename}
            style={[fontStyles.smallTextStyleDarkGrey, styles.centerText]}
          >
            {ename}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}
SuggestionListItem.propTypes = {
  textStyle: PropTypes.shape({}),
  enameStyle: PropTypes.shape({}),
  name: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  ename: PropTypes.string.isRequired,
  onPressItem: PropTypes.func.isRequired
};
SuggestionListItem.defaultProps = {
  textStyle: {},
  enameStyle: {}
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    flex: 1,
    alignItems: "center",
    height: 40,
    margin: 5
  },
  card: {
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "black",
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 0.1 },
    shadowRadius: 1,
    elevation: 1,
    flex: 1,
    height: 50,
    margin: 5,
    borderRadius: 2,
    backgroundColor: "white"
  },
  listItemContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  centerText: { textAlign: "center", textAlignVertical: "center" }
});

/**
 *
 */
export default SuggestionListItem;
