import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import fontStyles from 'config/fontStyles';
import styles from './SuggestionListItemStyle'

const SuggestionListItem = (props) => {
  const onPress = () => {
    const { name, id, ename, onPressItem } = props;
    onPressItem(id, name, ename);
  };

    const { name, ename, textStyle, enameStyle } = props;
    return (
      <TouchableOpacity style={styles.card} onPress={onPress}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Text
            style={[
              fontStyles.mainTextStylePrimaryDark,
              { textAlign: 'center', textAlignVertical: 'center' },
            ]}
          >
            {name}
          </Text>
          <Text
            key={ename}
            style={[
              fontStyles.smallTextStyleDarkGrey,
              { textAlign: 'center', textAlignVertical: 'center' },
            ]}
          >
            {ename}
          </Text>
        </View>
      </TouchableOpacity>
    );
}
SuggestionListItem.propTypes = {
  textStyle: PropTypes.shape({}),
  enameStyle: PropTypes.shape({}),
  name: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  ename: PropTypes.string.isRequired,
  onPressItem: PropTypes.func.isRequired,
};
SuggestionListItem.defaultProps = {
  textStyle: {},
  enameStyle: {},
};

/**
 *
 */
export default React.memo(SuggestionListItem);
