//This component will be the default loading spinner that should be user throughout the entire app
import React, { Component } from 'react';
import { View, ActivityIndicator } from 'react-native';
import colors from 'config/colors';
import PropTypes from 'prop-types';
import { screenHeight } from 'config/dimensions'

//The class that will render the spinner
const LoadingSpinner = (props) => {
        return (
            <View style={{ marginTop: screenHeight * 0.03 }}>
                <ActivityIndicator
                    size="large"
                    color={colors.primaryDark}
                    animating={props.isVisible} />
            </View>
        );
}

//Making sure that the correct prop type (boolean) is passed in
LoadingSpinner.propTypes = {
    isVisible: PropTypes.bool.isRequired
}

export default LoadingSpinner;