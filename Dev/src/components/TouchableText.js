import React from 'react'
import { StyleSheet, TouchableHighlight, Text } from 'react-native'
import colors from 'config/colors'
import PropTypes from 'prop-types'

//--------------------------------------------------------------------------
// A "link" style button. TouchableHighlight over a text with some styling
//--------------------------------------------------------------------------
export default TouchableText = (props) => {
    return (
        <TouchableHighlight
            onPress={props.onPress}>
            <Text style={[styles.container, props.style]}>{props.text}</Text>
        </TouchableHighlight>
    );
}

const styles = StyleSheet.create({
    container: {
        color: colors.primaryDark,
        marginBottom: 10,
        paddingTop: 7,
        paddingBottom: 7,
        fontSize: 11,
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        fontFamily: 'regular',
    }
});

TouchableText.propTypes = {
    text: PropTypes.string.isRequired,
    onPress: PropTypes.func.isRequired,
    style: PropTypes.object,
}