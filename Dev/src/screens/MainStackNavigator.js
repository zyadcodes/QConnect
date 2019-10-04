//This stack navigator will be the base line for all screens across the app (with the exception of the
//tabs navigator in the teacher screens & the drawerNavigators).
import React from 'react';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import FirstScreenLoader from './FirstScreenLoader/FirstScreenLoader';
import LoginScreen from './AuthenticationScreens/LoginScreen';
import FirstRunScreen from './FirstRun/FirstRunScreen';
import TeacherWelcomeScreen from './TeacherScreens/TeacherWelcomeScreen';
import AddClassScreen from './TeacherScreens/AddClass/AddClassScreen';
import ForgotPassword from './AuthenticationScreens/ForgotPassword';
import StudentWelcomeScren from './StudentScreens/StudentWelcomeScreen';
import allSettingsScreen from './SettingsScreen/allSettingsScreen';
import creditsScreen from './SettingsScreen/creditsScreen';
import ProfileScreen from './ProfileScreen';
import StudentMainScreen from './StudentScreens/StudentMainScreen';
import ClassTabsNavigator from './TeacherScreens/ClassTabs/ClassTabsNavigator';
import StudentProfileScreen from './TeacherScreens/ClassTabs/StudentProfileScreen';
import ClassEditScreen from './TeacherScreens/ClassTabs/ClassEditScreen';
import MushafScreen from './MushafScreen/MushafScreen'
import EvaluationPage from './Evaluation/EvaluationPage';
import strings from 'config/strings';
import TopBanner from 'components/TopBanner';

//The routes containing all the screens & their navigation options
routeConfig = {

    FirstScreenLoader: {
        screen: FirstScreenLoader,
        navigationOptions: ({ navigation }) => ({
            header: null
        }),
    },

    LoginScreen: {
        screen: LoginScreen,
        navigationOptions: ({ navigation }) => ({
            header: null
        }),
    },

    StudentCurrentClass: {
        screen: StudentMainScreen,
        navigationOptions: ({ navigation }) => ({
            header: null
        }),
    },

    FirstRunScreen: {
        screen: FirstRunScreen,
        navigationOptions: ({ navigation }) => ({
            header: null
        }),
    },

    ForgotPassword: {
        screen: ForgotPassword,
        navigationOptions: ({ navigation }) => ({
            header: <TopBanner
                LeftIconName="angle-left"
                LeftOnPress={() => navigation.goBack()}
                Title={strings.ForgotPasswordNoQuestion}
            />
        }),
    },

    TeacherWelcomeScreen: {
        screen: TeacherWelcomeScreen,
        navigationOptions: ({ navigation }) => ({
            header: null
        }),
    },

    StudentWelcomeScreen: {
        screen: StudentWelcomeScren,
        navigationOptions: ({ navigation }) => ({
            header: null
        }),
    },

    AddClass: {
        screen: AddClassScreen,
        navigationOptions: ({ navigation }) => ({
            header: null
        }),
    },

    Settings: {
        screen: allSettingsScreen,
        navigationOptions: ({ navigation }) => ({
            header: null
        }),
    },

    CreditsScreen: {
        screen: creditsScreen,
        navigationOptions: ({ navigation }) => ({
            header: (
                <TopBanner
                    LeftIconName="angle-left"
                    LeftOnPress={() => navigation.goBack()}
                    Title={strings.Credits}
                />
            )
        }),
    },

    MushafScreen: {
        screen: MushafScreen,
        navigationOptions: ({ navigation }) => ({
            header: (
                
                <TopBanner
                    LeftIconName="angle-left"
                    LeftOnPress={() => navigation.goBack()}
                    Title={"سورة النساء"}
                />
            )
        }),
    },

    Profile: {
        screen: ProfileScreen,
        navigationOptions: ({ navigation }) => ({
            header: null
        })
    },

    TeacherCurrentClass: {
        screen: ClassTabsNavigator,
        navigationOptions: ({ navigation }) => ({
            header: null
        }),
    },

    TeacherStudentProfile: {
        screen: StudentProfileScreen,
        navigationOptions: ({ navigation }) => ({
            header: (
                <TopBanner
                    LeftIconName="angle-left"
                    LeftOnPress={() => navigation.push('TeacherCurrentClass', {
                        userID: navigation.state.params.userID
                    })}
                    Title={strings.StudentProfile}
                />
            )
        })
    },

    EvaluationPage: {
        screen: EvaluationPage,
        navigationOptions: ({ navigation }) => ({
            header: null
        })
    },

    ClassEdit: {
        screen: ClassEditScreen,
        navigationOptions: ({ navigation }) => ({
            header: (
                <TopBanner
                    Title={strings.EditClass}
                    RightTextName={strings.Done}
                    RightOnPress={() => navigation.push('TeacherCurrentClass', {
                        userID: navigation.state.params.userID
                    })}
                />
            )
        })
    },

}

//The navigator config containing all the configurations of the navigator (initialRoute, header, etc)
navigatorConfig = {

    initialRouteName: 'FirstScreenLoader'

}

const MainStackStackNavigator = createStackNavigator(routeConfig, navigatorConfig);

const MainStackNavigator = createAppContainer(MainStackStackNavigator);

export default MainStackNavigator;