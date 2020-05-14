import React, {Component} from 'react'
import { View, TouchableOpacity, StyleSheet, FlatList, Image} from 'react-native'
import { Icon } from 'react-native-elements'
import colors from '../../config/colors'
import { screenWidth, screenHeight, screenScale, fontScale } from '../../config/dimensions'
import teacherImages from '../../config/teacherImages'
import studentImages from 'config/studentImages';

export default class ThreadComponent extends Component{
    state = {
        threadAction: 'Extend',
        isExtended: false,
        arrowDirection: 'md-arrow-dropright'
    }
    
    render(){
        return (
            <View>
                <TouchableOpacity onPress={() => this.setState({isExtended: true})} style={this.localStyles.threadActionBtn}>
                    <Text>{this.state.threadAction} Thread</Text>
                    <Icon type="ionicon" name={this.state.arrowDirection}/>
                </TouchableOpacity> 
                {this.state.isExtended ? 
                    <View>
                        <FlatList data={this.props.Comments} renderItem={({index, item, separators}) => (
                            <View style={this.localStyles.commentContainer}>
                                <Image style={this.localStyles.userImage} source={item.user.isTeacher ? teacherImages[item.user.imageID] : studentImages[item.user.imageID]}/>
                                <View style={this.localStyles.userNameAndComment}>    
                                    <Text>{item.user.Name}</Text>
                                    <Text>fewfjewifjewiofjewiofjewfweffjewiojfowe</Text>
                                </View>
                            </View>
                        )}/>
                    </View>
                    : 
                    null
                }
            </View>
        )
    }
    localStyles = StyleSheet.create({
        threadActionBtn: {
            flexDirection: 'row',
            backgroundColor: colors.primaryLight,
            width: screenWidth/8,
            justifyContent: 'space-around',
            paddingLeft: screenWidth/150,
            paddingRight: screenWidth/150,
        },
        userImage: {
            width: screenScale * 18,
            height: screenScale * 18,
            marginLeft: screenWidth / 45,
            resizeMode: 'contain'
        },
        userNameAndComment: {
            alignContent: 'space-around',
            marginLeft: screenWidth/45
        },
        commentContainer: {
            width: screenWidth/2,
            flexDirection: 'row'
        }
    })
}
