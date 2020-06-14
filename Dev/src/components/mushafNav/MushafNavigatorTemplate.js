import React, { Component } from 'react';
import colors from 'config/colors';
import { View, FlatList, Text } from 'react-native';
import QcActionButton from "components/QcActionButton";
import PropTypes from 'prop-types';
import surahNames from 'config/surahNames';
import { screenHeight, screenWidth } from 'config/dimensions';

function Item({ title }) {

    const {boxHeight} = screenHeight/10;

    const {boxWidth} = screenWidth/4;

    return (
        <View
        style = {{
            paddingVertical: screenHeight * 0.015,
            paddingHorizontal: (screenWidth/5)/8,
        }}>
      <View 
      style = {{
          alignItems: "center",
          justifyContent: "center",
          width: this.boxWidth,
          height: this.boxHeight,
          paddingHorizontal: 20,
          borderColor: colors.green,
          borderRadius: 6,
          borderWidth: screenWidth*0.007,
      }}>
        {/**
        <QcActionButton
        text = {title}
        onPress = {() => this.props.advance()}
        />
         */}
         <Text>
             {title}
         </Text>
      </View>
      </View>
    );
  }

  
class MushafNavigatorTemplate extends Component {
    advance() {
        this.props.onButtonPress()
    }

    render() {

            return (
                <View
                    style={{
                        alignItems: "center",
                    }}>

                        <Text
                        style = {{
                            fontSize : screenHeight/20
                        }}    
                        >
                            Change Assignment
                        </Text>
                    <FlatList
                        numColumns = {3}
                        data={surahNames}
                        keyExtractor={(item ) => item.id}
                        renderItem={({ item}) => <Item title={item.name} />}
                    />
                </View>
            );
    }
}

// MushafNavigatorTemplate.propTypes = {
//     show: PropTypes.bool.isRequired,
//     onButtonPress: PropTypes.func.isRequired,
//     pageData: PropTypes.name.isRequired
// };


export default MushafNavigatorTemplate;