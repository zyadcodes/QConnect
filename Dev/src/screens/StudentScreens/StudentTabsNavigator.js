import React from 'react';
import { createBottomTabNavigator, createAppContainer } from 'react-navigation';
import { PixelRatio } from 'react-native';
import colors from 'config/colors';
import { Icon } from 'react-native-elements';
import StudentMainScreen from './StudentMainScreen';
import StudentGradesScreen from './StudentGradesScreen';
import StudentOnlineMeetingScreen from 'screens/StudentOnlineMeetingScreen';
import strings from 'config/strings';
import MushafReadingScreen from 'screens/MushafScreen/MushafReadingScreen';
import { screenHeight } from 'config/dimensions';

var iconSizeSelected = PixelRatio.get() < 2 ? 18 : 25;
var iconSizeNotSelected = PixelRatio.get() < 2 ? 14 : 20;
var fontSize = PixelRatio.get() < 2 ? 12 : 14;

const routeConfig = {
  OnlineMeetingTab: {
    screen: StudentOnlineMeetingScreen,
    navigationOptions: {
      tabBarLabel: strings.MeetOnline,
      tabBarIcon: ({ tintColor, focused }) => (
        <Icon
          name="video"
          size={focused ? iconSizeSelected : iconSizeNotSelected}
          type="feather"
          color={tintColor}
        />
      ),
    },
  },
  ClassStudentsTab: {
    screen: StudentMainScreen,
    navigationOptions: {
      tabBarLabel: strings.Assignments,
      tabBarIcon: ({ tintColor, focused }) => (
        <Icon
          name="feather"
          size={focused ? iconSizeSelected : iconSizeNotSelected}
          type="material-community"
          color={tintColor}
        />
      ),
    },
  },
  GradesTab: {
    screen: StudentGradesScreen,
    navigationOptions: {
      tabBarLabel: strings.Grades,
      tabBarIcon: ({ tintColor, focused }) => (
        <Icon
          name="clipboard-check-outline"
          size={focused ? iconSizeSelected : iconSizeNotSelected}
          type="material-community"
          color={tintColor}
        />
      ),
    },
  },
  MushafTab: {
    screen: MushafReadingScreen,
    navigationOptions: ({ navigation }) => {
      return {
        isTeacher: true,
        assignToAllClass: true,
        userID: navigation.getParam("userID"),
        tabBarVisible: false,
        tabBarLabel: strings.Mushaf,
        tabBarIcon: ({ tintColor, focused }) => (
          <Icon
            name="open-book"
            size={focused ? iconSizeSelected : iconSizeNotSelected}
            type="entypo"
            color={tintColor}
          />
        ),
      };
    },
  },
};

const navigatorConfig = {
  initialRouteName: 'ClassStudentsTab',
  animationEnabled: false,
  swipeEnabled: true,
  // Android's default option displays tabBars on top, but iOS is bottom
  tabBarPosition: 'bottom',
  tabBarOptions: {
    activeTintColor: colors.primaryDark,
    inactiveTintColor: colors.darkGrey,
    style: {
      backgroundColor: colors.white,
      height: screenHeight * 0.1,
      padding: 10,
    },
    labelStyle: {
      fontSize
    },
    // Android's default showing of icons is false whereas iOS is true
    showIcon: true,
  },
  defaultNavigationOptions: {
    drawerLabel: 'ClassStudentsTab',
    drawerIcon: ({ tintColor }) => (
      <Icon
        name="group"
        size={iconSizeSelected}
        type="material"
        color={tintColor}
      />
    ),
  }
};

const TeacherBottomTabNavigator = createBottomTabNavigator(
  routeConfig,
  navigatorConfig
);

const StudentTabsNavigator = createAppContainer(TeacherBottomTabNavigator);

export default StudentTabsNavigator;
