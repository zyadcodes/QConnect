import React, {Component} from 'react'
import {View} from 'react-native'
import { screenScale } from '../../config/dimensions'
import { Badge } from 'react-native-elements'

export default withBadge = () => WrappedComponent => 
    class extends Component{
        render(){
            return (
                <View>
                    {this.props.hidden 
                        ? null
                        : <Badge 
                            containerStyle={{
                                alignSelf: 'flex-end',
                                position: 'relative',
                                top: screenScale*2.75,
                                left: screenScale
                            }}
                            badgeStyle={{
                                width: screenScale*4, 
                                borderRadius: screenScale*2, 
                                height: screenScale*4
                            }}
                            status="error"
                        />
                    }
                    <WrappedComponent {...this.props}/>
                </View>
            )
        }
    }