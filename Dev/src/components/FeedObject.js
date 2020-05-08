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
import {getPageTextWbW} from '../screens/MushafScreen/ServiceActions/getQuranContent'
import SurahHeader from '../screens/MushafScreen/Components/SurahHeader'
import Basmalah from '../screens/MushafScreen/Components/Basmalah'
import TextLine from '../screens/MushafScreen/Components/TextLine'
import LoadingSpinner from './LoadingSpinner'

export default class FeedsObject extends Component{
    static propTypes = {
        type: PropTypes.string.isRequired,
        Content: PropTypes.object.isRequired,
        userID: PropTypes.string.isRequired,
        reactions: PropTypes.array.isRequired,
        imageRequire: PropTypes.object.isRequired,
    }
    state = {
        surahName: '',
        page: [],
        isLoading: false,
    }
    async componentDidMount(){
        console.log(screenHeight)
        if(this.props.type === 'assignment'){
            this.setState({isLoading: true})
            const pageLines = await getPageTextWbW(this.props.Content.start.page);
            let allAyat = (
                    <View>
                        {pageLines !== undefined &&
                        pageLines.map((line, index) => {
                            if (line.type === 'besmellah') {
                                return <Basmalah key={line.line + "_basmalah"} />;
                            } else if(line.type !== 'start_sura') {
                            return (
                                <TextLine
                                key={this.props.Content.start.page + '_' + line.line}
                                lineText={line.text}
                                selectionOn={false}
                                highlightedWord={undefined}
                                selectedAyahsEnd={this.props.Content.end}
                                selectedAyahsStart={this.props.Content.start}
                                selectionStarted={false}
                                selectionCompleted={false}
                                isFirstWord={false}
                                onSelectAyah={(ayah, word) => {}}
                                page={this.props.Content.start.page}
                                lineAlign={(this.props.Content.start.page === 1 ? 'center' : 'stretch')}
                                />
                            );
                            }
                        })}
                    </View>
            )
            this.setState({surahName: pageLines[0].surah, page: allAyat, isLoading: false})
        }
    }
    render(){
        return (
            <View style={this.localStyles.containerView}>
                <Image source={this.props.imageRequire} style={this.localStyles.userImage}/>
                <View style={{flex: 5, marginTop: screenScale*18}}>
                    {this.props.type === 'assignment' ? 
                        <Text style={[this.localStyles.newAssignmentText, {fontSize: fontScale*18}]}>New Assignment: </Text>
                        :
                        null
                    }
                    <View style={this.localStyles.contentContainerView}>
                        {this.props.type === 'assignment' ? 
                                <View>
                                    <Text style={[this.localStyles.newAssignmentText, {marginLeft: screenWidth/86}]}>{this.props.Content.assignmentType} from ayah {this.props.Content.start.ayah} to ayah {this.props.Content.end.ayah}</Text>
                                    <TouchableOpacity disabled={this.props.isTeacher} style={this.localStyles.assignmentContainer}>
                                        {this.state.isLoading ?
                                            <View style={this.localStyles.spinnerContainerStyle}>
                                                <LoadingSpinner/>
                                            </View>
                                            :   
                                            <View style={{flex: 1}}> 
                                                <SurahHeader surahName={this.state.surahName}/>
                                                {this.state.page}
                                            </View>
                                        }
                                    </TouchableOpacity>
                                    <Text style={[this.localStyles.newAssignmentText, {alignSelf: 'flex-end', marginRight: screenWidth/86}]}>Click To Open</Text>
                                </View>
                            :
                            <Text style={this.localStyles.contentText}>{this.props.Content}</Text>
                        }
                    </View>
                </View>
            </View>
        )
    }
    localStyles = StyleSheet.create({
        containerView: {
            width: (this.props.type == 'assignment' ? 2.4*screenWidth/3 : 2*screenWidth/3),
            height: (this.props.type == 'assignment' ? 
                    screenHeight/3 : screenHeight/7),
            flexDirection: 'row',
            marginTop: (this.props.number == 0 ? screenHeight/40 : 0),
            marginBottom: screenHeight/40
        },
        assignmentContainer: {
            alignSelf: 'center',
            flex: 3,
            overflow: 'hidden',
            borderColor: colors.lightBrown,
            borderWidth: 2,
            marginTop: screenHeight/163.2,
            width: screenWidth/1.6
        },
        spinnerContainerStyle: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center'
        },
        contentText: {
            color: colors.lightBrown,
            fontWeight: 'bold',
            fontSize: fontScale*15
        },
        userImage: {
            width: screenScale*18,
            height: screenScale*18,
            marginLeft: screenWidth/25,
            resizeMode: 'contain',
        },
        newAssignmentText: {
            fontSize: fontScale*16,
            color: colors.lightBrown,
            fontWeight: 'bold'
        },
        newAssignmentTextContainer: {
            flexDirection: 'row'
        },
        contentContainerView: {
            borderWidth: 2,
            marginTop: (this.props.type === 'assignment' ? screenHeight/50 : 0),
            flex: 5,
            paddingBottom: (this.props.type === 'assignment' ? screenHeight/163.5 : 0),
            alignItems: 'center',
            justifyContent: 'center',
            borderColor: colors.lightBrown,
            backgroundColor: colors.white,
        }
    })
}
