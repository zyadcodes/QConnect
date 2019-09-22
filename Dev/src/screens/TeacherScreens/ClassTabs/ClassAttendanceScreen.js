import React from 'react';
import { ScrollView, StyleSheet, View, Image, Text, Dimensions, Alert } from 'react-native';
import Toast, { DURATION } from 'react-native-easy-toast'
import DatePicker from 'react-native-datepicker';
import StudentCard from 'components/StudentCard';
import QcActionButton from 'components/QcActionButton';
import colors from 'config/colors';
import studentImages from 'config/studentImages'
import strings from 'config/strings';
import QcParentScreen from 'screens/QcParentScreen';
import FirebaseFunctions from 'config/FirebaseFunctions';
import LoadingSpinner from 'components/LoadingSpinner';
import LeftNavPane from '../LeftNavPane';
import TopBanner from 'components/TopBanner';
import SideMenu from 'react-native-side-menu';
import QCView from 'components/QCView';
import screenStyle from 'config/screenStyle';
import fontStyles from '../../../../config/fontStyles';

export class ClassAttendanceScreen extends QcParentScreen {

    state = {
        isLoading: true,
        currentClass: '',
        currentClassID: '',
        students: '',
        userID: '',
        teacher: '',
        absentStudents: [],
        selectedDate: new Date().toLocaleDateString("en-US"),
        classes: '',
        isOpen: false
    }

    //Sets the screen name for firebase analytics and gets the initial students
    async componentDidMount() {

        FirebaseFunctions.setCurrentScreen("Class Attendance Screen", "ClassAttendanceScreen");

        const { userID } = this.props.navigation.state.params;
        const teacher = await FirebaseFunctions.getTeacherByID(userID);
        const classes = await FirebaseFunctions.getClassesByIDs(teacher.classes);
        const { currentClassID } = teacher;
        const currentClass = await FirebaseFunctions.getClassByID(currentClassID);
        const { students } = currentClass;
        const { selectedDate } = this.state;
        const absentStudents = await FirebaseFunctions.getAbsentStudentsByDate(selectedDate, currentClassID);

        this.setState({
            isLoading: false,
            currentClass,
            currentClassID,
            students,
            absentStudents,
            userID,
            teacher,
            classes
        });

    }

    //This method will set the student selected property to the opposite of whatever it was
    //by either removing the student or adding them to the array of selected students
    //based on if they are already in the array or not
    onStudentSelected(id) {
        let tmp = this.state.absentStudents;

        if (tmp.includes(id)) {
            tmp.splice(tmp.indexOf(id), 1);
        } else {
            tmp.push(id);
        }

        this.setState({
            absentStudents: tmp,
            selectedDate: this.state.selectedDate
        });

    }

    //fetches the current selected students and the current selected date and adds the current
    //attendance to the database
    async saveAttendance() {

        let { absentStudents, selectedDate, currentClassID } = this.state;
        await FirebaseFunctions.saveAttendanceForClass(absentStudents, selectedDate, currentClassID);
        this.refs.toast.show(strings.AttendanceFor + selectedDate + strings.HasBeenSaved, DURATION.LENGTH_SHORT);

    }

    render() {

        if (this.state.isLoading === true) {
            return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <LoadingSpinner isVisible={true} />
                </View>
            )
        }

        //If the class doesn't currently have students
        if (this.state.currentClass.students.length === 0) {
            return (
                <SideMenu isOpen={this.state.isOpen} menu={<LeftNavPane
                    teacher={this.state.teacher}
                    userID={this.state.userID}
                    classes={this.state.classes}
                    edgeHitWidth={0}
                    navigation={this.props.navigation} />}>
                    <QCView style={screenStyle.container}>
                        <View style={{ flex: 1, width: Dimensions.get('window').width }}>
                            <TopBanner
                                LeftIconName="navicon"
                                LeftOnPress={() => this.setState({ isOpen: true })}
                                Title={this.state.currentClass.name}
                                RightIconName="edit"
                                RightOnPress={() => this.props.navigation.push('ClassEdit', {
                                    classID: this.state.currentClassID,
                                    currentClass: this.state.currentClass,
                                    userID: this.state.userID
                                })}
                            />
                        </View>
                        <View style={{ flex: 2, justifyContent: 'flex-start', alignItems: 'center', alignSelf: 'center' }}>
                            <Image
                                source={require('assets/emptyStateIdeas/ghostGif.gif')}
                                style={{
                                    width: 300,
                                    height: 150,
                                    resizeMode: 'contain',
                                }}
                            />

                            <Text style={fontStyles.hugeTextStylePrimaryDark}>{strings.EmptyClass} </Text>

                        <QcActionButton
                            text={strings.AddStudentButton}
                            onPress={() => this.props.navigation.push("ClassEdit", {
                                classID: this.state.currentClassID,
                                currentClass: this.state.currentClass,
                                userID: this.state.userID
                            })} />
                        </View>
                    </QCView>
                </SideMenu >
            )
        }

        return (
            //The scroll view will have at the top a date picker which will be defaulted to the current
            //date and it will allow the user to view previous day's attendance along with setting
            //and changing them. The max possible date will be the current date.
            <SideMenu isOpen={this.state.isOpen} menu={<LeftNavPane
                teacher={this.state.teacher}
                userID={this.state.userID}
                classes={this.state.classes}
                edgeHitWidth={0}
                navigation={this.props.navigation} />}>
                <QCView style={screenStyle.container}>
                    <ScrollView>
                        <View style={{ flex: 1, width: Dimensions.get('window').width }}>
                            <TopBanner
                                LeftIconName="navicon"
                                LeftOnPress={() => this.setState({ isOpen: true })}
                                Title={this.state.currentClass.name}
                                RightIconName="edit"
                                RightOnPress={() => this.props.navigation.push('ClassEdit', {
                                    classID: this.state.currentClassID,
                                    currentClass: this.state.currentClass,
                                    userID: this.state.userID
                                })}
                            />
                        </View>
                        <View style={styles.saveAttendance}>
                            <DatePicker
                                date={this.state.selectedDate}
                                confirmBtnText={strings.Confirm}
                                cancelBtnText={strings.Cancel}
                                format="MM/DD/YY"
                                duration={300}
                                style={{ paddingLeft: 15 }}
                                maxDate={new Date().toLocaleDateString("en-US")}
                                customStyles={{ dateInput: { borderColor: colors.lightGrey } }}
                                onDateChange={async (date) => {
                                    this.setState({
                                        selectedDate: date,
                                        isLoading: true
                                    });
                                    const absentStudents = await FirebaseFunctions.getAbsentStudentsByDate(date, this.state.currentClassID);
                                    this.setState({
                                        isLoading: false,
                                        absentStudents
                                    });
                                }}
                            />
                            <QcActionButton
                                text={strings.SaveAttendance}
                                onPress={() => this.saveAttendance()}
                                style={{ paddingRight: 30 }}
                                screen={this.name}
                            />
                        </View>
                        {this.state.students.map((student) => {
                            let color = this.state.absentStudents.includes(student.ID) ? colors.red : colors.green;
                            return (
                                <StudentCard
                                    key={student.ID}
                                    studentName={student.name}
                                    profilePic={studentImages.images[student.profileImageID]}
                                    currentAssignment={student.currentAssignment}
                                    background={color}
                                    onPress={() => this.onStudentSelected(student.ID)}
                                />
                            );
                        })}
                        <Toast position={'center'} ref="toast" />
                    </ScrollView>
                </QCView>
            </SideMenu >
        );
    }
}

//Styles for the entire container along with the top banner
const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        backgroundColor: colors.lightGrey,
        flex: 1
    },
    saveAttendance: {
        flexDirection: 'row',
        paddingTop: 20,
        paddingBottom: 20,
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.lightGrey,
        flex: 1
    }
});

export default ClassAttendanceScreen;