import React, { Component } from "react";
import PropTypes from "prop-types";
import { View } from "react-nativew";
import MushafScreen from "./MushafScreen";

class MushafAssignmentScreen extends Component {
    
  render() {
    return (
      <View style={{ width: screenWidth, height: screenHeight }} key={idx} >
          <MushafScreen/>
      </View>
    );
  }
}
