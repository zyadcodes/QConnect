import React, { Component } from 'react';
import { createBottomTabNavigator, createAppContainer, BottomTabBar } from 'react-navigation';
import { PixelRatio, Platform, Keyboard, View } from 'react-native';
import colors from '../../../../config/colors';
import { Icon, Badge, withBadge } from 'react-native-elements';
import ClassMainScreen from './ClassMainScreen';
import ClassAttendanceScreen from './ClassAttendanceScreen';
import strings from '../../../../config/strings';
import MushafAssignmentScreen from '../../MushafScreen/MushafAssignmentScreen';
import { screenHeight } from 'config/dimensions';
import FeedsScreen from '../../UniversalClassScreens/FeedsScreen';
import { string } from 'prop-types';
import { screenScale } from '../../../../config/dimensions';
import IconWithBadge from '../../../components/IconWithBadge';

var iconSizeSelected = PixelRatio.get() < 2 ? 18 : 25;
var iconSizeNotSelected = PixelRatio.get() < 2 ? 14 : 20;
var fontSize = PixelRatio.get() < 2 ? 12 : 14;
const FeedWithBadge = IconWithBadge() (Icon);

const routeConfig = {
  AttendanceTab: {
    screen: ClassAttendanceScreen,
    navigationOptions: {
      tabBarLabel: strings.Attendance,
      tabBarIcon: ({ tintColor, focused }) => (
        <Icon
          name="calendar-check-o"
          size={focused ? iconSizeSelected : iconSizeNotSelected}
          type="font-awesome"
          color={tintColor}
        />
      )
    },
  },
  ClassStudentsTab: {
    screen: ClassMainScreen,
    navigationOptions: {
      tabBarLabel: strings.Class,
      tabBarIcon: ({ tintColor, focused }) => (
        <Icon
          name="group"
          size={focused ? iconSizeSelected : iconSizeNotSelected}
          type="font-awesome"
          color={tintColor}
        />
      ),
    },
  },
  FeedsScreen: {
    screen: FeedsScreen,
    navigationOptions: ({ navigation }) => {
      return {
        tabBarLabel: strings.Feed, 
        tabBarIcon: ({tintColor, focused}) => (
          <FeedWithBadge
            hidden={false}
            type="material" 
            name="chat" size={focused ? iconSizeSelected : iconSizeSelected}
            color={tintColor}
          />
        )
      }
    }
  },
  AssignmentsTab: {
    screen: MushafAssignmentScreen,
    navigationOptions: ({ navigation }) => {
      return {
        isTeacher: true,
        assignToAllClass: true,
        userID: navigation.getParam("userID"),
        tabBarVisible: false,
        tabBarLabel: strings.Assignments,
        tabBarIcon: ({ tintColor, focused }) => (
          <Icon
            name="feather"
            size={focused ? iconSizeSelected : iconSizeNotSelected}
            type="material-community"
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
  tabBarComponent: props => <ClassTabsNavigator {...props}/>,
  // Android's default option displays tabBars on top, but iOS is bottom
  tabBarPosition: 'bottom',
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

class ClassTabsNavigator extends Component {
  state = {
    isVisible: true,
    ...TeacherBottomTabNavigator.state
  }
  componentDidMount(){
    setTimeout(() => {
      FeedsScreen.doThisWhenKeyboardHides(() => this.setState({isVisible: true})); 
      FeedsScreen.doThisWhenKeyboardShows(() => this.setState({isVisible: false}))}, 2000)
  }
  componentWillUnmount(){

  }
  render(){
    return (this.state.isVisible ? 
      <BottomTabBar style={{
        backgroundColor: colors.white,
        height: screenHeight * 0.1,
        padding: 10,
      }}
      showIcon={true}
      activeTintColor={colors.primaryDark}
      inactiveTintColor={colors.darkGrey}
      labelStyle={{fontSize}}
      {...this.props}/> 
      : 
      null);
  }
}
const TabNavigator = createAppContainer(TeacherBottomTabNavigator);

export default TabNavigator;