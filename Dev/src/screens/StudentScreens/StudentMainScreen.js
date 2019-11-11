//This screen will be the main screen that will display for students as a landing page for when they first
//sign up or log in
import React from 'react';
import QcParentScreen from "../QcParentScreen";
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, ScrollView, Modal, Alert, Picker } from 'react-native';
import studentImages from 'config/studentImages';
import { Rating } from 'react-native-elements';
import colors from 'config/colors'
import strings from 'config/strings';
import TopBanner from 'components/TopBanner'
import FirebaseFunctions from 'config/FirebaseFunctions';
import QcActionButton from 'components/QcActionButton';
import LeftNavPane from './LeftNavPane';
import SideMenu from 'react-native-side-menu';
import LoadingSpinner from 'components/LoadingSpinner';
import { Input } from 'react-native-elements';
import { TextInput } from 'react-native-gesture-handler';
import QCView from 'components/QCView';
import screenStyle from 'config/screenStyle';
import fontStyles from 'config/fontStyles';
import { CustomPicker } from 'react-native-custom-picker';
import { screenHeight, screenWidth } from 'config/dimensions';

class StudentMainScreen extends QcParentScreen {

    state = {
        isLoading: true,
        student: '',
        userID: '',
        currentClass: '',
        currentClassID: '',
        thisClassInfo: '',
        isReadyEnum: '',
        modalVisible: false,
        classCode: '',
        classes: ''
    }

    //Joins the class by first testing if this class exists. If the class doesn't exist, then it will
    //alert the user that it does not exist. If the class does exist, then it will join the class, and
    //navigate to the current class screen.
    async joinClass() {

        this.setState({ isLoading: true });
        const { userID, classCode, student } = this.state;

        //Tests if the user is already a part of this class and throws an alert if they are
        if (student.classes.includes(classCode)) {
            Alert.alert(strings.Whoops, strings.ClassAlreadyJoined);
            this.setState({ isLoading: false });
        } else {
            const didJoinClass = await FirebaseFunctions.joinClass(student, classCode);
            if (didJoinClass === -1) {
                Alert.alert(strings.Whoops, strings.IncorrectClassCode);
                this.setState({ isLoading: false, modalVisible: false });
            } else {
                //Refetches the student object to reflect the updated database
                this.setState({
                    isLoading: false,
                    modalVisible: false
                })
                this.props.navigation.push("StudentCurrentClass", {
                    userID,
                });
            }
        }
    }

    //Fetches all the values for the state from the firestore database
    async componentDidMount() {

        super.componentDidMount();

        //Sets the screen name in firebase analytics
        FirebaseFunctions.setCurrentScreen("Student Main Screen", "StudentMainScreen");

        const { userID } = this.props.navigation.state.params;
        const student = await FirebaseFunctions.getStudentByID(userID);
        const { currentClassID } = student;
        if (currentClassID === "") {
            this.setState({
                isLoading: false,
                noCurrentClass: true,
                student,
                userID,
                isOpen: false,
                classes: []
            });
        } else {
            const currentClass = await FirebaseFunctions.getClassByID(currentClassID);
            const thisClassInfo = currentClass.students.find((student) => {
                return student.ID === userID;
            });
            const { isReadyEnum } = thisClassInfo;
            const classes = await FirebaseFunctions.getClassesByIDs(student.classes);
            this.setState({
                student,
                userID,
                currentClass,
                currentClassID,
                thisClassInfo,
                isReadyEnum,
                isLoading: false,
                isOpen: false,
                classes
            });
        }
    }

    //Returns the correct caption based on the student's average grade
    getRatingCaption() {
        let caption = strings.GetStarted;
        let { averageGrade } = this.state.thisClassInfo;

        if (averageGrade > 4) {
            caption = strings.OutStanding
        }
        else if (averageGrade >= 3) {
            caption = strings.GreatJob
        }
        else if (averageGrade > 0) {
            caption = strings.PracticePerfect
        }

        return caption
    }

    //Renders the screen
    render() {
        const { userID, isLoading, student, currentClassID, thisClassInfo, isReadyEnum, currentClass } = this.state;
        if (isLoading === true) {
            return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <LoadingSpinner isVisible={true} />
                </View>
            )
        }

        if (this.state.noCurrentClass) {
            return (
                <SideMenu
                    openMenuOffset={screenWidth * 0.7}
                    isOpen={this.state.isOpen} menu={<LeftNavPane
                        student={student}
                        userID={userID}
                        classes={this.state.classes}
                        edgeHitWidth={0}
                        navigation={this.props.navigation} />}>
                    <QCView style={screenStyle.container}>
                        <View style={{ flex: 1 }}>
                            <TopBanner
                                LeftIconName="navicon"
                                LeftOnPress={() => this.setState({ isOpen: true })}
                                Title={"Quran Connect"} />

                        </View>
                        <View style={{ flex: 2, justifyContent: 'flex-start', alignItems: 'center', alignSelf: 'center' }}>
                            <Image
                                source={require('assets/emptyStateIdeas/ghostGif.gif')}
                                style={{
                                    width: screenWidth * 0.73,
                                    height: screenHeight * 0.22,
                                    resizeMode: 'contain',
                                }} />

                            <Text style={[fontStyles.bigTextStyleDarkGrey, { alignSelf: 'center' }]}>
                                {strings.HaventJoinedClassYet}
                            </Text>

                            <QcActionButton
                                text={strings.JoinClass}
                                onPress={() => this.setState({ modalVisible: true })} />
                        </View>
                        <Modal
                            animationType="fade"
                            style={{ alignItems: 'center', justifyContent: 'center' }}
                            transparent={true}
                            presentationStyle="overFullScreen"
                            visible={this.state.modalVisible}
                            onRequestClose={() => {
                            }}>
                            <View style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                                alignSelf: 'center',
                                paddingTop: screenHeight / 3
                            }}>
                                <View style={styles.modal}>
                                    {
                                        this.state.isLoading === true ? (
                                            <View>
                                                <LoadingSpinner isVisible={true} />
                                            </View>
                                        ) : (
                                                <View>
                                                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                                        <Text style={fontStyles.mainTextStyleDarkGrey}>{strings.TypeInAClassCode}</Text>
                                                    </View>
                                                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                                        <TextInput
                                                            style={[{
                                                                height: screenHeight * 0.07,
                                                                paddingLeft: 0.017 * screenWidth,
                                                            }, fontStyles.mainTextStyleDarkGrey]}
                                                            placeholder={strings.TypeInAClassCode}
                                                            autoCorrect={false}
                                                            onChangeText={classCode => this.setState({ classCode })}
                                                            value={this.state.classCode}
                                                        />
                                                    </View>
                                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', flex: 1 }}>
                                                        <QcActionButton
                                                            text={strings.Cancel}
                                                            onPress={() => { this.setState({ modalVisible: false }) }} />
                                                        <QcActionButton
                                                            text={strings.Confirm}
                                                            onPress={() => {
                                                                //Joins the class
                                                                this.joinClass();
                                                            }} />
                                                    </View>
                                                </View>

                                            )
                                    }
                                </View>
                            </View>
                        </Modal>
                    </QCView>
                </SideMenu>
            )
        }

        let assignmentHistory = thisClassInfo.assignmentHistory ? thisClassInfo.assignmentHistory.reverse() : null 
        return (

            <SideMenu
                isOpen={this.state.isOpen} menu={<LeftNavPane
                    student={student}
                    userID={userID}
                    classes={this.state.classes}
                    edgeHitWidth={0}
                    navigation={this.props.navigation} />}>
                <QCView style={screenStyle.container}>
                    <TopBanner
                        LeftIconName="navicon"
                        LeftOnPress={() => this.setState({ isOpen: true })}
                        Title={currentClass.name}
                    />
                    <View style={styles.topView}>
                        <View style={styles.profileInfo}>
                            <View style={styles.profileInfoTop}>
                                <Image
                                    style={styles.profilePic}
                                    source={studentImages.images[student.profileImageID]} />
                                <View style={styles.profileInfoTopRight}>
                                    <Text numberOfLines={1} style={fontStyles.mainTextStyleBlack}>{student.name.toUpperCase()}</Text>
                                    <View style={{ flexDirection: 'row', height: screenHeight * 0.04 }}>
                                        <Rating readonly={true} startingValue={thisClassInfo.averageRating} imageSize={25} />
                                        <View style={{ flexDirection: 'column', justifyContent: 'center' }}>
                                            <Text style={fontStyles.bigTextStyleDarkGrey}>{thisClassInfo.averageRating === 0 ? "" : parseFloat(thisClassInfo.averageRating).toFixed(1)}</Text>
                                        </View>
                                    </View>
                                    <Text style={fontStyles.mainTextStylePrimaryDark}>{this.getRatingCaption()}</Text>
                                </View>
                            </View>
                            <View style={styles.profileInfoBottom}>
                                <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: 'column', height: screenHeight * 0.09 }}>
                                    <View style={{ paddingTop: screenHeight * 0.005, alignSelf: 'center' }}>
                                        <Text numberOfLines={1} style={fontStyles.bigTextStyleDarkGrey}>{thisClassInfo.currentAssignment !== "None"? thisClassInfo.currentAssignment.toUpperCase() : ""}</Text>
                                    </View>
                                    <View style={{ alignSelf: 'flex-start' }}>
                                        <Text style={fontStyles.mainTextStyleDarkGrey}>{strings.TotalAssignments + ": " + thisClassInfo.totalAssignments + "  "}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                    {thisClassInfo.currentAssignment !== "None" ? 
                    <View style={{ backgroundColor: (isReadyEnum === "WORKING_ON_IT" ? colors.workingOnItColorBrown : (isReadyEnum === "READY" ? colors.green : colors.red)) }}>
                        <CustomPicker
                            options={
                                [
                                    {
                                        label: strings.WorkingOnIt,
                                        value: "WORKING_ON_IT",
                                        color: colors.workingOnItColorBrown
                                    },
                                    {
                                        label: strings.Ready,
                                        value: "READY",
                                        color: colors.green
                                    },
                                    {
                                        label: strings.NeedHelp,
                                        value: "NEED_HELP",
                                        color: colors.red
                                    }
                                ]
                            }
                            onValueChange={value => {
                                this.setState({ isReadyEnum: value.value });
                                FirebaseFunctions.updateStudentAssignmentStatus(currentClassID, userID, value.value);
                            }}
                            getLabel={item => item.label}
                            optionTemplate={(settings) => {
                                const { item, getLabel } = settings;
                                return (
                                    <View style={styles.optionContainer}>
                                        <View style={styles.innerContainer}>
                                            <View style={[styles.box, { backgroundColor: item.color }]} />
                                            <Text style={fontStyles.bigTextStyleBlack}>{getLabel(item)}</Text>
                                        </View>
                                    </View>
                                )
                            }}
                            fieldTemplate={(settings) => {
                                return (
                                    <View style={styles.middleView}>
                                        <View style={{ flex: .5, justifyContent: 'center', alignItems: 'center', paddingVertical: screenHeight * 0.0112 }}>
                                            <Text style={fontStyles.mainTextStyleBlack}>{strings.CurrentAssignment}</Text>
                                            <Text style={fontStyles.bigTextStyleBlack}>{thisClassInfo.currentAssignment}</Text>
                                        </View>
                                        <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'row' }}>
                                            <Text style={fontStyles.bigTextStyleBlack}>{"  "}</Text>
                                            <Text style={fontStyles.mainTextStylePrimaryDark}>{isReadyEnum === "READY" ? strings.Ready : (isReadyEnum === "WORKING_ON_IT" ? strings.WorkingOnIt : strings.NeedHelp)}</Text>
                                        </View>
                                    </View>
                                )
                            }}
                        /> 
                    </View>
                    :
                    <View style={{ ...styles.middleView, backgroundColor: colors.primaryLight }}>
                        <View style={{ flex: .5, justifyContent: 'center', alignItems: 'center', paddingVertical: screenHeight * 0.04 }}>
                            <Text style={fontStyles.bigTextStyleBlack}>{strings.NoAssignmentsYet}</Text>
                            <Text style={fontStyles.mainTextStyleBlack}>{strings.YouDontHaveAssignments}</Text>
                            <Text style={fontStyles.bigTextStyleBlack}>{"  "}</Text>
                            <Text style={fontStyles.mainTextStylePrimaryDark}>{strings.EnjoyYourTime}</Text>
                        </View>
                    </View> 
                    }
                    <View style={styles.bottomView}>
                        <ScrollView style={styles.prevAssignments}>
                            <FlatList
                                data={assignmentHistory}
                                keyExtractor={(item, index) => item.name + index}
                                renderItem={({ item, index }) => (
                                    <TouchableOpacity onPress={() => {
                                        //To-Do: Navigates to more specific evaluation for this assignment
                                        this.props.navigation.push("EvaluationPage", {
                                            classID: this.state.currentClassID,
                                            studentID: this.state.userID,
                                            classStudent: thisClassInfo,
                                            assignmentName: item.name,
                                            completionDate: item.completionDate,
                                            rating: item.evaluation.rating,
                                            notes: item.evaluation.notes,
                                            improvementAreas: item.evaluation.improvementAreas,
                                            userID: this.state.userID,
                                            evaluationObject: item.evaluation,
                                            isStudentSide: true,
                                            evaluationID: item.ID,
                                            readOnly: true,
                                            newAssignment: false,
                                        })
                                    }}
                                        style={{ paddingVertical: screenHeight * 0.019 }}>
                                        <View style={styles.prevAssignmentCard} key={index}>
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <View style={{ flex: 3, justifyContent: 'center', alignItems: 'flex-start' }}>
                                                    <Text style={fontStyles.mainTextStylePrimaryDark}>{item.completionDate}</Text>
                                                </View>
                                                <View style={{ alignItems: 'center', justifyContent: 'center', flex: 3 }}>
                                                    <Text numberOfLines={1} style={fontStyles.bigTextStyleBlack}>{item.name}</Text>
                                                </View>
                                                <View style={{ flex: 3, justifyContent: 'center', alignItems: 'flex-end' }}>
                                                    <Rating readonly={true} startingValue={item.evaluation.rating} imageSize={17} />
                                                </View>
                                            </View>
                                            {item.evaluation.notes ?
                                                <Text numberOfLines={2} style={fontStyles.smallTextStyleDarkGrey}>{"Notes: " + item.evaluation.notes}</Text>
                                                : <View />
                                            }
                                            {
                                                item.assignmentType !== "None" ? (
                                                    <View style={{ flexWrap: 'wrap', height: screenHeight * 0.03, margin: screenHeight * 0.005 }}>
                                                        <Text style={[styles.corner, {
                                                            backgroundColor: item.assignmentType === strings.Reading ? colors.grey :
                                                                (item.assignmentType === strings.Memorization ? colors.green : colors.darkishGrey)
                                                        }]}>{item.assignmentType}</Text>
                                                    </View>
                                                ) : (
                                                        <View></View>
                                                    )
                                            }
                                            {item.evaluation.improvementAreas && item.evaluation.improvementAreas.length > 0 ?
                                                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', height: screenHeight * 0.03, }}>
                                                    <Text style={fontStyles.smallTextStyleDarkGrey}>{strings.ImprovementAreas}</Text>
                                                    {item.evaluation.improvementAreas.map((tag) => { return (<Text key={tag} style={styles.corner}>{tag}</Text>) })}
                                                </View>
                                                : <View />
                                            }
                                        </View>
                                    </TouchableOpacity>
                                )}
                            />
                        </ScrollView>
                    </View>
                </QCView>
            </SideMenu>
        )
    }
}

//Styles for the entire container along with the top banner
const styles = StyleSheet.create({
    topView: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: colors.veryLightGrey,
    },
    profileInfoTop: {
        paddingHorizontal: screenWidth * 0.024,
        paddingTop: screenHeight * 0.015,
        flexDirection: 'row',
        height: screenHeight * 0.125,
        borderBottomColor: colors.lightGrey,
        borderBottomWidth: 1,
    },
    profileInfoTopRight: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        paddingLeft: screenWidth * 0.075,
        paddingBottom: screenHeight * 0.007,
    },
    innerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.grey,
    },
    optionContainer: {
        backgroundColor: colors.grey,
        height: screenHeight * 0.08,
        justifyContent: 'center',
        paddingLeft: screenWidth * 0.25,
    },
    box: {
        width: screenWidth * 0.049,
        height: screenHeight * 0.03,
        marginRight: screenWidth * 0.024
    },
    profileInfoBottom: {
        flexDirection: 'row',
        paddingHorizontal: screenWidth * 0.024,
        borderBottomColor: colors.grey,
        borderBottomWidth: 1
    },
    profilePic: {
        width: screenHeight * 0.1,
        height: screenHeight * 0.1,
        borderRadius: screenHeight * 0.1 / 2,
    },
    middleView: {
        height: screenHeight * 0.15,
        borderWidth: 0.5,
        borderColor: colors.grey
    },
    bottomView: {
        flex: 3,
        backgroundColor: colors.veryLightGrey,
    },
    prevAssignmentCard: {
        flexDirection: 'column',
        height: screenHeight * 0.13,
        paddingHorizontal: screenWidth * 0.008,
        paddingVertical: screenHeight * 0.019,
        borderColor: colors.grey,
        borderWidth: (screenHeight * 0.13) * 0.0066,
        backgroundColor: colors.white,
    },
    profileInfo: {
        flexDirection: 'column',
        backgroundColor: colors.white,
        marginBottom: screenHeight * 0.015,
    },
    corner: {
        borderColor: '#D0D0D0',
        borderWidth: 1,
        borderRadius: 3,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: screenWidth * 0.012,
        marginRight: screenWidth * 0.015,
        marginTop: screenHeight * 0.007,
    },
    prevAssignments: {
        flexDirection: 'column',
        backgroundColor: colors.veryLightGrey,
        flex: 1
    },
    modal: {
        backgroundColor: colors.white,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        height: screenHeight * 0.25,
        width: screenWidth * 0.75,
        borderWidth: screenHeight * 0.003,
        borderRadius: screenHeight * 0.003,
        borderColor: colors.grey,
        shadowColor: colors.darkGrey,
        shadowOffset: { width: 0, height: screenHeight * 0.003 },
        shadowOpacity: 0.8,
        shadowRadius: screenHeight * 0.0045,
        elevation: screenHeight * 0.003,
    },
});

export default StudentMainScreen;