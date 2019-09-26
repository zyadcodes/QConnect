import React from 'react'
import { StyleSheet, TouchableHighlight, Text } from 'react-native'
import colors from 'config/colors'
import PropTypes from 'prop-types'
import fontStyles from 'config/fontStyles';

//--------------------------------------------------------------------------
// A "link" style button. TouchableHighlight over a text with some styling
//--------------------------------------------------------------------------
export default TouchableText = (props) => {
    return (
        <TouchableHighlight
            onPress={props.onPress}>
            <Text style={[fontStyles.smallTextStylePrimaryDark, props.style]}>{props.text}</Text>
        </TouchableHighlight>
    );
}

TouchableText.propTypes = {
    text: PropTypes.string.isRequired,
    onPress: PropTypes.func.isRequired,
    style: PropTypes.object,
}