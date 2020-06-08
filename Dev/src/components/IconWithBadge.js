import React, {Component} from 'react'
import {View} from 'react-native'
import { screenScale } from '../../config/dimensions'
import { Badge } from 'react-native-elements'
import colors from '../../config/colors'
import FeedHandler from './FeedComponents/FeedHandler'

export default withBadge = () => WrappedComponent =>
    class extends Component{
        state = {
            hidden: this.props.hidden
        }
        componentDidMount(){
            this.props.eventEmitter.addListener('badgeChange', () => {
                this.setState({hidden: FeedHandler.shouldntShowBadge})
            })
        }
        render(){
            return (
                <View style={{flexDirection: 'row', alignSelf: 'center', left: (this.state.hidden ? 0 : screenScale*2.75)}}>
                    <WrappedComponent {...this.props}/>
                    {this.state.hidden 
                        ? null
                        : <Badge 
                            containerStyle={{
                                position: 'relative',
                                bottom: screenScale,
                                right: screenScale*2.75
                            }}
                            badgeStyle={{
                                borderWidth: 2,
                                width: screenScale*4, 
                                borderRadius: screenScale*2,
                                borderColor: colors.white, 
                                height: screenScale*4
                            }}
                            status="error"
                        />
                    }
                </View>
            )
        }
    }