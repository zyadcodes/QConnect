import React, {Component} from 'react'
import {
    View,
    TouchableOpacity,
    Text,
    Image,
    StyleSheet,
    Dimensions
} from 'react-native'
import {screenHeight, screenWidth, screenScale, fontScale} from '../../config/dimensions'
import PropTypes from 'prop-types'
import colors from '../../config/colors'

export default class FeedsObject extends Component{
    static propTypes = {
        type: PropTypes.string.isRequired,
        Content: PropTypes.object.isRequired,
        userID: PropTypes.string.isRequired,
        reactions: PropTypes.array.isRequired,
        imageRequire: PropTypes.object.isRequired,
    }
    componentDidMount(){
        console.log(screenHeight)
    }
    render(){
        return (
            <View style={this.localStyles.containerView}>
                <Image source={this.props.imageRequire} style={this.localStyles.userImage}/>
                <View style={this.localStyles.contentContainerView}>
                    {this.props.type === 'assignment' ? 
                        null:
                        <Text style={this.localStyles.contentText}>{this.props.Content}</Text>
                    }
                </View>
            </View>
        )
    }
    localStyles = StyleSheet.create({
        containerView: {
            width: (this.props.type == 'assignment' ? 2.4*screenWidth/3 : 2*screenWidth/3),
            height: (this.props.type == 'assignment' ? 
                    screenHeight/5 : screenHeight/7),
            flexDirection: 'row',
            marginTop: (this.props.number == 0 ? screenHeight/40 : 0),
            marginBottom: screenHeight/40
        },
        contentText: {
            color: colors.lightBrown,
            fontWeight: 'bold',
            fontSize: fontScale*15
        },
        userImage: {
            width: screenScale*18,
            height: screenScale*18,
            marginLeft: screenWidth/50,
            resizeMode: 'contain',
            flex: 1,
        },
        contentContainerView: {
            borderWidth: 2,
            marginTop: screenScale*18,
            flex: 5,
            alignItems: 'center',
            justifyContent: 'center',
            borderColor: colors.lightBrown,
            backgroundColor: colors.white,
        }
    })
}
