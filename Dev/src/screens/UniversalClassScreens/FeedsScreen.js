import React from 'react'
import {View, ScrollView, TouchableOpacity, StyleSheet, Image} from 'react-native'
import FirebaseFunctions from '../../../config/FirebaseFunctions'
import colors from '../../../config/colors'
import strings from '../../../config/strings'
import QCView from 'components/QCView';
import SideMenu from 'react-native-side-menu';
import StudentLeftNavPane from '../StudentScreens/LeftNavPane';
import TeacherLeftNavPane from '../TeacherScreens/LeftNavPane';
import LoadingSpinner from '../../components/LoadingSpinner'
import TopBanner from 'components/TopBanner';

export default class FeedsScreen extends React.Component { 
    state = {
        currentClass: {},
        isOpen: false,
        classes: [],
        isLoading: true,
        userID: '',
        LeftNavPane: {},
        isTeacher: false,
        currentClassID: '',
        teacher: null,
        student: null
    }
    async componentDidMount() {
        FirebaseFunctions.setCurrentScreen(
          'Class Feed Screen',
          'ClassFeedScreen'
        );
    
        const { userID } = this.props.navigation.state.params;
        const teacher = await FirebaseFunctions.getTeacherByID(userID);
        let currentClassID;
        let LeftNavPane;
        let classes;
        if(teacher == -1){
            const student = await FirebaseFunctions.getStudentByID(userID);
            currentClassID = student.currentClassID;
            LeftNavPane = StudentLeftNavPane;
            classes = await FirebaseFunctions.getClassesByIDs(student.classes);
            this.setState({student, isTeacher: false})
        }else{
            currentClassID = teacher.currentClassID;
            LeftNavPane = TeacherLeftNavPane;
            classes = teacher.classes;
            await FirebaseFunctions.getClassesByIDs(teacher.classes);
            this.setState({teacher, isTeacher: true})
        }
        const currentClass = await FirebaseFunctions.getClassByID(currentClassID);
        const { classInviteCode } = currentClass;
        this.setState({
            isLoading: false,
            currentClass,
            currentClassID,
            classInviteCode,
            LeftNavPane,
            userID,
            classes,
          });
    }
    render(){
        const {LeftNavPane} = this.state;
        if(this.state.isLoading){
            return (
            <View style={localStyles.spinnerContainerStyle}>
                <LoadingSpinner/>
            </View>)
        }
        return (
            <SideMenu
                isOpen={this.state.isOpen}
                menu={
                <LeftNavPane
                    teacher={this.state.teacher} 
                    student={this.state.student}
                    userID={this.state.userID}
                    classes={this.state.classes}
                    edgeHitWidth={0}
                    navigation={this.props.navigation}
                />}>
                <QCView>
                    <TopBanner
                        LeftIconName="navicon"
                        LeftOnPress={() => this.setState({ isOpen: true })}
                        Title={this.state.currentClass.name+' Feed'}/>  
                    <ScrollView style={localStyles.scrollViewStyle}>

                    </ScrollView>
                </QCView>
            </SideMenu>
        )
    }
}
const localStyles = StyleSheet.create({
    scrollViewStyle: {
      backgroundColor: colors.lightGrey 
    },
    spinnerContainerStyle: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
})