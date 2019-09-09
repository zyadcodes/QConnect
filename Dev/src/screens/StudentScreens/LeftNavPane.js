//This will be the actual drawer items that will display from the student side when the click on
//the hamburger icon
import React from "react";
import { View, FlatList, ScrollView, StyleSheet, Modal, Text, Alert } from "react-native";
import colors from "config/colors";
import classImages from "config/classImages";
import { SafeAreaView } from "react-navigation";
import QcAppBanner from "components/QcAppBanner";
import QcDrawerItem from "components/QcDrawerItem";
import studentImages from "config/studentImages";
import strings from 'config/strings';
import QcParentScreen from "screens/QcParentScreen";
import { Input } from 'react-native-elements';
import QcActionButton from 'components/QcActionButton';
import FirebaseFunctions from 'config/FirebaseFunctions';
import LoadingSpinner from 'components/LoadingSpinner';
import QCView from 'components/QCView';
import screenStyle from 'config/screenStyle';

class LeftNavPane extends QcParentScreen {

    state = {
        student: this.props.student,
        userID: this.props.userID,
        classes: this.props.classes,
        modalVisible: false,
        classCode: "",
        isLoading: false
    }

    //Sets the screen name for firebase analytics
    componentDidMount() {

        FirebaseFunctions.setCurrentScreen("Student Left Nav Pane", "LeftNavPane");

    }

    //Joins the class by first testing if this class exists. If the class doesn't exist, then it will
    //alert the user that it does not exist. If the class does exist, then it will join the class, and
    //navigate to the current class screen.
    async joinClass() {

        this.setState({ isLoading: true });
        const { userID, classCode, student } = this.state;

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

    async openClass(id) {
        //update current class index in firebase
        await FirebaseFunctions.updateStudentObject(this.state.userID, {
            currentClassID: id
        });


        //navigate to the selected class
        this.props.navigation.push("StudentCurrentClass", {
            userID: this.state.userID
        });
    };

    //todo: change the ListItem header and footer below to the shared drawer component intead
    //generalize the QcDrawerItem to accept either an image or an icon
    render() {
        const { student, classes } = this.state;
        const { name, profileImageID } = student;

        const profileCaption = name + strings.sProfile
        const studentImageId = profileImageID;

        return (
            <QCView style={screenStyle.container}>
                <ScrollView>
                    <SafeAreaView
                        forceInset={{ top: "always", horizontal: "never" }}>
                        <View
                            style={{
                                padding: 10,
                                alignContent: "center",
                                alignItems: "center",
                                justifyContent: "center"
                            }}>
                            <QcAppBanner />
                        </View>

                        <QcDrawerItem
                            title={profileCaption}
                            image={studentImages.images[studentImageId]}
                            onPress={() => this.props.navigation.push("StudentProfileScreen")} />

                        <FlatList
                            data={classes}
                            keyExtractor={(item, index) => item.name} // fix, should be item.id (add id to classes)
                            renderItem={({ item, index }) => (
                                <QcDrawerItem
                                    title={item.name}
                                    image={classImages.images[item.classImageID]}
                                    onPress={() => this.openClass(item.ID)}
                                />
                            )} />

                        <QcDrawerItem
                            title={strings.JoinClass}
                            icon="plus"
                            onPress={() => {
                                this.setState({ modalVisible: true });
                            }} />
                        <QcDrawerItem
                            title={strings.Settings}
                            icon="cogs"
                            onPress={() => this.props.navigation.push("Settings", {
                                isStudent: true,
                                userID: this.state.userID,
                                student: this.state.student,
                                classes: this.state.classes
                            })} />

                        <Modal
                            transparent={true}
                            visible={this.state.modalVisible}
                            onRequestClode={() => { }}>
                            <View style={styles.modal}>
                                {
                                    this.state.isLoading === true ? (
                                        <View>
                                            <LoadingSpinner isVisible={true} />
                                        </View>
                                    ) : (
                                            <View>
                                                <Text style={styles.confirmationMessage}>{strings.TypeInAClassCode}</Text>
                                                <Input
                                                    type='authCode'
                                                    keyboardType='numeric'
                                                    onChangeText={(text) => { this.setState({ classCode: text }) }}
                                                    value={this.state.classCode}
                                                    keyboardType='numeric' />
                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 5 }}>
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
                        </Modal>

                    </SafeAreaView>
                </ScrollView>
            </QCView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    confirmationMessage: {
        fontSize: 16,
        marginVertical: 10,
        fontFamily: 'Montserrat-Regular',
        color: colors.darkGrey
    },
    modal: {
        backgroundColor: colors.white,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        marginTop: 230,
        borderWidth: 1,
        borderRadius: 2,
        borderColor: colors.grey,
        borderBottomWidth: 1,
        shadowColor: colors.darkGrey,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 3,
        elevation: 2,
        marginLeft: 45,
        marginRight: 45,
        paddingRight: 5,
        paddingLeft: 5
    },
});

export default LeftNavPane;

