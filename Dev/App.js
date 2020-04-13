import React, { Component } from 'react';
import MainStackNavigator from './src/screens/MainStackNavigator';
import { YellowBox, Alert } from 'react-native';
import QCView from 'components/QCView';
import screenStyle from 'config/screenStyle';
import strings from "config/strings";
import {
  checkNotifications,
  requestNotifications,
  check,
  request,
  PERMISSIONS
} from 'react-native-permissions';
import FirebaseFunctions from 'config/FirebaseFunctions';

export default class App extends Component {
  state = {
    requestingPermissions: true
  };

  async componentDidMount() {
    const isPermissionsGranted = await checkNotifications();
    if (isPermissionsGranted !== 'granted') {
      await requestNotifications(['alert', 'sound', 'badge']);
      this.setState({ requestingPermissions: false });
    } else {
      this.setState({ requestingPermissions: false });
    }
  }

  renderMainApp() {
    if (this.state.requestingPermissions === false) {
      return <MainStackNavigator />;
    } else {
      return <QCView style={screenStyle.container} />;
    }
  }
  render() {
    YellowBox.ignoreWarnings([
      'componentWillUpdate',
      'componentWillMount',
      'componentWillReceiveProps'
    ]);

    try {
      return this.renderMainApp();
    } catch (err) {
      FirebaseFunctions.logEvent('FATAL_ERROR', { err });
      Alert.alert(strings.Whoops, strings.SomethingWentWrong);
    }
  }
}
