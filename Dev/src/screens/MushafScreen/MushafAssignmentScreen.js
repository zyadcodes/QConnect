import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import MushafScreen from './MushafScreen';
import { screenHeight, screenWidth } from 'config/dimensions';

class MushafAssignmentScreen extends Component {
  render() {
    return (
      <View style={{ width: screenWidth, height: screenHeight }}>
        <MushafScreen {...this.props} />
      </View>
    );
  }
}

export default MushafAssignmentScreen;