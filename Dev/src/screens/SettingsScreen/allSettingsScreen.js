//Screen which will provide all of the possible settings for the user to click on
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Dimensions } from 'react-native';
import colors from 'config/colors';
import { Icon } from 'react-native-elements';
import strings from 'config/strings';
import QcParentScreen from "screens/QcParentScreen";
import FirebaseFunctions from 'config/FirebaseFunctions';
import TeacherLeftNavPane from '../TeacherScreens/LeftNavPane';
import StudentLeftNavPane from '../StudentScreens/LeftNavPane';
import SideMenu from 'react-native-side-menu';
import QCView from 'QCView/QCView';
import TopBanner from 'components/TopBanner/TopBanner';
import screenStyle from 'config/screenStyle';
import fontStyles from 'config/fontStyles';
import { screenHeight, screenWidth } from 'config/dimensions';


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
            <QCView style={screenStyle.container}>
                <View style={styles.container}>
                    <TopBanner
                        LeftIconName="navicon"
                        LeftOnPress={() => this.setState({ isOpen: true })}
                        Title={strings.Settings} />
                    <TouchableOpacity style={[styles.cardStyle, { marginTop: screenHeight * 0.03 }]} onPress={() => {
                        this.props.navigation.push("CreditsScreen");
                    }}>
                        <View style={{ marginLeft: screenWidth * 0.017, }}>
                            <Text style={fontStyles.bigTextStyleBlack}>{strings.Credits}</Text>
                        </View>
                        <Icon
                            name='angle-right'
                            type='font-awesome'
                            iconStyle={{ marginRight: screenWidth * 0.05 }}
                            color={colors.primaryDark} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.cardStyle} onPress={() => {
                        Linking.openURL('https://app.termly.io/document/privacy-policy/d3e756e4-a763-4095-9ec1-3965b609d015')
                    }}>
                        <View style={{ marginLeft: screenWidth * 0.017 }}>
                            <Text style={fontStyles.bigTextStyleBlack}>{strings.PrivacyPolicy}</Text>
                        </View>
                        <Icon
                            name='angle-right'
                            type='font-awesome'
                            iconStyle={{ marginRight: screenWidth * 0.05 }}
                            color={colors.primaryDark} />
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.cardStyle, { marginTop: screenHeight * 0.03 }]} onPress={async () => {
                        await FirebaseFunctions.logOut(this.props.navigation.state.params.userID);
                        this.props.navigation.push("FirstScreenLoader");
                    }}>
                        <View style={{ marginLeft: screenWidth * 0.017 }}>
                            <Text style={fontStyles.bigTextStyleBlack}>{strings.LogOut}</Text>
                        </View>
                        <Icon
                            name='angle-right'
                            type='font-awesome'
                            iconStyle={{ marginRight: screenWidth * 0.05 }}
                            color={colors.primaryDark} />
                    </TouchableOpacity>
                </View>
            </QCView>
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
    },
    cardStyle: {
        flexDirection: 'row',
        height: screenHeight * 0.055,
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: screenHeight * 0.033,
        fontFamily: 'Montserrat-Regular',
        backgroundColor: colors.white
    },
})