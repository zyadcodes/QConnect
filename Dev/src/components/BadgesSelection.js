import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import fontStyles from "config/fontStyles";
class BadgesSelection extends Component {
    render() {
        return (


<TouchableOpacity>
            <View style={{ height: 100, width: 100, marginLeft: 20, borderWidth: 0.5, borderColor: '#dddddd', borderRadius: 10 }}>
                <View style={{ flex: 2, paddingTop: 10 }}>
                    <Image source={this.props.badge}
                        style={{ flex: 1, width: null, height: null, resizeMode: 'contain', }}
                    />

                </View>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={fontStyles.smallTextStyleDarkGrey}>{this.props.name}</Text>
                </View>
            </View>
            </TouchableOpacity>
        );
    }
}
export default BadgesSelection;
const styles = StyleSheet.create({

})