//This stack navigator will be the base line for all screens across the app (with the exception of the
//tabs navigator in the teacher screens & the drawerNavigators).
import React from "react";
import { createStackNavigator, createAppContainer } from "react-navigation";
import MushafScreen from "./MushafScreen/MushafScreen";
import MushafAssignmentScreen from "./MushafScreen/MushafAssignmentScreen";
import MushafReadingScreen from "./MushafScreen/MushafReadingScreen";
import FirstScreenLoader from "./FirstScreenLoader/FirstScreenLoader";
import LoginScreen from "./AuthenticationScreens/LoginScreen";
import AccountTypeScreen from "./AuthenticationScreens/AccountTypeScreen";
import TeacherWelcomeScreen from "./TeacherScreens/TeacherWelcomeScreen";
import AddClassScreen from "./TeacherScreens/AddClass/AddClassScreen";
import ForgotPassword from "./AuthenticationScreens/ForgotPassword";
import StudentWelcomeScren from "./StudentScreens/StudentWelcomeScreen";
import allSettingsScreen from "./SettingsScreen/allSettingsScreen";
import creditsScreen from "./SettingsScreen/creditsScreen";
import ProfileScreen from "./ProfileScreen";
import AddManualStudentsScreen from "./TeacherScreens/AddStudents/AddManualStudentsScreen";
import TeacherClassTabsNavigator from "./TeacherScreens/ClassTabs/TeacherClassTabsNavigator";
import StudentClassTabsNavigator from "./StudentScreens/ClassTabs/StudentClassTabsNavigator";
import StudentProfileScreen from "./TeacherScreens/ClassTabs/StudentProfileScreen";
import EvaluationPage from "./Evaluation/EvaluationPage";
import ShareClassCodeScreen from "./TeacherScreens/AddStudents/ShareClassCodeScreen";
import strings from "config/strings";
import TopBanner from "components/TopBanner";
import FeedsScreen from "./UniversalClassScreens/FeedsScreen";

//The routes containing all the screens & their navigation options
routeConfig = {
  MushafAssignmentScreen: {
    screen: MushafAssignmentScreen,
    navigationOptions: ({ navigation }) => ({
      header: null,
      //disable swipe back to go to previous screen as it interfers with mus7af page swipes
      //https://github.com/zyadelgohary/QConnect/issues/234
      gesturesEnabled: false
    })
  },

  MushafReadingScreen: {
    screen: MushafReadingScreen,
    navigationOptions: ({ navigation }) => ({
      header: null,
      //disable swipe back to go to previous screen as it interfers with mus7af page swipes
      //https://github.com/zyadelgohary/QConnect/issues/234
      gesturesEnabled: false
    })
  },

  FirstScreenLoader: {
    screen: FirstScreenLoader,
    navigationOptions: ({ navigation }) => ({
      header: null,
      gesturesEnabled: false
    })
  },

  LoginScreen: {
    screen: LoginScreen,
    navigationOptions: ({ navigation }) => ({
      header: null,
      gesturesEnabled: false
    })
  },

  StudentCurrentClass: {
    screen: StudentClassTabsNavigator,
    navigationOptions: ({ navigation }) => ({
      header: null,
      gesturesEnabled: false
    })
  },

  AccountTypeScreen: {
    screen: AccountTypeScreen,
    navigationOptions: ({ navigation }) => ({
      header: null,
      gesturesEnabled: false
    })
  },

  ForgotPassword: {
    screen: ForgotPassword,
    navigationOptions: ({ navigation }) => ({
      header: (
        <TopBanner
          LeftIconName="angle-left"
          LeftOnPress={() => navigation.goBack()}
          Title={strings.ForgotPasswordNoQuestion}
        />
      )
    })
  },

  TeacherWelcomeScreen: {
    screen: TeacherWelcomeScreen,
    navigationOptions: ({ navigation }) => ({
      header: null,
      gesturesEnabled: false
    })
  },

  StudentWelcomeScreen: {
    screen: StudentWelcomeScren,
    navigationOptions: ({ navigation }) => ({
      header: null,
      gesturesEnabled: false
    })
  },

  AddClass: {
    screen: AddClassScreen,
    navigationOptions: ({ navigation }) => ({
      header: null,
      gesturesEnabled: false
    })
  },

  Settings: {
    screen: allSettingsScreen,
    navigationOptions: ({ navigation }) => ({
      header: null,
      gesturesEnabled: false
    })
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
      ),
    })
  },

  Profile: {
    screen: ProfileScreen,
    navigationOptions: ({ navigation }) => ({
      gesturesEnabled: false,
      header: null,
    }),
  },

  TeacherCurrentClass: {
    screen: TeacherClassTabsNavigator,
    navigationOptions: ({ navigation }) => ({
      gesturesEnabled: false,
      header: null,
    })
  },

  TeacherStudentProfile: {
    screen: StudentProfileScreen,
    navigationOptions: ({ navigation }) => ({
      gesturesEnabled: false,
      header: (
        <TopBanner
          Title={strings.StudentProfile}
          LeftIconName="angle-left"
          LeftOnPress={() =>
            navigation.push("TeacherCurrentClass", {
              userID: navigation.state.params.userID,
            })
          }
        />
      ),
    }),
  },

  EvaluationPage: {
    screen: EvaluationPage,
    navigationOptions: ({ navigation }) => ({
      gesturesEnabled: false,
      header: null,
    }),
  },

  ShareClassCode: {
    screen: ShareClassCodeScreen,
    navigationOptions: ({ navigation }) => ({
      gesturesEnabled: false,
      header: <TopBanner Title={strings.AddStudents} />
    }),
  },

  AddManualStudents: {
    screen: AddManualStudentsScreen,
    navigationOptions: ({ navigation }) => ({
      gesturesEnabled: false,
      header: (
        <TopBanner
          Title={strings.AddManualStudents}
          LeftIconName="angle-left"
          LeftOnPress={() => navigation.goBack()}
        />
      ),
    })
  }
};

//The navigator config containing all the configurations of the navigator (initialRoute, header, etc)
navigatorConfig = {
  initialRouteName: "FirstScreenLoader"
};

const MainStackStackNavigator = createStackNavigator(
  routeConfig,
  navigatorConfig
);

const MainStackNavigator = createAppContainer(MainStackStackNavigator);

export default MainStackNavigator;
