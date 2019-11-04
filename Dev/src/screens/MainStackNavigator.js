//This stack navigator will be the base line for all screens across the app (with the exception of the
//tabs navigator in the teacher screens & the drawerNavigators).
import React from 'react';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import MushafScreen from './MushafScreen/MushafScreen'
import FirstScreenLoader from './FirstScreenLoader/FirstScreenLoader';
import LoginScreen from './AuthenticationScreens/LoginScreen';
import AccountTypeScreen from './AuthenticationScreens/AccountTypeScreen';
import TeacherWelcomeScreen from './TeacherScreens/TeacherWelcomeScreen';
import AddClassScreen from './TeacherScreens/AddClassScreen';
import ForgotPassword from './AuthenticationScreens/ForgotPassword';
import StudentWelcomeScren from './StudentScreens/StudentWelcomeScreen';
import allSettingsScreen from './SettingsScreen/allSettingsScreen';
import creditsScreen from './SettingsScreen/creditsScreen';
import ProfileScreen from './ProfileScreen';
import AddManualStudentsScreen from './TeacherScreens/AddStudents/AddManualStudentsScreen';
import StudentMainScreen from './StudentScreens/StudentMainScreen';
import ClassTabsNavigator from './TeacherScreens/ClassTabs/ClassTabsNavigator';
import StudentProfileScreen from './TeacherScreens/ClassTabs/StudentProfileScreen';
import EvaluationPage from './Evaluation/EvaluationPage';
import ShareClassCodeScreen from './TeacherScreens/AddStudents/ShareClassCodeScreen';
import strings from 'config/strings';
import TopBanner from 'components/TopBanner';

//The routes containing all the screens & their navigation options
routeConfig = {

    MushafScreen: {
        screen: MushafScreen,
        navigationOptions: ({ navigation }) => ({
            header: null
        }),
    },

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

    AccountTypeScreen: {
        screen: AccountTypeScreen,
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
                    Title={strings.StudentProfile}
                    LeftIconName="angle-left"
                    LeftOnPress={() => navigation.push('TeacherCurrentClass', {
                        userID: navigation.state.params.userID
                    })}
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

    ShareClassCode: {
        screen: ShareClassCodeScreen,
        navigationOptions: ({ navigation }) => ({
            header: (
                <TopBanner
                    Title={strings.AddStudents} />
            )
        })
    },

    AddManualStudents: {
        screen: AddManualStudentsScreen,
        navigationOptions: ({ navigation }) => ({
            header: (
                <TopBanner
                    Title={strings.AddManualStudents}
                    LeftIconName="angle-left"
                    LeftOnPress={() => navigation.goBack()} />
            )
        })
    }

}

//The navigator config containing all the configurations of the navigator (initialRoute, header, etc)
navigatorConfig = {

    initialRouteName: 'FirstScreenLoader'

}

const MainStackStackNavigator = createStackNavigator(routeConfig, navigatorConfig);

const MainStackNavigator = createAppContainer(MainStackStackNavigator);

export default MainStackNavigator;