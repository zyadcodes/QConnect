import React, {Component} from 'react';
import { createBottomTabNavigator, createAppContainer, BottomTabBar } from 'react-navigation';
import { PixelRatio } from 'react-native';
import colors from 'config/colors';
import { Icon } from 'react-native-elements';
import strings from '../../../../config/strings';
import StudentMainScreen from './StudentMainScreen';
import { screenHeight } from 'config/dimensions';
import FeedsScreen from '../../UniversalClassScreens/FeedsScreen';
import { string } from 'prop-types';

var iconSizeSelected = PixelRatio.get() < 2 ? 18 : 25;
var iconSizeNotSelected = PixelRatio.get() < 2 ? 14 : 20;
var fontSize = PixelRatio.get() < 2 ? 12 : 14;

const routeConfig = {
  ClassTab: {
    screen: StudentMainScreen,
    navigationOptions: {
      tabBarLabel: strings.Class,
      tabBarIcon: ({ tintColor, focused }) => (
        <Icon
          name="home"
          size={focused ? iconSizeSelected : iconSizeNotSelected}
          type="font-awesome"
          color={tintColor}
        />
      ),
    },
  },
  FeedsScreen: {
    screen: FeedsScreen,
    navigationOptions: {
      tabBarLabel: strings.Feed,
      tabBarIcon: ({tintColor, focused}) => (
        <Icon 
          type="material" 
          name="chat" size={focused ? iconSizeSelected : iconSizeSelected}
          color={tintColor}/>
      )
    }
  },
};

const navigatorConfig = {
  initialRouteName: 'ClassTab',
  animationEnabled: false,
  swipeEnabled: true,
  tabBarComponent: props => <ClassTabsNavigator {...props}/>,
  // Android's default option displays tabBars on top, but iOS is bottom
  tabBarPosition: 'bottom',
  defaultNavigationOptions: {
    drawerLabel: 'ClassTab',
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

const StudentBottomTabNavigator = createBottomTabNavigator(
  routeConfig,
  navigatorConfig
);

class ClassTabsNavigator extends Component {
  state = {
    isVisible: true,
    ...StudentBottomTabNavigator.state
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
const TabNavigator = createAppContainer(StudentBottomTabNavigator);

export default TabNavigator;
