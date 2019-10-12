import React, { Component } from 'react';
import MainStackNavigator from './src/screens/MainStackNavigator';
import { YellowBox } from 'react-native';
import QCView from 'components/QCView';
import screenStyle from 'config/screenStyle';
import { checkNotifications, requestNotifications, check, request, PERMISSIONS } from 'react-native-permissions';

export default class App extends Component {

  state = {
    requestingPermissions: true,
  }

  async componentDidMount() {

    const isPermissionsGranted = await checkNotifications();
    if (isPermissionsGranted !== 'granted') {
      await requestNotifications();
      this.setState({ requestingPermissions: false });
    } else {
      this.setState({ requestingPermissions: false });
    }

  }

  render() {

    YellowBox.ignoreWarnings(['componentWillUpdate', 'componentWillMount', 'componentWillReceiveProps']);

    if (this.state.requestingPermissions === false) {
      return (
        <MainStackNavigator />
      );
    } else  {
      return (
        <QCView style={screenStyle.container} />
      )
    }

  }

}


