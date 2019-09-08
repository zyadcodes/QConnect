//Screen which will provide all of the possible settings for the user to click on
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import colors from 'config/colors';
import { Icon } from 'react-native-elements';
import strings from 'config/strings';
import QcParentScreen from "screens/QcParentScreen";
import FirebaseFunctions from 'config/FirebaseFunctions';
import TeacherLeftNavPane from '../TeacherScreens/LeftNavPane';
import StudentLeftNavPane from '../StudentScreens/LeftNavPane';
import SideMenu from 'react-native-side-menu';
import TopBanner from 'components/TopBanner';

export default class AllSettingsScreen extends QcParentScreen {

    //The state controlling the side menu
    state = {
        isOpen: false
    }

    //Sets the screen for firebase analytics
    componentDidMount() {

        FirebaseFunctions.setCurrentScreen("All Settings Screen", "AllSettingsScreen");

    }

    render() {

        const content = (
            <View style={styles.container}>
                <TopBanner
                    LeftIconName="navicon"
                    LeftOnPress={() => this.setState({ isOpen: true })}
                    Title={strings.Settings} />
                <TouchableOpacity style={[styles.cardStyle, { marginTop: 25 }]} onPress={() => {
                    this.props.navigation.push("CreditsScreen");
                }}>
                    <Text style={styles.textStyle}>{strings.Credits}</Text>
                    <Icon
                        name='angle-right'
                        type='font-awesome'
                        iconStyle={{ marginRight: 20 }}
                        color={colors.primaryDark} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.cardStyle} onPress={() => {
                    Linking.openURL('https://app.termly.io/document/privacy-policy/d3e756e4-a763-4095-9ec1-3965b609d015')
                }}>
                    <Text style={styles.textStyle}>{strings.PrivacyPolicy}</Text>
                    <Icon
                        name='angle-right'
                        type='font-awesome'
                        iconStyle={{ marginRight: 20 }}
                        color={colors.primaryDark} />
                </TouchableOpacity>

                <TouchableOpacity style={[styles.cardStyle, { marginTop: 25 }]} onPress={async () => {
                    await FirebaseFunctions.logOut();
                    this.props.navigation.push("FirstScreenLoader");
                }}>
                    <Text style={styles.textStyle}>{strings.LogOut}</Text>
                    <Icon
                        name='angle-right'
                        type='font-awesome'
                        iconStyle={{ marginRight: 20 }}
                        color={colors.primaryDark} />
                </TouchableOpacity>
            </View>
        );

        return (
            this.props.navigation.state.params.isTeacher ? (
                <SideMenu isOpen={this.state.isOpen} menu={<TeacherLeftNavPane
                    teacher={this.props.navigation.state.params.teacher}
                    userID={this.props.navigation.state.params.userID}
                    classes={this.props.navigation.state.params.classes}
                    edgeHitWidth={0}
                    navigation={this.props.navigation} />}>
                    {content}
                </SideMenu>
            ) : (
                    <SideMenu isOpen={this.state.isOpen} menu={<StudentLeftNavPane
                        student={this.props.navigation.state.params.student}
                        userID={this.props.navigation.state.params.userID}
                        classes={this.props.navigation.state.params.classes}
                        edgeHitWidth={0}
                        navigation={this.props.navigation} />}>
                        {content}
                    </SideMenu>
                )
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        backgroundColor: colors.lightGrey,
        flex: 1,
    },
    cardStyle: {
        flexDirection: 'row',
        marginRight: 7,
        height: 50,
        alignItems: 'center',
        justifyContent: 'space-between',
        marginLeft: 7,
        marginTop: 30,
        fontFamily: 'Montserrat-Regular',
        backgroundColor: colors.white
    },
    textStyle: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 20,
        color: colors.black,
        marginLeft: 20
    },
})