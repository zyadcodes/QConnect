import React from 'react';
import { StyleSheet, View, Image, TouchableOpacity, Text, Alert, ScrollView, Dimensions } from 'react-native';
import Toast, { DURATION } from 'react-native-easy-toast'
import QcActionButton from 'components/QcActionButton';
import TouchableText from 'components/TouchableText'
import teacherImages from 'config/teacherImages'
import colors from 'config/colors';
import TopBanner from 'components/TopBanner';
import ImageSelectionModal from 'components/ImageSelectionModal'
import TeacherInfoEntries from 'components/TeacherInfoEntries';
import strings from 'config/strings';
import QcParentScreen from 'screens/QcParentScreen';
import FirebaseFunctions from 'config/FirebaseFunctions';
import SideMenu from 'react-native-side-menu';
import TeacherLeftNavPane from '../screens/TeacherScreens/LeftNavPane';
import StudentLeftNavPane from '../screens/StudentScreens/LeftNavPane';
import QCView from 'components/QCView';

//To-Do: All info in this class is static, still needs to be hooked up to data base in order
//to function dynamically
export class ProfileScreen extends QcParentScreen {

    //Sets the current screen for firebase analytics
    componentDidMount() {

        if (this.props.navigation.state.params.isTeacher === true) {
            FirebaseFunctions.setCurrentScreen("Teacher Profile Screen", "ProfileScreen");
        } else {
            FirebaseFunctions.setCurrentScreen("Student Profile Screen", "ProfileScreen");
        }


    }

    state = {

        accountObject: this.props.navigation.state.params.accountObject,
        userID: this.props.navigation.state.params.userID,
        name: this.props.navigation.state.params.accountObject.name,
        phoneNumber: this.props.navigation.state.params.accountObject.phoneNumber,
        emailAddress: this.props.navigation.state.params.accountObject.emailAddress,
        profileImageID: this.props.navigation.state.params.accountObject.profileImageID,
        classes: this.props.navigation.state.params.classes,
        isTeacher: this.props.navigation.state.params.isTeacher,
        isPhoneValid: true,
        isOpen: false,
        modalVisible: false

    }

    setModalVisible(visible) {
        this.setState({ modalVisible: visible });
    }

    //to-do: method must be able to update the profile picture
    editProfilePic() {
        this.setModalVisible(true);
    }

    //this method saves the new profile information to the firestore database
    async saveProfileInfo() {
        let { userID, name, phoneNumber, emailAddress, profileImageID } = this.state;
        name = name.trim();
        phoneNumber = phoneNumber.trim();
        emailAddress = emailAddress.trim();
        if (!name ||
            !phoneNumber ||
            !emailAddress ||
            name.trim() === ""
            || phoneNumber.trim() === ""
            || emailAddress.trim() === "") {
            Alert.alert(strings.Whoops, strings.PleaseMakeSureAllFieldsAreFilledOut);
        } else if (!this.state.isPhoneValid) {
            Alert.alert(strings.Whoops, strings.InvalidPhoneNumber);
        } else {

            if (this.state.isTeacher === true) {
                await FirebaseFunctions.updateTeacherObject(userID, {
                    name,
                    phoneNumber,
                    profileImageID
                });
                this.refs.toast.show(strings.YourProfileHasBeenSaved, DURATION.LENGTH_SHORT);
                //Just goes to the first class
                this.props.navigation.push('TeacherCurrentClass', {
                    userID: userID
                });
            } else {
                await FirebaseFunctions.updateStudentProfileInfo(userID, this.state.classes, name, phoneNumber, profileImageID);
                this.refs.toast.show(strings.YourProfileHasBeenSaved, DURATION.LENGTH_SHORT);
                //Just goes to the first class
                this.props.navigation.push('StudentCurrentClass', {
                    userID: userID
                });
            }
        }
    }

    //------ event handlers to capture user input into state as user modifies the entries -----
    onNameChanged = (value) => {
        this.setState({ name: value })
    }

    onPhoneNumberChanged = (phone) => {
        this.setState({
            isPhoneValid: phone.isValidNumber(),
            phoneNumber: phone.getValue()
        });
    }

    onImageSelected(index) {
        this.setState({ profileImageID: index, })
        this.setModalVisible(false);
    }

    //-----------renders the teacher profile UI ------------------------------------
    render() {

        const { userID, emailAddress, name, phoneNumber, profileImageID } = this.state;
        return (
            <SideMenu isOpen={this.state.isOpen} menu={
                this.state.isTeacher === true ? (
                    <TeacherLeftNavPane
                        teacher={this.state.accountObject}
                        userID={userID}
                        classes={this.state.classes}
                        edgeHitWidth={0}
                        navigation={this.props.navigation} />
                ) : (
                        <StudentLeftNavPane
                            student={this.state.accountObject}
                            userID={userID}
                            classes={this.state.classes}
                            edgeHitWidth={0}
                            navigation={this.props.navigation} />
                    )
            }>
                <QCView style={{
                    flexDirection: 'column',
                    backgroundColor: colors.lightGrey,
                    width: Dimensions.get('window').width,
                    height: Dimensions.get('window').height
                }}>
                    <ScrollView style={styles.container}>
                        <TopBanner
                            LeftIconName="navicon"
                            LeftOnPress={() => this.setState({ isOpen: true })}
                            Title={strings.MyProfile} />
                        <View>
                            <ImageSelectionModal
                                visible={this.state.modalVisible}
                                images={teacherImages.images}
                                cancelText={strings.Cancel}
                                setModalVisible={this.setModalVisible.bind(this)}
                                onImageSelected={this.onImageSelected.bind(this)}
                            />
                            <View style={styles.picContainer}>
                                <Image
                                    style={styles.profilePic}
                                    source={teacherImages.images[profileImageID]} />
                                <TouchableText
                                    text={strings.UpdateProfileImage}
                                    onPress={() => this.editProfilePic()} />
                            </View>

                            <TeacherInfoEntries
                                name={name}
                                phoneNumber={phoneNumber}
                                emailAddress={emailAddress}
                                onNameChanged={this.onNameChanged}
                                noEmailField={true}
                                onPhoneNumberChanged={this.onPhoneNumberChanged}
                                onEmailAddressChanged={() => { }}
                            />
                            <View style={styles.buttonsContainer}>
                                <QcActionButton
                                    text={strings.Cancel}
                                    onPress={() => {
                                        if (this.state.isTeacher === true) {
                                            //Just goes back without saving anything
                                            this.props.navigation.push('TeacherCurrentClass', {
                                                userID: this.state.userID
                                            });
                                        } else {
                                            this.props.navigation.push('StudentCurrentClass', {
                                                userID: this.state.userID
                                            })
                                        }

                                    }}
                                />
                                <QcActionButton
                                    text={strings.Save}
                                    onPress={() => this.saveProfileInfo()}
                                />
                            </View>
                            <Toast ref="toast" />
                        </View>
                        <View style={styles.buttonsContainer}>
                            <TouchableOpacity style={styles.cardStyle} onPress={async () => {
                                await FirebaseFunctions.logOut();
                                this.props.navigation.push("FirstScreenLoader");
                            }}>
                                <Text style={styles.textStyle}>{strings.LogOut}</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </QCView>
            </SideMenu >
        )
    }

}

//Styles for the Teacher profile class
const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        backgroundColor: colors.lightGrey,
        flex: 1,
    },
    picContainer: {
        paddingTop: 25,
        alignItems: 'center',
        paddingBottom: 20,
        marginTop: 10,
        marginBottom: 10,
        backgroundColor: colors.white,
    },
    textStyle: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 20,
        color: colors.black,
    },
    profilePic: {
        width: 130,
        height: 130,
        borderRadius: 65
    },
    editInfo: {
        flexDirection: 'column',
        backgroundColor: colors.white
    },
    cardStyle: {
        flexDirection: 'row',
        marginRight: 7,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        justifyContent: 'space-between',
        fontFamily: 'Montserrat-Regular',
        backgroundColor: colors.white
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 20,
        paddingBottom: 20,
        borderBottomColor: colors.black,
        borderBottomWidth: 0.25
    },
    //Next one is the same as previous but since it's like a fencepost algorithm, it has no border
    infoRowLast: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 20,
        paddingBottom: 20,
    },
    infoTextInput: {
        paddingRight: 20,
        fontSize: 16
    },
    infoTitle: {
        paddingLeft: 20,
        fontSize: 16
    },
    buttonsContainer: {
        paddingVertical: 10,
        alignItems: 'center',
        justifyContent: 'space-evenly',
        flexDirection: 'row',
        marginTop: 10,
        backgroundColor: colors.white,
    },
    filler: {
        flexDirection: 'column',
        flex: 1
    }
});

export default ProfileScreen;

